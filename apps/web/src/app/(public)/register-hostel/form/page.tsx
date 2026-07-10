import { PublicHostelRegistrationPage } from "@/app/_components/public-hostel-registration-page";
import { AuthGuard } from "@/components/auth-guard";

export default function RegisterHostelFormPage() {
  return (
    <AuthGuard>
      <PublicHostelRegistrationPage />
    </AuthGuard>
  );
}
