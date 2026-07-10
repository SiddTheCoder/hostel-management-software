import { AuthShell } from "../auth-shell";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <AuthShell
      subtitle="Create a student/public account with email OTP and a password."
      title="Create your account"
    >
      <SignupForm googleClientId={googleClientId} />
    </AuthShell>
  );
}
