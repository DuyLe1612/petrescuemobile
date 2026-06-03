import React, { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = { code: string; name: string };

type Props = {
  label?: string;
  valueName?: string;
  placeholder?: string;
  options: Option[];
  onSelect: (option: Option) => void;
  searchValue: string;
  onSearchChange: (text: string) => void;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
};

export const Select: React.FC<Props> = ({
  label,
  valueName,
  placeholder = "Chọn...",
  options,
  onSelect,
  searchValue,
  onSearchChange,
  disabled = false,
  loading = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <View className="w-full mb-4">
      {label ? (
        <Text className="mb-2 text-xs font-semibold text-muted-foreground">
          {label}
          {required ? <Text className="text-destructive"> *</Text> : null}
        </Text>
      ) : null}

      <View className="relative z-10">
        <Pressable
          onPress={() => !disabled && setIsOpen(!isOpen)}
          className={`flex-row items-center justify-between rounded-xl border px-3 py-3 bg-muted/20 ${
            disabled ? "opacity-50 border-border" : "border-border active:border-primary"
          }`}
        >
          <Text className={`text-sm ${valueName ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {valueName || placeholder}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            className="text-muted-foreground"
          />
        </Pressable>

        {isOpen && !disabled && (
          <View className="absolute top-[52px] left-0 right-0 rounded-xl border border-border bg-card shadow-lg p-2 max-h-48 z-50">
            <View className="flex-row items-center border-b border-border/50 px-2 py-1 mb-2">
              <Ionicons name="search" size={14} className="text-muted-foreground mr-2" />
              <TextInput
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder="Tìm kiếm..."
                className="flex-1 p-0 text-sm text-foreground"
                placeholderTextColor="rgba(125, 125, 125, 0.5)"
                autoFocus
              />
              {searchValue ? (
                <Pressable onPress={() => onSearchChange("")}>
                  <Ionicons name="close-circle" size={14} className="text-muted-foreground" />
                </Pressable>
              ) : null}
            </View>

            {loading ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <ScrollView nestedScrollEnabled className="flex-1">
                {filteredOptions.length === 0 ? (
                  <Text className="text-xs text-muted-foreground text-center py-3">
                    Không tìm thấy kết quả phù hợp
                  </Text>
                ) : (
                  filteredOptions.map((opt) => (
                    <Pressable
                      key={opt.code}
                      onPress={() => handleSelect(opt)}
                      className={`rounded-lg px-3 py-2.5 mb-0.5 active:bg-primary/10 ${
                        valueName === opt.name ? "bg-primary/10" : "bg-transparent"
                      }`}
                    >
                      <Text className={`text-sm ${valueName === opt.name ? "text-primary font-bold" : "text-foreground"}`}>
                        {opt.name}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Select;
