"use client";
import { vars } from "nativewind";
import { semanticTokens } from "./tokens";

export const config = {
  light: vars(semanticTokens.light),
  dark: vars(semanticTokens.dark),
};
