"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ResultSummary } from "@/components/ResultSummary";
import { SamuraiCard } from "@/components/SamuraiCard";
import { QUESTIONS_PER_MISSION, getCurrentMission, getMissionRecords, saveMissionRewardCard, startNewMission } from "@/lib/storage";
import type { AnswerRecord } from "@/types/question";
import type { WarriorCard } from "@/lib/cards";
import { useRouter } from "next/navigation";
import { getStadiumById } from "@/lib/stadiums";

export default function ResultPage() {
  const router = useRouter();
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [rewardCard, setRewardCard] = useState<WarriorCard | null>(null);
  const [stadiumName, setStadiumName] = useState("");
  const [requiredCount, setRequiredCount] = useState(QUESTIONS_PER_MISSION);

  useEffect(() => {
    const mission = getCurrentMission();
    const missionRecords = getMissionRecords(mission?.id);
    const nextRequiredCount = mission?.questionIds.length ?? QUESTIONS_PER_MISSION;
    setRequiredCount(nextRequiredCount);
    setRecords(missionRecords);
    setStadiumName(getStadiumById(mission?.stadiumId).name);
    const rewardEligible =
      missionRecords.length >= nextRequiredCount &&
      missionRecords.every((record) => record.isCorrect && record.isThinkingCorrect);
    if (mission && rewardEligible) {
      setRewardCard(saveMissionRewardCard(missionRecords, mission.id));
    }
  }, []);

  function playAgain() {
    startNewMission();
    router.push("/mission");
  }

  const parentComment =
    records.filter((record) => record.isThinkingCorrect).length >= 2
      ? "考え方を選ぶ力が出ています。答えだけでなく、どの言葉や条件を見たかを聞いてあげるとよいです。"
      : "今日は作戦の選び方を練習しました。表にする、順に書く、本文に戻るなどの行動をほめてください。";
  const missionComplete = records.length >= requiredCount;
  const rewardEligible = missionComplete && records.every((record) => record.isCorrect && record.isThinkingCorrect);

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <Link href="/parent" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            親向け画面
          </Link>
        </div>

        {stadiumName && (
          <section className="mb-5 rounded-lg border-2 border-amber-300 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-red-600">開拓した城球場</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">{stadiumName}</h1>
            <p className="mt-2 text-sm font-bold text-slate-700">この球場の開拓ポイントが進みました。</p>
          </section>
        )}
        <ResultSummary records={records} />
        {rewardCard && (
          <div className="mt-5">
            <SamuraiCard card={rewardCard} />
            <Link
              href="/cards"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-lg font-black text-white shadow-sm transition hover:bg-amber-600"
            >
              カード図鑑を見る
            </Link>
            <Link
              href="/stadiums"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-lg font-black text-slate-800 shadow-sm ring-2 ring-amber-200 transition hover:bg-amber-50"
            >
              城球場マップを見る
            </Link>
          </div>
        )}
        {missionComplete && !rewardEligible && (
          <section className="mt-5 rounded-lg border-2 border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-amber-700">カード獲得条件</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">カードは次の試合でね</h2>
            <p className="mt-3 text-base font-bold leading-7 text-slate-700">
              武将カードは、答えと考え方の両方をすべて正解できた試合でもらえます。
              今日の直しポイントを確認して、もう一試合チャレンジしよう。
            </p>
          </section>
        )}
        <section className="mt-5 rounded-lg border-2 border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">親向けコメント</h2>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">{parentComment}</p>
        </section>
        {records.length > 0 && records.length < requiredCount && (
          <Link
            href="/mission"
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg"
          >
            残りのミッションへ
          </Link>
        )}
        {missionComplete && (
          <button
            type="button"
            onClick={playAgain}
            className="mt-5 w-full rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-red-600"
          >
            もう一試合あそぶ
          </button>
        )}
      </div>
    </main>
  );
}
