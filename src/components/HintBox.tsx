"use client";

import { RubyText } from "./RubyText";

type HintBoxProps = {
  hints: [string, string, string];
  shownCount: number;
  onShowHint: () => void;
};

export function HintBox({ hints, shownCount, onShowHint }: HintBoxProps) {
  return (
    <section className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-amber-950"><RubyText text="作戦ヒント" /></h3>
          <p className="text-sm font-bold text-amber-800"><RubyText text="3段階まで見られるよ" /></p>
        </div>
        <button
          type="button"
          onClick={onShowHint}
          disabled={shownCount >= 3}
          className="rounded-lg bg-amber-500 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-amber-600 disabled:bg-stone-300"
        >
          <RubyText text="ヒントを見る" />
        </button>
      </div>
      {shownCount > 0 && (
        <ol className="mt-4 space-y-2">
          {hints.slice(0, shownCount).map((hint, index) => (
            <li key={hint} className="rounded-lg bg-white p-3 text-base font-bold text-stone-800">
              ヒント{index + 1}: <RubyText text={hint} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
