import { Image, type ImageStyle, type StyleProp, View } from 'react-native';

type Props = {
  uri: string | null | undefined;
  style?: StyleProp<ImageStyle>;
};

/** Network image that falls back to an empty box (styled by the caller) when there is no URL. */
export function RemoteImage({ uri, style }: Props) {
  if (!uri) {
    return <View style={style as never} />;
  }
  return <Image source={{ uri }} style={style} resizeMode="cover" />;
}
