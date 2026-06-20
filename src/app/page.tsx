"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { warriorCards } from "@/lib/cards";
import { getReviewQuestionCount, getSelectedStadium, getStreak, getTodayCompletedMatchCount, getTodayRecords, titleFor } from "@/lib/storage";
import type { Stadium } from "@/lib/stadiums";
import { ProgressCard } from "@/components/ProgressCard";
import { RubyText } from "@/components/RubyText";

export default function Home() {
  const [doneCount, setDoneCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [title, setTitle] = useState("見習い軍師");
  const [matchCount, setMatchCount] = useState(0);
  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const records = getTodayRecords();
    setDoneCount(records.length);
    setStreak(getStreak());
    setTitle(records.length ? titleFor(records) : "ナゾとき一番打者");
    setMatchCount(getTodayCompletedMatchCount());
    setStadium(getSelectedStadium());
    setReviewCount(getReviewQuestionCount());
  }, []);

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <nav className="flex justify-end">
          <div className="flex gap-2">
            <Link href="/cards" className="rounded-lg bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              カード図鑑
            </Link>
            <Link href="/stadiums" className="rounded-lg bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              城球場
            </Link>
            <Link href="/parent" className="rounded-lg bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              親向け画面
            </Link>
            <Link href="/save" className="rounded-lg bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              セーブ
            </Link>
          </div>
        </nav>

        <section className="mt-4 overflow-hidden rounded-lg border-2 border-amber-300 bg-white shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-10">
              <p className="w-fit rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">少年軍師の今日の試合</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
                戦国武将
                <span className="block text-red-600">ベースボール探偵団</span>
              </h1>
              <p className="mt-5 text-lg font-bold leading-8 text-slate-700">
                算数と読解の10問トレーニングに挑戦しよう。
                答えだけでなく「どう考えたか」も作戦の力になるよ。
              </p>
              {stadium && (
                <div className="mt-5 rounded-lg bg-amber-50 p-4 ring-2 ring-amber-200">
                  <p className="text-sm font-black text-amber-800">今日の城球場</p>
                  <p className="mt-1 text-xl font-black text-slate-950">{stadium.name}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{stadium.examFocus}</p>
                </div>
              )}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/mission?count=10"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-red-600"
                >
                  <RubyText text="10問ミッション" />
                </Link>
                <Link
                  href="/mission?count=5"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-amber-600"
                >
                  <RubyText text="5問ミッション" />
                </Link>
                <Link
                  href="/review"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-emerald-700"
                >
                  <RubyText text="復習ミッション" />
                </Link>
                <Link
                  href="/units"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-sky-700"
                >
                  <RubyText text="単元別ミッション" />
                </Link>
              </div>
              <div className="mt-4 rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-700">iPad用ミッション</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/ipad-lite/10/q0.html"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-lg font-black text-white shadow-sm transition hover:bg-slate-800"
                  >
                    iPad 10問
                  </Link>
                  <Link
                    href="/ipad-lite/5/q0.html"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-lg font-black text-white shadow-sm transition hover:bg-emerald-800"
                  >
                    iPad 5問
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-emerald-600 p-4 text-white sm:p-6">
              <div className="overflow-hidden rounded-lg border-2 border-white/50 bg-white/15">
                <img
                  src="/assets/hero-sengoku-baseball.png"
                  alt="少年軍師と戦国武将風の野球チームが城の球場に集まる明るいイラスト"
                  className="h-64 w-full object-cover sm:h-80 lg:h-full"
                />
              </div>
              <div className="mt-4 rounded-lg border-2 border-white/40 bg-white/15 p-4">
                <h2 className="mt-4 text-2xl font-black">大坂城球場へようこそ</h2>
                <p className="mt-3 text-base font-bold leading-7">
                  今日もゆっくり読んで、作戦を1つずつ整理しよう。考えた道すじを選べたら、それも大きなヒット！
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <ProgressCard label="今日解いた問題" value={`${doneCount}問`} tone="blue" />
          <ProgressCard label="今日の試合数" value={`${matchCount}試合`} tone="green" />
          <ProgressCard label="今日の称号" value={title} tone="gold" />
          <ProgressCard label="連続学習日数" value={`${streak}日`} tone="red" />
          <ProgressCard label="復習候補" value={`${reviewCount}問`} tone="red" />
        </section>

        <p className="mt-5 rounded-lg bg-white/90 p-4 text-lg font-black text-slate-800 shadow-sm">
          いい作戦は、あわてず読むところから。今日も10分だけ、名将への一歩を進めよう。
        </p>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border-2 border-red-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-red-700">カード作戦</p>
            <p className="mt-1 text-base font-bold text-slate-700">10問完了で武将カードを1枚ゲット。</p>
          </div>
          <div className="rounded-lg border-2 border-amber-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-amber-700">デッキパワー</p>
            <p className="mt-1 text-base font-bold text-slate-700">集めたカードで少年軍師デッキが強くなる。</p>
          </div>
          <div className="rounded-lg border-2 border-sky-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-sky-700">図鑑</p>
            <p className="mt-1 text-base font-bold text-slate-700">{warriorCards.length}名の武将カードを集めよう。</p>
          </div>
        </section>
      </div>
    </main>
  );
}
