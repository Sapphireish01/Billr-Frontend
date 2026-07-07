import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-surface px-6 py-12">
        <div className="w-full max-w-110">{children}</div>
      </div>
    </div>
  );
}
