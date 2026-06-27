import { AuthShell } from "../auth-shell";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      subtitle="Create a student/public account with email OTP and a password."
      title="Create your account"
    >
      <SignupForm />
    </AuthShell>
  );
}
