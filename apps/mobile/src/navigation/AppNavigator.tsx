import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { AuthSession } from "../api/client";
import { LoginScreen } from "../screens/LoginScreen";
import { OtpVerificationScreen } from "../screens/OtpVerificationScreen";
import { PublicHomeScreen } from "../screens/PublicHomeScreen";
import { ResidentHomeScreen } from "../screens/ResidentHomeScreen";
import { SignupScreen } from "../screens/SignupScreen";

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: {
    channel: "email" | "phone";
    challengeId: string;
    email?: string;
    identifier: string;
    name: string;
    password: string;
    phone?: string;
  };
  PublicHome: {
    session: AuthSession;
  };
  ResidentHome: {
    session: AuthSession;
  };
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          component={LoginScreen}
          name="Login"
          options={{ title: "HostelHub Login" }}
        />
        <Stack.Screen
          component={SignupScreen}
          name="Signup"
          options={{ title: "Create Account" }}
        />
        <Stack.Screen
          component={OtpVerificationScreen}
          name="OtpVerification"
          options={{ title: "Verify OTP" }}
        />
        <Stack.Screen
          component={PublicHomeScreen}
          name="PublicHome"
          options={{ headerBackVisible: false, title: "Public Mode" }}
        />
        <Stack.Screen
          component={ResidentHomeScreen}
          name="ResidentHome"
          options={{ headerBackVisible: false, title: "Resident Mode" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
