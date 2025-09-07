import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

const SignIn = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>
        <Text className="pb-2 text-center text-xl font-semibold text-zinc-900">
          {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
        </Text>
        <Button
          onPress={() =>
            session
              ? handleSignOut()
              : authClient.signIn.social({
                  provider: "discord",
                  callbackURL: "/",
                })
          }
          title={session ? "Sign Out" : "Sign In With Discord"}
          color={"#5B65E9"}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
