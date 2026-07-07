import Image from "next/image";
import { Logo } from "@/components/ui/Logo";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden w-[45%] items-center justify-center overflow-hidden lg:flex">
      <Image
        src="/billr-bg.jpg"
        alt="Billr Background"
        fill
        sizes="45vw"
        preload={true}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to- from-black/20 via-transparent to-black/10" />
      <Logo variant="dark" className="relative text-[125.35px]" />
    </div>
  );
}
