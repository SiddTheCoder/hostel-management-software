import { SignupForm } from "./signup-form";

export default function SignupPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return <SignupForm googleClientId={googleClientId} />;
}
