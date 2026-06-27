import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { AuthSession } from "../api/client";
import { LoginScreen } from "../screens/LoginScreen";
import { OtpVerificationScreen } from "../screens/OtpVerificationScreen";
import { PublicHostelDetailScreen } from "../screens/PublicHostelDetailScreen";
import { PublicHomeScreen } from "../screens/PublicHomeScreen";
import { ResidentActivationScreen } from "../screens/ResidentActivationScreen";
import { ResidentComplaintsScreen } from "../screens/ResidentComplaintsScreen";
import { ResidentFoodScreen } from "../screens/ResidentFoodScreen";
import { ResidentHomeScreen } from "../screens/ResidentHomeScreen";
import { ResidentNightStatusScreen } from "../screens/ResidentNightStatusScreen";
import { ResidentNoticesScreen } from "../screens/ResidentNoticesScreen";
import { ResidentNotificationsScreen } from "../screens/ResidentNotificationsScreen";
import { ResidentPaymentsScreen } from "../screens/ResidentPaymentsScreen";
import { ResidentProfileScreen } from "../screens/ResidentProfileScreen";
import { ResidentReferralScreen } from "../screens/ResidentReferralScreen";
import { ResidentReviewsScreen } from "../screens/ResidentReviewsScreen";
import { ResidentSOSScreen } from "../screens/ResidentSOSScreen";
import { SignupScreen } from "../screens/SignupScreen";

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: {
    channel: "email";
    challengeId: string;
    email: string;
    identifier: string;
    name: string;
    password: string;
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
  ResidentComplaints: {
    session: AuthSession;
  };
  ResidentNightStatus: {
    session: AuthSession;
  };
  ResidentNotices: {
    session: AuthSession;
  };
  ResidentNotifications: {
    session: AuthSession;
  };
  ResidentPayments: {
    session: AuthSession;
  };
  ResidentProfile: {
    session: AuthSession;
  };
  ResidentReferral: {
    session: AuthSession;
  };
  ResidentReviews: {
    session: AuthSession;
  };
  ResidentSOS: {
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
          component={ResidentComplaintsScreen}
          name="ResidentComplaints"
          options={{ title: "Complaints" }}
        />
        <Stack.Screen
          component={ResidentNightStatusScreen}
          name="ResidentNightStatus"
          options={{ title: "Night Status" }}
        />
        <Stack.Screen
          component={ResidentNoticesScreen}
          name="ResidentNotices"
          options={{ title: "Notices" }}
        />
        <Stack.Screen
          component={ResidentSOSScreen}
          name="ResidentSOS"
          options={{ title: "SOS" }}
        />
        <Stack.Screen
          component={ResidentReviewsScreen}
          name="ResidentReviews"
          options={{ title: "Reviews" }}
        />
        <Stack.Screen
          component={ResidentReferralScreen}
          name="ResidentReferral"
          options={{ title: "Referral" }}
        />
        <Stack.Screen
          component={ResidentNotificationsScreen}
          name="ResidentNotifications"
          options={{ title: "Notifications" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
