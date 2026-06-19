"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RubyText } from "@/components/RubyText";
import { getReviewQuestionCount, startReviewMission } from "@/lib/storage";

export default function ReviewPage() {
  const router = useRouter();
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setReviewCount(getReviewQuestionCount());
  }, []);

  function startReview() {
    startReviewMission();
    router.push("/mission");
  }

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
          ホーム
        </Link>

        <section className="mt-5 rounded-lg border-2 border-emerald-300 bg-white p-6 shadow-lg">
          <p className="text-sm font-black text-emerald-700"><RubyText text="復習ミッション" /></p>
          <h1 className="mt-2 text-3xl font-black text-slate-950"><RubyText text="もう一度考える5問" /></h1>
          <p className="mt-4 text-lg font-bold leading-8 text-slate-700">
            <RubyText text="まちがえた問題、ヒントを使った問題、考え方を外した問題から出します。" />
          </p>
          <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-lg font-black text-emerald-950">
            <RubyText text={`復習候補: ${reviewCount}問`} />
          </div>
          <button
            type="button"
            onClick={startReview}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-emerald-700"
          >
            <RubyText text="復習をはじめる" />
          </button>
        </section>
      </div>
    </main>
  );
}

