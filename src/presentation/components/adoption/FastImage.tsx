import { Image, ImageProps } from "expo-image";

export const FastImage = (props: ImageProps) => {
  return <Image cachePolicy="memory-disk" contentFit="cover" transition={180} {...props} />;
};
