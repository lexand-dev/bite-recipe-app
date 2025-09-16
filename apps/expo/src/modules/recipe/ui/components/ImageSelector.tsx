import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { useRecipeImageStore } from "~/modules/recipe/stores/recipeImageStore";

interface ImageSelectorProps {
  type: "cover" | "step";
  stepIndex?: number; // Solo necesario si type es 'step'
  maxImages?: number; // Solo para type 'step'
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  type,
  stepIndex,
  maxImages = type === "cover" ? 1 : 5,
}) => {
  const { images, addImage, removeImage } = useRecipeImageStore();

  const relevantImages =
    type === "cover"
      ? images.filter((img) => img.type === "cover")
      : images.filter(
          (img) => img.type === "step" && img.stepIndex === stepIndex,
        );

  const pickImage = async (source: "camera" | "gallery") => {
    if (relevantImages.length >= maxImages) {
      Alert.alert(`Solo puedes agregar hasta ${maxImages} imágenes.`);
      return;
    }

    let result: ImagePicker.ImagePickerResult;

    if (source === "camera") {
      const { granted } = await Camera.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Permiso de cámara denegado");
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets[0]) {
      addImage({
        uri: result.assets[0].uri,
        type,
        stepIndex,
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de que deseas eliminar esta imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removeImage(id),
        },
      ],
    );
  };

  return (
    <View className="my-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {relevantImages.map((image) => (
          <View key={image.id} className="relative mr-2">
            <Image
              source={{ uri: image.uri }}
              className="h-24 w-24 rounded-lg"
            />
            <TouchableOpacity
              className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
              onPress={() => handleRemoveImage(image.id)}
            >
              <Text className="text-lg font-bold text-white">×</Text>
            </TouchableOpacity>
          </View>
        ))}

        {relevantImages.length < maxImages && (
          <View className="flex-col justify-center">
            <TouchableOpacity
              className="mb-1 h-11 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
              onPress={() => pickImage("gallery")}
            >
              <Text className="text-xs text-gray-600">+ Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-11 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
              onPress={() => pickImage("camera")}
            >
              <Text className="text-xs text-gray-600">+ Cámara</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
