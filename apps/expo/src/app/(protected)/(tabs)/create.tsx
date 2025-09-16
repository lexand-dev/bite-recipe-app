import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import { CreateRecipeScreen } from "~/modules/recipe/ui/screens/recipe";

export default function CreatePost() {
  const router = useRouter();

  return (
    <SafeAreaView>
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
      <CreateRecipeScreen />
      {/* <PostComponent /> */}
    </SafeAreaView>
  );
}
