"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RubyText } from "@/components/RubyText";
import { getAvailableUnits, startUnitMission } from "@/lib/storage";

export default function UnitsPage() {
  const router = useRouter();
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    setUnits(getAvailableUnits());
  }, []);

  function start(unit: string) {
    startUnitMission(unit);
    router.push("/mission");
  }

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
          ホーム
        </Link>

        <section className="mt-5 rounded-lg border-2 border-sky-300 bg-white p-6 shadow-lg">
          <p className="text-sm font-black text-sky-700"><RubyText text="単元別ミッション" /></p>
          <h1 className="mt-2 text-3xl font-black text-slate-950"><RubyText text="今日の単元を選ぼう" /></h1>
          <p className="mt-4 text-lg font-bold leading-8 text-slate-700">
            <RubyText text="苦手な単元や、もう少し練習したい単元を選んで5問に挑戦できます。" />
          </p>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => start(unit)}
              className="rounded-lg border-2 border-sky-200 bg-white p-5 text-left text-lg font-black text-slate-900 shadow-sm transition hover:border-sky-500 hover:bg-sky-50"
            >
              <RubyText text={unit} />
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
