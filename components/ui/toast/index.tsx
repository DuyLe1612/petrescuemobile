'use client';
import React from 'react';
import { createToastHook } from '@gluestack-ui/core/toast/creator';
import { AccessibilityInfo, Text, View, ViewStyle } from 'react-native';
import {
  tva,
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import {
  Motion,
  AnimatePresence,
  MotionComponentProps,
} from '@legendapp/motion';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

const useToast = createToastHook(MotionView, AnimatePresence);
const SCOPE = 'TOAST';

cssInterop(MotionView, { className: 'style' });

const toastStyle = tva({
  base: 'm-1 gap-1 rounded-lg border p-4 shadow-hard-5 web:pointer-events-auto',
  variants: {
    action: {
      error: 'border-destructive bg-destructive',
      warning: 'border-primary bg-primary',
      success: 'border-accent bg-accent',
      info: 'border-secondary bg-secondary',
      muted: 'border-border bg-card',
    },

    variant: {
      solid: '',
      outline: 'bg-card',
    },
  },
});

const toastTitleStyle = tva({
  base: 'text-left font-medium text-card-foreground',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
  parentVariants: {
    variant: {
      solid: '',
      outline: '',
    },
    action: {
      error: '',
      warning: '',
      success: '',
      info: '',
      muted: '',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'text-destructive',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'text-primary',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'text-accent',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'text-secondary-foreground',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'text-foreground',
    },
    {
      variant: 'solid',
      action: 'error',
      class: 'text-destructive-foreground',
    },
    {
      variant: 'solid',
      action: 'warning',
      class: 'text-primary-foreground',
    },
    {
      variant: 'solid',
      action: 'success',
      class: 'text-accent-foreground',
    },
    {
      variant: 'solid',
      action: 'info',
      class: 'text-secondary-foreground',
    },
    {
      variant: 'solid',
      action: 'muted',
      class: 'text-card-foreground',
    },
  ],
});

const toastDescriptionStyle = tva({
  base: 'text-left font-normal',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
  parentVariants: {
    variant: {
      solid: '',
      outline: 'text-muted-foreground',
    },
    action: {
      error: '',
      warning: '',
      success: '',
      info: '',
      muted: '',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'solid',
      action: 'error',
      class: 'text-destructive-foreground',
    },
    {
      variant: 'solid',
      action: 'warning',
      class: 'text-primary-foreground',
    },
    {
      variant: 'solid',
      action: 'success',
      class: 'text-accent-foreground',
    },
    {
      variant: 'solid',
      action: 'info',
      class: 'text-secondary-foreground',
    },
    {
      variant: 'solid',
      action: 'muted',
      class: 'text-muted-foreground',
    },
    {
      variant: 'outline',
      action: 'error',
      class: 'text-destructive',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'text-primary',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'text-accent',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'text-secondary-foreground',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'text-muted-foreground',
    },
  ],
});

const Root = withStyleContext(View, SCOPE);
type IToastProps = React.ComponentProps<typeof Root> & {
  className?: string;
} & VariantProps<typeof toastStyle>;

const Toast = React.forwardRef<React.ComponentRef<typeof Root>, IToastProps>(
  function Toast(
    { className, variant = 'solid', action = 'muted', ...props },
    ref
  ) {
    return (
      <Root
        ref={ref}
        className={toastStyle({ variant, action, class: className })}
        context={{ variant, action }}
        {...props}
      />
    );
  }
);

type IToastTitleProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastTitleStyle>;

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IToastTitleProps
>(function ToastTitle({ className, size = 'md', children, ...props }, ref) {
  const { variant: parentVariant, action: parentAction } =
    useStyleContext(SCOPE);
  React.useEffect(() => {
    // Issue from react-native side
    // Hack for now, will fix this later
    AccessibilityInfo.announceForAccessibility(children as string);
  }, [children]);

  return (
    <Text
      {...props}
      ref={ref}
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      className={toastTitleStyle({
        size,
        class: className,
        parentVariants: {
          variant: parentVariant,
          action: parentAction,
        },
      })}
    >
      {children}
    </Text>
  );
});

type IToastDescriptionProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastDescriptionStyle>;

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IToastDescriptionProps
>(function ToastDescription({ className, size = 'md', ...props }, ref) {
  const { variant: parentVariant, action: parentAction } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      {...props}
      className={toastDescriptionStyle({
        size,
        class: className,
        parentVariants: {
          variant: parentVariant,
          action: parentAction,
        },
      })}
    />
  );
});

Toast.displayName = 'Toast';
ToastTitle.displayName = 'ToastTitle';
ToastDescription.displayName = 'ToastDescription';

export { useToast, Toast, ToastTitle, ToastDescription };
