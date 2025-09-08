import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { KeyboardTypeOptions } from "react-native";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

interface Props<T extends FieldValues = FieldValues> {
  control: Control<T>;
  value?: string;
  placeholder?: string;
  errors?: FieldErrors<T>;
  name: Path<T>;
  disable?: boolean;
}
export const Input = <T extends FieldValues>({
  control,
  errors,
  name,
  placeholder,
  disable,
}: Props<T>) => {
  const getKeyboardType = (name: Path<T>): KeyboardTypeOptions => {
    const fieldName = name.toString().toLowerCase();

    // Map common field types to appropriate keyboard types
    const keyboardTypeMap: Record<string, KeyboardTypeOptions> = {
      email: "email-address",
      phone: "phone-pad",
      mobile: "phone-pad",
      number: "phone-pad",
      price: "decimal-pad",
      amount: "decimal-pad",
      cost: "decimal-pad",
    };

    // Find the first matching field type
    for (const [key, keyboardType] of Object.entries(keyboardTypeMap)) {
      if (fieldName.includes(key)) {
        return keyboardType;
      }
    }

    // Default keyboard type
    return "default";
  };

  return (
    <View className="mb-4 flex flex-col gap-y-2">
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            keyboardType={getKeyboardType(name)}
            className="mb-1 rounded-md border border-input bg-background px-3 py-2 text-lg leading-[1.25] text-foreground"
            placeholder={placeholder}
            onChangeText={onChange}
            value={value}
            editable={!disable}
            onBlur={onBlur}
            secureTextEntry={name.toLowerCase().includes("password")}
            autoCapitalize={
              name.toLowerCase().includes("email") ? "none" : "sentences"
            }
            autoCorrect={
              !name.toLowerCase().includes("email") &&
              !name.toLowerCase().includes("password")
            }
          />
        )}
      />
      {errors?.[name] && (
        <Text className="font-semibold text-red-500">
          {errors[name].message as string}
        </Text>
      )}
    </View>
  );
};
