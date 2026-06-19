"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import questions from "@/data/questions.json";
import { QUESTIONS_PER_MISSION, getHistory, getTodayRecords } from "@/lib/storage";
import type { AnswerRecord, Question } from "@/types/question";

const allQuestions = questions as Question[];

function mostCommon(records: AnswerRecord[], key: keyof AnswerRecord, filter: (record: AnswerRecord) => boolean) {
  const counts = new Map<string, number>();
  records.filter(filter).forEach((record) => counts.set(String(record[key]), (counts.get(String(record[key])) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "まだ分析中";
}

function unitStats(records: AnswerRecord[]) {
  const grouped = new Map<string, AnswerRecord[]>();
  records.forEach((record) => {
    grouped.set(record.unit, [...(grouped.get(record.unit) ?? []), record]);
  });

  return [...grouped.entries()]
    .map(([unit, items]) => {
      const correct = items.filter((record) => record.isCorrect).length;
      const thinking = items.filter((record) => record.isThinkingCorrect).length;
      const hints = items.reduce((sum, record) => sum + record.hintCount, 0);
      return {
        unit,
        count: items.length,
        correctRate: Math.round((correct / items.length) * 100),
        thinkingRate: Math.round((thinking / items.length) * 100),
        hints,
      };
    })
    .sort((a, b) => a.correctRate - b.correctRate || b.hints - a.hints);
}

export default function ParentPage() {
  const [todayRecords, setTodayRecords] = useState<AnswerRecord[]>([]);
  const [history, setHistory] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    setTodayRecords(getTodayRecords());
    setHistory(getHistory());
  }, []);

  const stats = useMemo(() => {
    const correct = todayRecords.filter((record) => record.isCorrect).length;
    const thinking = todayRecords.filter((record) => record.isThinkingCorrect).length;
    const hints = todayRecords.reduce((sum, record) => sum + record.hintCount, 0);
    const strong = mostCommon(history, "examUnit", (record) => record.isCorrect);
    const weak = mostCommon(history, "examUnit", (record) => !record.isCorrect || record.hintCount > 0);
    const units = unitStats(history);
    return { correct, thinking, hints, strong, weak, units };
  }, [history, todayRecords]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <div className="flex gap-2">
            <Link href="/cards" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              カード図鑑
            </Link>
            <Link href="/mission" className="rounded-lg bg-red-500 px-4 py-2 text-sm font-black text-white shadow-sm">
              ミッション
            </Link>
            <Link href="/save" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              セーブ
            </Link>
          </div>
        </div>

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-black text-slate-500">保護者向け</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">学習分析</h1>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            ゲームの見た目の裏側で、算数・国語のどの単元につながるかを確認できます。
          </p>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-500">正解数</p><p className="text-2xl font-black">{stats.correct}/{todayRecords.length || QUESTIONS_PER_MISSION}</p></div>
          <div className="rounded-lg bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-500">ヒント使用</p><p className="text-2xl font-black">{stats.hints}回</p></div>
          <div className="rounded-lg bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-500">考え方も正解</p><p className="text-2xl font-black">{stats.thinking}回</p></div>
          <div className="rounded-lg bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-500">履歴</p><p className="text-2xl font-black">{history.length}問</p></div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">得意そうなカテゴリ</h2>
            <p className="mt-2 text-lg font-bold text-emerald-700">{stats.strong}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">苦手そうなカテゴリ</h2>
            <p className="mt-2 text-lg font-bold text-red-700">{stats.weak}</p>
          </div>
        </section>

        <section className="mt-4 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">単元別の様子</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3">単元</th>
                  <th className="py-2 pr-3">回数</th>
                  <th className="py-2 pr-3">正答率</th>
                  <th className="py-2 pr-3">考え方正解率</th>
                  <th className="py-2 pr-3">ヒント</th>
                </tr>
              </thead>
              <tbody>
                {stats.units.length === 0 && (
                  <tr><td className="py-3 font-bold text-slate-600" colSpan={5}>まだ分析できる履歴がありません。</td></tr>
                )}
                {stats.units.map((unit) => (
                  <tr key={unit.unit} className="border-b border-slate-100">
                    <td className="py-3 pr-3 font-black text-slate-900">{unit.unit}</td>
                    <td className="py-3 pr-3 font-bold">{unit.count}問</td>
                    <td className="py-3 pr-3 font-bold">{unit.correctRate}%</td>
                    <td className="py-3 pr-3 font-bold">{unit.thinkingRate}%</td>
                    <td className="py-3 pr-3 font-bold">{unit.hints}回</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
            正答率が低い単元、またはヒントが多い単元から、単元別ミッションや復習ミッションで戻ると効果的です。
          </p>
        </section>

        <section className="mt-4 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">今日取り組んだ問題</h2>
          <div className="mt-4 grid gap-3">
            {todayRecords.length === 0 && <p className="font-bold text-slate-600">今日はまだ取り組みがありません。</p>}
            {todayRecords.map((record) => {
              const question = allQuestions.find((q) => q.id === record.questionId);
              return (
                <article key={`${record.questionId}-${record.completedAt}`} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black">{question?.title ?? record.questionId}</h3>
                      <p className="mt-1 text-sm font-bold text-slate-600">
                        {record.category} / {record.unit} / {record.examUnit}
                      </p>
                    </div>
                    <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black">
                      {record.isCorrect ? "正解" : "再挑戦ポイントあり"}
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-700">考え方: {record.selectedThinking}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">中学受験への接続: {question?.examRelevance}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">声かけ: {question?.parentTip}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">親向け声かけコメント</h2>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            条件整理や読解でヒントを使っていても、答えより「表にした」「前の文に戻った」「順番に書いた」行動をほめてください。
            今日の単元は、将来の中学受験で必要になる読み取りと整理の土台です。
          </p>
        </section>
      </div>
    </main>
  );
}
