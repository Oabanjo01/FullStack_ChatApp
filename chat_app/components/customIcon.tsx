import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Colors } from "root/constants/Colors";
import { CategoryIconName } from "root/constants/icons/icon";

type IconComponentProps = {
  name: CategoryIconName;
  size?: number;
  color?: string;
  style?: object;
  onPress?: () => void;
};

const IconComponent: React.FC<IconComponentProps> = ({
  name,
  size = 24,
  color = Colors.light.primary,
  style,
  onPress,
}) => {
  const isIonicons = Object.keys(Ionicons.glyphMap).includes(name);
  const Icon = isIonicons ? Ionicons : MaterialIcons;

  return (
    <Icon
      name={name as any}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default IconComponent;
