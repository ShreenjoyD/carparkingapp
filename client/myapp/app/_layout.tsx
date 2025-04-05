import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Appearance } from "react-native";
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark'? Colors.dark: Colors.light ;
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.headerbackground }}}>
          {/*<Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
          <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="register" options={{ title: "Registration", headerTitleAlign: "center" }} />
          <Stack.Screen name="userhome/[userId]" options={{ title: "Home" }} />
          <Stack.Screen name='checkout' options={{ title: "Checkout" }} />
          <Stack.Screen name="admin" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="admindb" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
