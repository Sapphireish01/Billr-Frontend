import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

const PALETTE = [
  "bg-primary-light text-primary",
  "bg-success-bg text-success",
  "bg-warning-bg text-warning",
  "bg-danger-bg text-danger",
];

function paletteFor(name: string) {
  const code = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return PALETTE[code % PALETTE.length];
}

export function Avatar({
  name,
  size = 32,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        paletteFor(name),
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </div>
  );
}
