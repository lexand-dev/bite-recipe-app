import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

export default function ProfileScreen() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login"); // redirect to login page
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <View className="flex flex-1 items-center justify-center bg-white px-4">
      <Text className="text-2xl font-bold">Profile Screen</Text>
      <Text className="pb-2 text-center text-xl font-semibold text-zinc-900">
        {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
      </Text>

      <Button onPress={handleSignOut} title="Sign Out" color="#FF3B30" />
    </View>
  );
}
