"use client";
import { vars } from "nativewind";

// Semantic design tokens (shadcn-style) for NativeWind.
// NOTE: NativeWind vars currently expects RGB triplets; OKLCH values from the spec
// are approximated into sRGB here.
export const config = {
  light: vars({
    // Core
    "--background": "255 255 255",
    "--foreground": "23 23 23",

    "--card": "255 255 255",
    "--card-foreground": "23 23 23",

    "--popover": "255 255 255",
    "--popover-foreground": "23 23 23",

    // Brand
    "--primary": "38 38 38",
    "--primary-foreground": "252 252 252",

    // Neutral surfaces
    "--secondary": "247 247 247",
    "--secondary-foreground": "38 38 38",

    "--muted": "247 247 247",
    "--muted-foreground": "125 125 125",

    "--accent": "247 247 247",
    "--accent-foreground": "38 38 38",

    // States
    "--destructive": "220 38 38",
    "--destructive-foreground": "220 38 38",

    // Borders / input / focus
    "--border": "235 235 235",
    "--input": "235 235 235",
    "--ring": "176 176 176",

    // Charts
    "--chart-1": "234 125 40",
    "--chart-2": "41 160 167",
    "--chart-3": "47 79 110",
    "--chart-4": "247 197 79",
    "--chart-5": "245 180 66",

    // Radius (not used by NativeWind colors, but kept for parity)
    "--radius": "0.625rem",

    // Sidebar
    "--sidebar": "252 252 252",
    "--sidebar-foreground": "23 23 23",
    "--sidebar-primary": "38 38 38",
    "--sidebar-primary-foreground": "252 252 252",
    "--sidebar-accent": "247 247 247",
    "--sidebar-accent-foreground": "38 38 38",
    "--sidebar-border": "235 235 235",
    "--sidebar-ring": "176 176 176",
  }),
  dark: vars({
    // Core
    "--background": "23 23 23",
    "--foreground": "252 252 252",

    "--card": "23 23 23",
    "--card-foreground": "252 252 252",

    "--popover": "23 23 23",
    "--popover-foreground": "252 252 252",

    // Brand
    "--primary": "252 252 252",
    "--primary-foreground": "38 38 38",

    // Neutral surfaces
    "--secondary": "55 55 55",
    "--secondary-foreground": "252 252 252",

    "--muted": "55 55 55",
    "--muted-foreground": "176 176 176",

    "--accent": "55 55 55",
    "--accent-foreground": "252 252 252",

    // States
    "--destructive": "153 27 27",
    "--destructive-foreground": "239 68 68",

    // Borders / input / focus
    "--border": "55 55 55",
    "--input": "55 55 55",
    "--ring": "105 105 105",

    // Charts
    "--chart-1": "99 102 241",
    "--chart-2": "34 197 94",
    "--chart-3": "245 180 66",
    "--chart-4": "168 85 247",
    "--chart-5": "244 63 94",

    // Radius
    "--radius": "0.625rem",

    // Sidebar
    "--sidebar": "38 38 38",
    "--sidebar-foreground": "252 252 252",
    "--sidebar-primary": "99 102 241",
    "--sidebar-primary-foreground": "252 252 252",
    "--sidebar-accent": "55 55 55",
    "--sidebar-accent-foreground": "252 252 252",
    "--sidebar-border": "55 55 55",
    "--sidebar-ring": "105 105 105",
  }),
};
