import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-purple-200/30"></div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
