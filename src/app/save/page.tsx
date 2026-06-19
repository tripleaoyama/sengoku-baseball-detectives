"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { warriorCards } from "@/lib/cards";
import {
  getChildProfile,
  getHistory,
  getOwnedCards,
  getStadiumProgress,
  getTodayRecords,
  resetAllLocalSaveData,
  saveChildName,
  todayKey,
  type ChildProfile,
} from "@/lib/storage";
import { stadiums } from "@/lib/stadiums";
import { ProgressCard } from "@/components/ProgressCard";
import { RubyText } from "@/components/RubyText";

export default function SavePage() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [name, setName] = useState("");
  const [historyCount, setHistoryCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    loadSaveData();
  }, []);

  function loadSaveData() {
    const nextProfile = getChildProfile();
    const progress = getStadiumProgress();
    setProfile(nextProfile);
    setName(nextProfile.name);
    setHistoryCount(getHistory().length);
    setTodayCount(getTodayRecords().length);
    setOwnedCount(getOwnedCards().length);
    setClearedCount(progress.filter((item) => item.cleared).length);
    setUnlockedCount(progress.filter((item) => item.unlocked).length);
  }

  function saveName() {
    setProfile(saveChildName(name));
  }

  function resetData() {
    if (!confirmReset) return;
    resetAllLocalSaveData();
    setConfirmReset(false);
    loadSaveData();
  }

  const progressText = useMemo(() => {
    if (todayCount === 0) return "今日はまだこれから";
    return `今日は${todayCount}問すすんでいます`;
  }, [todayCount]);

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <div className="flex gap-2">
            <Link href="/cards" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              カード図鑑
            </Link>
            <Link href="/parent" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              親向け画面
            </Link>
          </div>
        </div>

        <section className="rounded-lg border-2 border-amber-300 bg-white p-5 shadow-lg">
          <p className="text-sm font-black text-red-600"><RubyText text="セーブデータ" /></p>
          <h1 className="mt-1 text-3xl font-black text-slate-950"><RubyText text="学習の保存状況" /></h1>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            <RubyText text="今はこのブラウザの中に自動で保存しています。同じ端末と同じブラウザなら続きから使えます。" />
          </p>
        </section>

        <section className="mt-5 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950"><RubyText text="子どもの名前" /></h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="名前を入れてね"
              className="min-h-12 flex-1 rounded-lg border-2 border-slate-200 px-4 text-lg font-bold outline-none focus:border-red-400"
            />
            <button
              type="button"
              onClick={saveName}
              className="rounded-lg bg-red-500 px-6 py-3 text-lg font-black text-white shadow-sm transition hover:bg-red-600"
            >
              <RubyText text="名前を保存" />
            </button>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-600">
            保存中: {profile?.name ? `${profile.name}さん` : "まだ名前がありません"}
          </p>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <ProgressCard label="今日の進み具合" value={progressText} tone="blue" />
          <ProgressCard label="総学習問題数" value={`${historyCount}問`} tone="green" />
          <ProgressCard label="所持カード" value={`${ownedCount}/${warriorCards.length}`} tone="gold" />
          <ProgressCard label="開放球場" value={`${unlockedCount}/${stadiums.length}`} tone="red" />
          <ProgressCard label="開拓済み球場" value={`${clearedCount}/${stadiums.length}`} tone="blue" />
        </section>

        <section className="mt-5 rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">保存されている内容</h2>
          <div className="mt-4 grid gap-2 text-base font-bold text-slate-700 sm:grid-cols-2">
            <p>学習日・問題ID・正誤</p>
            <p>考え方の選択・ヒント回数</p>
            <p>カード所持情報</p>
            <p>球場の開拓状況</p>
            <p>子どもの名前</p>
            <p>現在のミッション</p>
          </div>
          <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-950">
            この簡単版はLocalStorage保存です。将来Supabase版にするときは、この保存内容をユーザーIDつきのデータベースへ移せます。
          </p>
        </section>

        <section className="mt-5 rounded-lg border-2 border-red-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-red-700">データリセット</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            学習履歴、カード、球場進捗、名前をこのブラウザから消します。やり直したいときだけ使ってください。
          </p>
          <label className="mt-4 flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm font-black text-red-900">
            <input type="checkbox" checked={confirmReset} onChange={(event) => setConfirmReset(event.target.checked)} />
            リセットすることを確認しました
          </label>
          <button
            type="button"
            disabled={!confirmReset}
            onClick={resetData}
            className="mt-4 rounded-lg bg-red-600 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-red-700 disabled:bg-slate-300"
          >
            このブラウザのセーブデータを消す
          </button>
        </section>

        <p className="mt-5 text-xs font-bold text-slate-500">
          保存日: {todayKey()} / プロフィールID: {profile?.id ?? "未作成"}
        </p>
      </div>
    </main>
  );
}
