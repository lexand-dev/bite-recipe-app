import { Image, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Logo = () => {
  return (
    <Image source={require("@/assets/icon.png")} className="ml-0 mr-4 size-8" />
  );
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Bite",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            // fontFamily: "AvenirNext-Regular",
          },
          headerLeft: () => <Logo />,
          headerRight: () => (
            <Link href="/bookmark" asChild>
              <Pressable style={{ marginVertical: 8 }} hitSlop={20}>
                <MaterialCommunityIcons
                  name="bookmark-minus-outline"
                  size={28}
                  color="black"
                  style={{ marginRight: 0 }}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
