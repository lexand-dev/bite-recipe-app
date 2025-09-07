import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { authClient } from "~/utils/auth";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { data: session } = authClient.useSession();
  const shouldCreateAccount = false;
  const { colorScheme } = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ED3B4E",
          },
          contentStyle: {
            backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          },
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, title: "Home" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!session && !shouldCreateAccount}>
          <Stack.Screen
            name="(auth)/login"
            options={{ headerShown: false, title: "Login" }}
          />
          <Stack.Protected guard={shouldCreateAccount}>
            <Stack.Screen
              name="(auth)/register"
              options={{ headerShown: false, title: "Register" }}
            />
          </Stack.Protected>
        </Stack.Protected>
      </Stack>
      <StatusBar />
    </QueryClientProvider>
  );
}
