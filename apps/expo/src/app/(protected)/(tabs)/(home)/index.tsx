import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

function CreatePost() {
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
    <View className="mt-4 flex gap-2">
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
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <Text className="pb-2 text-center text-xl font-semibold text-zinc-900">
          Welcome to Bite, your personal recipe manager!
        </Text>

        <CreatePost />
      </View>
    </SafeAreaView>
  );
}
