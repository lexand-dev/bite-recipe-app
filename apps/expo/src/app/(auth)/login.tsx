import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-restricted-imports
import { z } from "zod";

import { Input } from "~/components/ui/input";
import { authClient } from "~/utils/auth";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSignIn = async (data: FormData) => {
    try {
      setIsLoading(true);
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: true,
        },
        {
          onError: (ctx) => {
            Alert.alert(
              "Error signing in",
              ctx.error.message
                ? `${ctx.error.message} verify your credentials or create a new account`
                : "An error occurred",
            );
          },
        },
      );
    } catch (error) {
      console.error("Error signing in with email and password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ED3B4E" />
        <Text className="mt-4 text-lg text-foreground">Signing In...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <View className="mx-auto mt-20 w-full max-w-96">
          <Text className="pb-2 text-center text-5xl font-bold text-foreground">
            Login <Text className="text-primary">Bite</Text> App
          </Text>
          <View className="mt-8 flex flex-col">
            <View className="mb-4 flex flex-col gap-y-2">
              <Text className="pl-1 font-semibold">Email</Text>
              <Input
                control={control}
                name="email"
                placeholder="Enter your email"
                errors={errors}
              />
            </View>

            <View className="mb-4 flex flex-col gap-y-2">
              <Text className="pl-1 font-semibold">Password</Text>
              <Input
                control={control}
                name="password"
                placeholder="Enter your password"
                errors={errors}
              />
            </View>
            <Pressable
              onPress={handleSubmit(onSignIn)}
              className="mb-4 flex items-center rounded-2xl bg-primary p-3"
            >
              <Text className="text-lg font-bold text-white">Sign In</Text>
            </Pressable>
          </View>

          <Text className="mb-4 text-center text-base font-medium text-foreground">
            OR
          </Text>

          <Pressable
            onPress={() =>
              authClient.signIn.social({
                provider: "discord",
                callbackURL: "/",
              })
            }
            className="mb-2 flex items-center rounded-2xl bg-[#5B65E9] p-3"
          >
            <Text className="text-lg font-bold text-white">
              Continue with Discord
            </Text>
          </Pressable>

          <View className="mt-4 flex flex-row justify-center">
            <Text className="text-base text-foreground">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/register")}>
              <Text className="text-base font-semibold text-primary underline">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
