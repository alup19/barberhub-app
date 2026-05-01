import { View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

type Props = { size?: number };

export function BarberLogo({ size = 64 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#e2b558",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <Circle cx="6" cy="7" r="2.2" stroke="#0a0805" strokeWidth="1.6" />
        <Circle cx="6" cy="17" r="2.2" stroke="#0a0805" strokeWidth="1.6" />
        <Line x1="8" y1="8.2" x2="20" y2="14" stroke="#0a0805" strokeWidth="1.6" strokeLinecap="round" />
        <Line x1="8" y1="15.8" x2="20" y2="10" stroke="#0a0805" strokeWidth="1.6" strokeLinecap="round" />
        <Circle cx="18" cy="12" r="1.2" fill="#0a0805" />
      </Svg>
    </View>
  );
}
