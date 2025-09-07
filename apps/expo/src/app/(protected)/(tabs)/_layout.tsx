import { Tabs } from "expo-router";

function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="discover"
        options={{ title: "Discover", headerShown: false }}
      />
      <Tabs.Screen
        name="recipes"
        options={{ title: "My Recipes", headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
}

export default TabsLayout;
