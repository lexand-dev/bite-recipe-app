import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

import { ThemedText } from "~/components/themeText";
import { ThemedView } from "~/components/ThemeView";
import { Colors } from "~/constants/Colors";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-background">
      <ThemedView className="h-full w-full">
        <ScrollView>
          <View className="mt-4 flex flex-row items-center justify-between">
            <ThemedText type="subtitle">Recent Recipes</ThemedText>
            <Feather
              className="mr-0.5"
              name="arrow-right"
              size={20}
              color={Colors.light.primary}
            />
          </View>
          <View className="mt-4 flex flex-row items-center justify-between">
            <ThemedText type="subtitle">Your Recipes</ThemedText>
            <Feather
              className="mr-0.5"
              name="arrow-right"
              size={20}
              color={Colors.light.primary}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
