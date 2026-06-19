"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { stadiums, type StadiumProgress } from "@/lib/stadiums";
import { getSelectedStadium, getStadiumProgress, selectStadium, startNewMission } from "@/lib/storage";

export default function StadiumsPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<StadiumProgress[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    setProgress(getStadiumProgress());
    setSelectedId(getSelectedStadium().id);
  }, []);

  function chooseStadium(stadiumId: string) {
    if (!selectStadium(stadiumId)) return;
    setSelectedId(stadiumId);
    startNewMission();
    router.push("/mission");
  }

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <Link href="/cards" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            カード図鑑
          </Link>
          <Link href="/units" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            単元別
          </Link>
        </div>

        <section className="rounded-lg border-2 border-amber-300 bg-white p-5 shadow-lg">
          <p className="text-sm font-black text-red-600">開拓マップ</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">城球場ロード</h1>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            球場ミッションをクリアすると、次の城球場が開放されるよ。開放済み・開拓完了の球場は、いつでも選んでもう一度挑戦できます。
          </p>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stadiums.map((stadium, index) => {
            const item = progress.find((p) => p.stadiumId === stadium.id);
            const unlocked = item?.unlocked ?? index === 0;
            const cleared = item?.cleared ?? false;
            const wins = item?.wins ?? 0;
            const width = Math.min(100, Math.round((wins / stadium.winsToClear) * 100));
            return (
              <article
                key={stadium.id}
                className={`overflow-hidden rounded-lg border-2 bg-white shadow-sm ${selectedId === stadium.id ? "border-red-400" : "border-slate-200"} ${
                  unlocked ? "" : "opacity-60 grayscale"
                }`}
              >
                <div className={`bg-gradient-to-br ${stadium.color} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-black text-slate-900">
                      {cleared ? "開拓完了" : unlocked ? "開放中" : "未開放"}
                    </span>
                    <span className="text-sm font-black">{wins}/{stadium.winsToClear}試合</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black">{stadium.name}</h2>
                  <p className="mt-2 text-sm font-bold leading-6">{stadium.theme}</p>
                </div>
                <div className="p-5">
                  <p className="text-sm font-black text-slate-500">学習テーマ</p>
                  <p className="mt-1 text-base font-bold text-slate-800">{stadium.examFocus}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stadium.questionKeywords.slice(0, 5).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-red-400" style={{ width: `${width}%` }} />
                  </div>
                  <p className="mt-4 text-sm font-bold leading-6 text-slate-700">{stadium.childMessage}</p>
                  <p className="mt-3 text-xs font-black text-slate-500">出やすいカード</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{stadium.featuredWarriors.slice(0, 4).join("・")}</p>
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => chooseStadium(stadium.id)}
                    className="mt-5 w-full rounded-lg bg-red-500 px-5 py-3 text-lg font-black text-white shadow-sm transition hover:bg-red-600 disabled:bg-slate-300"
                  >
                    {unlocked ? (cleared ? "開拓済み球場にもう一度行く" : "この球場で試合する") : "前の球場を開拓しよう"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
