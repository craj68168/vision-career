import AuthenticationProvider from "@/components/staff-training/AuthenticationProvider";
import StaffTrainingCategories from "@/components/staff-training/categories";

export default function Page() {
  return (
    <AuthenticationProvider>
      <StaffTrainingCategories />
    </AuthenticationProvider>
  );
}
