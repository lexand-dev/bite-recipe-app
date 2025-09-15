import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { LegendList } from "@legendapp/list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

function PostCard(props: {
  recipe: RouterOutputs["recipe"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View className="flex flex-row rounded-lg bg-muted p-4">
      <View className="flex-grow">
        <Link
          asChild
          href={{
            pathname: "/recipes/[id]",
            params: { id: props.recipe.id },
          }}
        >
          <Pressable className="">
            <Text className="text-xl font-semibold text-primary">
              {props.recipe.title}
            </Text>
            <Text className="mt-2 text-foreground">
              {props.recipe.description}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text className="font-bold uppercase text-primary">Delete</Text>
      </Pressable>
    </View>
  );
}

export default function RecipesScreen() {
  const queryClient = useQueryClient();

  const postQuery = useQuery(trpc.recipe.all.queryOptions());

  const deletePostMutation = useMutation(
    trpc.recipe.delete.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries(trpc.recipe.all.queryFilter()),
    }),
  );

  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Bite<Text className="text-primary">Recipe</Text> App
        </Text>

        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a recipe
          </Text>
        </View>

        <LegendList
          data={postQuery.data ?? []}
          estimatedItemSize={20}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <PostCard
              recipe={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
