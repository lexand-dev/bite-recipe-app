import { SafeAreaView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = useQuery(trpc.recipe.byId.queryOptions({ id }));

  if (!data) return null;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">
          {data.title}
        </Text>
        <Text className="py-4 text-foreground">{data.title}</Text>
      </View>
    </SafeAreaView>
  );
}
