import type { AnswerRecord } from "@/types/question";
import { QUESTIONS_PER_MISSION, titleFor } from "@/lib/storage";
import { ProgressCard } from "./ProgressCard";
import { RubyText } from "./RubyText";

export function ResultSummary({ records }: { records: AnswerRecord[] }) {
  const correct = records.filter((record) => record.isCorrect).length;
  const thinking = records.filter((record) => record.isThinkingCorrect).length;
  const hints = records.reduce((sum, record) => sum + record.hintCount, 0);
  const title = titleFor(records);

  return (
    <section className="rounded-lg border-2 border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900"><RubyText text="今日の試合結果" /></h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <ProgressCard label="正解数" value={`${correct}/${records.length || QUESTIONS_PER_MISSION}`} tone="green" />
        <ProgressCard label="ヒント" value={`${hints}回`} tone="gold" />
        <ProgressCard label="考え方も正解" value={`${thinking}回`} tone="blue" />
        <ProgressCard label="称号" value={title} tone="red" />
      </div>
      <p className="mt-4 rounded-lg bg-sky-50 p-4 text-base font-bold text-sky-950">
        {records.length > 0 && correct >= Math.ceil(records.length * 0.8)
          ? <RubyText text={`${records.length}問トレーニング完了。今日の学習セットをよく走りきったね！`} />
          : <RubyText text="よく考えたね。次の作戦でさらに強くなろう。" />}
      </p>
    </section>
  );
}
