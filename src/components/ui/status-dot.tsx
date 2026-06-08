import type { OperationalStatus } from "@/modules/status/status";

const statusClassName: Record<OperationalStatus, string> = {
  black: "bg-led-black",
  green: "bg-led-green",
  amber: "bg-led-amber",
  red: "bg-led-red",
};

type StatusDotProps = {
  readonly status: OperationalStatus;
  readonly label: string;
};

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`h-3 w-3 rounded-full ${statusClassName[status]}`}
      />
      <span>{label}</span>
    </span>
  );
}
