import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";
import { BookingProvider } from "../components/BookingContext";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#110F0E" />
      <BookingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#110F0E" },
          }}
        />
      </BookingProvider>
    </>
  );
}
