/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#EB4549";
const tintColorDark = "#EB4549"; // Keeping brand color consistent in dark mode

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    card: "#F9FAFB",
    border: "#E4E7EB",
    notification: "#FF3B30",
    primary: "#EB4549",
    secondary: "#FF9500",
    success: "#34C759",
    error: "#FF3B30",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    card: "#1C1E1F",
    border: "#2A2D2E",
    notification: "#FF453A",
    primary: "#EB4549",
    secondary: "#FF9F0A",
    success: "#30D158",
    error: "#FF453A",
  },
};
