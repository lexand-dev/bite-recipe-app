import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import type { CreateRecipeInput } from "~/modules/recipe/types";
import { useUploadImages } from "~/modules/recipe/hooks/useUploadImages";
import { CreateRecipeSchema } from "~/modules/recipe/types";
import { ImageSelector } from "~/modules/recipe/ui/components/ImageSelector";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import { useRecipeImageStore } from "../../stores/recipeImageStore";

interface UploadedImage {
  id: string;
  uri: string;
  stepIndex?: number;
  type: "cover" | "step";
  isUploading?: boolean;
  uploadedUrl?: string;
  error?: string;
}

export const CreateRecipeScreen: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { images, clearImages } = useRecipeImageStore();
  const { uploadMultipleImages, progress, isUploading } = useUploadImages();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRecipeInput>({
    resolver: zodResolver(CreateRecipeSchema),
    defaultValues: {
      ingredients: [{ name: "", order: 0 }],
      steps: [{ instruction: "", order: 0 }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  // Mutación TRPC para crear receta
  const { mutate, isPending } = useMutation(
    trpc.recipe.create.mutationOptions({
      async onSuccess() {
        Alert.alert("Éxito", "Receta creada correctamente");
        reset();
        clearImages();
        await queryClient.invalidateQueries(trpc.recipe.all.queryFilter());
      },
      onError(error) {
        Alert.alert("Error", "No se pudo crear la receta: " + error.message);
      },
    }),
  );
  console.log("pending", isPending);

  const onSubmit = (data: CreateRecipeInput) => {
    try {
      setIsProcessing(true);

      // 1. Validar que hay imágenes para subir
      if (images.length === 0) {
        Alert.alert("Atención", "Por favor, agrega al menos una imagen");
        return;
      }

      // 2. Confirmar subida
      Alert.alert(
        "Confirmar subida",
        `Se subirán ${images.length} imágenes. ¿Deseas continuar?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Subir",
            onPress: () => {
              // 3. Subir imágenes
              uploadMultipleImages(images)
                .then((uploadedImages) => {
                  // 4. Verificar que todas las imágenes se subieron correctamente
                  const failedUploads = uploadedImages.filter(
                    (img) => img.error,
                  );
                  if (failedUploads.length > 0) {
                    Alert.alert(
                      "Error parcial",
                      `${failedUploads.length} imágenes no se pudieron subir. ¿Continuar de todos modos?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Continuar",
                          onPress: () => processRecipe(data, uploadedImages),
                        },
                      ],
                    );
                    return;
                  }

                  // 5. Procesar receta con imágenes subidas
                  processRecipe(data, uploadedImages);
                })
                .catch((error) => {
                  console.error("Error uploading images:", error);
                  Alert.alert(
                    "Error",
                    "Ocurrió un error al subir las imágenes",
                  );
                });
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Ocurrió un error al procesar la receta");
    } finally {
      setIsProcessing(false);
    }
  };

  const processRecipe = (
    data: CreateRecipeInput,
    uploadedImages: UploadedImage[],
  ) => {
    // Obtener imagen de portada
    const coverImage = uploadedImages.find((img) => img.type === "cover");

    // Mapear imágenes a los pasos correspondientes
    const stepsWithImages = data.steps.map((step, index) => {
      const stepImages = uploadedImages
        .filter((img) => img.type === "step" && img.stepIndex === index)
        .map((img) => img.uploadedUrl)
        .filter((url): url is string => Boolean(url));

      return {
        ...step,
        images: stepImages,
      };
    });

    // Crear objeto final de receta
    const recipeData: CreateRecipeInput = {
      ...data,
      coverImage: coverImage?.uploadedUrl,
      steps: stepsWithImages,
    };
    console.log("Datos de la receta a enviar:", recipeData);
    // Enviar a través de TRPC
    mutate({
      ...recipeData,
      userId: session?.user.id, // Asignar userId desde la sesión actual
    });
  };

  return (
    <ScrollView className="h-full w-full p-4">
      <Text className="mb-5 text-2xl font-bold text-gray-800">
        Crear Nueva Receta
      </Text>

      {/* Imagen de portada */}
      <View className="mb-6 rounded-xl bg-white p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-700">
          Imagen de Portada
        </Text>
        <ImageSelector type="cover" />
      </View>

      {/* Información básica */}
      <View className="mb-6 rounded-xl bg-white p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-700">
          Información Básica
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border ${errors.title ? "border-red-500" : "border-gray-300"} mb-3 rounded-lg bg-white p-3 text-base`}
              placeholder="Nombre de la receta"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.title.message}
          </Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border ${errors.description ? "border-red-500" : "border-gray-300"} mb-3 min-h-[100px] rounded-lg bg-white p-3 text-base`}
              placeholder="Descripción"
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ textAlignVertical: "top" }}
            />
          )}
        />
        {errors.description && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.description.message}
          </Text>
        )}

        <View className="flex-row justify-between">
          <Controller
            control={control}
            name="cookTime"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mr-2 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-base"
                placeholder="Tiempo de cocción"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ""}
              />
            )}
          />

          <Controller
            control={control}
            name="serving"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="ml-2 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-base"
                placeholder="Porciones"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ""}
              />
            )}
          />
        </View>
      </View>

      {/* Ingredientes */}
      <View className="mb-6 rounded-xl bg-white p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-700">
          Ingredientes
        </Text>

        {ingredientFields.map((field, index) => (
          <View key={field.id} className="mb-3 flex-row items-center">
            <Controller
              control={control}
              name={`ingredients.${index}.name`}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="mr-3 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-base"
                  placeholder={`Ingrediente ${index + 1}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {ingredientFields.length > 1 && (
              <TouchableOpacity
                onPress={() => removeIngredient(index)}
                className="rounded-md bg-red-500 px-3 py-2"
              >
                <Text className="text-sm text-white">Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          className="mt-3 items-center rounded-lg bg-emerald-500 p-3"
          onPress={() =>
            appendIngredient({ name: "", order: ingredientFields.length })
          }
        >
          <Text className="text-base font-medium text-white">
            + Agregar Ingrediente
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pasos */}
      <View className="mb-6 rounded-xl bg-white p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-700">
          Instrucciones
        </Text>

        {stepFields.map((field, index) => (
          <View key={field.id} className="mb-5 rounded-lg bg-gray-50 p-4">
            <Text className="mb-3 text-base font-semibold text-gray-600">
              Paso {index + 1}
            </Text>

            <Controller
              control={control}
              name={`steps.${index}.instruction`}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border ${errors.steps?.[index]?.instruction ? "border-red-500" : "border-gray-300"} mb-3 min-h-[75px] rounded-lg bg-white p-3 text-base`}
                  placeholder="Describe este paso..."
                  multiline
                  numberOfLines={3}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ textAlignVertical: "top" }}
                />
              )}
            />

            <ImageSelector type="step" stepIndex={index} maxImages={3} />

            {stepFields.length > 1 && (
              <TouchableOpacity
                onPress={() => removeStep(index)}
                className="mt-3 self-start rounded-md bg-red-500 px-3 py-2"
              >
                <Text className="text-sm text-white">Eliminar Paso</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          className="mt-3 items-center rounded-lg bg-emerald-500 p-3"
          onPress={() =>
            appendStep({ instruction: "", order: stepFields.length })
          }
        >
          <Text className="text-base font-medium text-white">
            + Agregar Paso
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón de envío */}
      <TouchableOpacity
        className={`mb-10 mt-5 items-center rounded-xl p-4 ${isProcessing || isUploading ? "bg-gray-400" : "bg-emerald-600"}`}
        onPress={handleSubmit(onSubmit)}
        disabled={isProcessing || isUploading}
      >
        {isProcessing || isUploading ? (
          <View className="flex-row items-center">
            <ActivityIndicator color="white" />
            {isUploading && (
              <Text className="ml-2 text-lg font-bold text-white">
                Subiendo imágenes... {progress.percentage}%
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-lg font-bold text-white">Crear Receta</Text>
        )}

        {isPending && (
          <Text className="ml-2 text-lg font-bold text-white">
            Procesando...
          </Text>
        )}
      </TouchableOpacity>

      {/* Progress Bar */}
      {isUploading && (
        <View className="mb-10 mt-5">
          <View className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full bg-emerald-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </View>
          <Text className="mt-2 text-center text-sm text-gray-600">
            {progress.completed} de {progress.total} imágenes subidas
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
