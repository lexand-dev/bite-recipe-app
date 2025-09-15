import React, { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedView } from "~/components/ThemeView";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function CreatePost() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setContent] = useState("");

  const { mutate, error } = useMutation(
    trpc.recipe.create.mutationOptions({
      async onSuccess() {
        setTitle("");
        setContent("");
        await queryClient.invalidateQueries(trpc.recipe.all.queryFilter());
      },
    }),
  );

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen
        options={{
          title: "Create Recipe",
          headerBackVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="pl-4 pr-2">
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <ThemedView className="flex gap-2">
        <TextInput
          className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        {error?.data?.zodError?.fieldErrors.title && (
          <Text className="mb-2 text-destructive">
            {error.data.zodError.fieldErrors.title}
          </Text>
        )}
        <TextInput
          className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
          value={description}
          onChangeText={setContent}
          placeholder="Content"
        />
        {error?.data?.zodError?.fieldErrors.description && (
          <Text className="mb-2 text-destructive">
            {error.data.zodError.fieldErrors.description}
          </Text>
        )}
        <Pressable
          className="flex items-center rounded bg-primary p-2"
          onPress={() => {
            mutate({
              title,
              description,
              userId: session?.user.id ?? "",
            });
          }}
        >
          <Text className="text-white">Create</Text>
        </Pressable>
        {error?.data?.code === "UNAUTHORIZED" && (
          <Text className="mt-2 text-destructive">
            You need to be logged in to create a recipe
          </Text>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
