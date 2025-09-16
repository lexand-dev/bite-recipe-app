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
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSignUp = async (data: FormData) => {
    try {
      setIsLoading(true);
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onError: (ctx) => {
            Alert.alert(
              "Error signing up",
              ctx.error.message
                ? `${ctx.error.message} please try again`
                : "An error occurred",
            );
          },
        },
      );
    } catch (error) {
      console.error("Error signing up with email and password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ED3B4E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-background">
      <View className="h-full w-full bg-background p-4">
        <View className="mx-auto mt-20 w-full max-w-96">
          <Text className="pb-2 text-center text-5xl font-bold text-foreground">
            Register <Text className="text-primary">Bite</Text> App
          </Text>
          <View className="flex flex-col pt-8">
            <View className="mb-4 flex flex-col gap-y-2">
              <Text className="pl-1 font-semibold">Name</Text>
              <Input
                control={control}
                name="name"
                placeholder="Enter your name"
                errors={errors}
              />
            </View>

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
              onPress={handleSubmit(onSignUp)}
              className="mb-4 flex items-center rounded-2xl bg-primary p-3"
            >
              <Text className="text-lg font-bold text-white">Sign Up</Text>
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
            className="mb-2 flex items-center rounded bg-[#5B65E9] p-3"
          >
            <Text className="text-lg font-bold text-white">
              Continue with Discord
            </Text>
          </Pressable>

          <View className="mt-4 flex flex-row justify-center">
            <Text className="text-base text-foreground">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-base font-semibold text-primary underline">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
