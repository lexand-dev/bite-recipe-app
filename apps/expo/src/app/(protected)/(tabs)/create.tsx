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
      <ThemedView className="flex gap-2"></ThemedView>
    </SafeAreaView>
  );
}
