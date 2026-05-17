import Toast, { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastProps = ToastConfigParams<any>;

const toastBase = (props: ToastProps, color: string, icon: keyof typeof Ionicons.glyphMap) => (
  <View
    style={{
      width: "90%",
      backgroundColor: "#1B1B1B",
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: color,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    }}
  >
    <Ionicons name={icon} size={20} color={color} />
    <View style={{ flex: 1 }}>
      {props.text1 && (
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{props.text1}</Text>
      )}
      {props.text2 && (
        <Text style={{ color: "#988C81", fontSize: 12, marginTop: 2 }}>{props.text2}</Text>
      )}
    </View>
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props) => toastBase(props, "#22C55E", "checkmark-circle-outline"),
  error:   (props) => toastBase(props, "#E5484D", "close-circle-outline"),
  info:    (props) => toastBase(props, "#CC8F33", "information-circle-outline"),
};