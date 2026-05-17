import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";
import { BookingProvider } from "../components/BookingContext";
import { AuthProvider } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/toastConfig";

export default function RootLayout() {
  return (
    <AuthProvider>
      <BookingProvider>
        <StatusBar style="light" backgroundColor="#110F0E" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#110F0E" },
          }}
        />
        <Toast config={toastConfig} />
      </BookingProvider>
    </AuthProvider>
  );
}