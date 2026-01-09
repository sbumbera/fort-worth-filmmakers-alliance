import { InfoDot } from "@/components/tools/nonunioncalc/Tooltip";

export default function FieldLabel({
  title,
  help,
}: {
  title: string;
  help?: string;
}) {
  return (
    <div className="flex items-center">
      <span className="text-xs text-white/60">{title}</span>
      {help ? <InfoDot label={help} /> : null}
    </div>
  );
}
