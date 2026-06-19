import { RubyText } from "./RubyText";

type ProgressCardProps = {
  label: string;
  value: string | number;
  tone?: "gold" | "blue" | "green" | "red";
};

const tones = {
  gold: "bg-amber-100 border-amber-300 text-amber-950",
  blue: "bg-sky-100 border-sky-300 text-sky-950",
  green: "bg-emerald-100 border-emerald-300 text-emerald-950",
  red: "bg-rose-100 border-rose-300 text-rose-950",
};

export function ProgressCard({ label, value, tone = "gold" }: ProgressCardProps) {
  return (
    <div className={`rounded-lg border-2 p-4 shadow-sm ${tones[tone]}`}>
      <div className="text-sm font-bold opacity-80"><RubyText text={label} /></div>
      <div className="mt-1 text-2xl font-black"><RubyText text={value} /></div>
    </div>
  );
}
