import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
  showText = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  showText?: boolean;
}) {
  return (
    <span className={cn("font-space text-[41.43px] font-bold tracking-normal", className)}>
      {showText ? (
        <>
          <span className={variant === "dark" ? "text-navy" : "text-white"}>Bill</span>
          <span className={variant === "dark" ? "text-primary" : "text-[#8FB1FF]"}>r</span>
        </>
      ) : (
        <span className={variant === "dark" ? "text-navy" : "text-white"}>B</span>
      )}
    </span>
  );
}
