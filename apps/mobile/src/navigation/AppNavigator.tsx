import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { AuthSession } from "../api/client";
import { LoginScreen } from "../screens/LoginScreen";
import { OtpVerificationScreen } from "../screens/OtpVerificationScreen";
import { PublicHostelDetailScreen } from "../screens/PublicHostelDetailScreen";
import { PublicHomeScreen } from "../screens/PublicHomeScreen";
import { ResidentActivationScreen } from "../screens/ResidentActivationScreen";
import { ResidentFoodScreen } from "../screens/ResidentFoodScreen";
import { ResidentHomeScreen } from "../screens/ResidentHomeScreen";
import { ResidentNoticesScreen } from "../screens/ResidentNoticesScreen";
import { ResidentPaymentsScreen } from "../screens/ResidentPaymentsScreen";
import { ResidentProfileScreen } from "../screens/ResidentProfileScreen";
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
  PublicHostelDetail: {
    session: AuthSession;
    slug: string;
  };
  ResidentHome: {
    session: AuthSession;
  };
  ResidentActivation: {
    session: AuthSession;
  };
  ResidentFood: {
    session: AuthSession;
  };
  ResidentNotices: {
    session: AuthSession;
  };
  ResidentPayments: {
    session: AuthSession;
  };
  ResidentProfile: {
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
          component={PublicHostelDetailScreen}
          name="PublicHostelDetail"
          options={{ title: "Hostel Detail" }}
        />
        <Stack.Screen
          component={ResidentHomeScreen}
          name="ResidentHome"
          options={{ headerBackVisible: false, title: "Resident Mode" }}
        />
        <Stack.Screen
          component={ResidentActivationScreen}
          name="ResidentActivation"
          options={{ title: "Activate Resident Access" }}
        />
        <Stack.Screen
          component={ResidentProfileScreen}
          name="ResidentProfile"
          options={{ title: "My Profile" }}
        />
        <Stack.Screen
          component={ResidentPaymentsScreen}
          name="ResidentPayments"
          options={{ title: "Payments" }}
        />
        <Stack.Screen
          component={ResidentFoodScreen}
          name="ResidentFood"
          options={{ title: "Food" }}
        />
        <Stack.Screen
          component={ResidentNoticesScreen}
          name="ResidentNotices"
          options={{ title: "Notices" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
