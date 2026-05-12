import { Platform } from 'react-native';
import { semanticColorValues } from '@/components/ui/gluestack-ui-provider/tokens';

export const Colors = {
  light: {
    text: semanticColorValues.light.foreground,
    background: semanticColorValues.light.background,
    tint: semanticColorValues.light.primary,
    icon: semanticColorValues.light.mutedForeground,
    tabIconDefault: semanticColorValues.light.mutedForeground,
    tabIconSelected: semanticColorValues.light.primary,
  },
  dark: {
    text: semanticColorValues.dark.foreground,
    background: semanticColorValues.dark.background,
    tint: semanticColorValues.dark.primary,
    icon: semanticColorValues.dark.mutedForeground,
    tabIconDefault: semanticColorValues.dark.mutedForeground,
    tabIconSelected: semanticColorValues.dark.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
