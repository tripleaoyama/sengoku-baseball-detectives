"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cardRarities, rarityBadge, warriorCards, type CardRarity, type OwnedCard } from "@/lib/cards";
import { getOwnedCards } from "@/lib/storage";
import { SamuraiCardFace } from "@/components/SamuraiCard";

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export default function CardsPage() {
  const [ownedCards, setOwnedCards] = useState<OwnedCard[]>([]);
  const [rarityFilter, setRarityFilter] = useState<CardRarity | "all">("all");

  useEffect(() => {
    setOwnedCards(getOwnedCards());
  }, []);

  const ownedMap = useMemo(() => new Map(ownedCards.map((card) => [card.id, card])), [ownedCards]);
  const filteredCards = useMemo(
    () => (rarityFilter === "all" ? warriorCards : warriorCards.filter((card) => card.rarity === rarityFilter)),
    [rarityFilter]
  );
  const filteredOwnedCount = filteredCards.filter((card) => ownedMap.has(card.id)).length;
  const totals = ownedCards.reduce(
    (sum, card) => {
      const count = safeNumber(card.count);
      return {
        count: sum.count + count,
        deckPower: sum.deckPower + safeNumber(card.deckPoint) * count,
        attack: sum.attack + safeNumber(card.totalAttack) * count,
        defense: sum.defense + safeNumber(card.totalDefense) * count,
      };
    },
    { count: 0, deckPower: 0, attack: 0, defense: 0 }
  );
  const totalCount = totals.count;
  const deckPower = totals.deckPower;
  const totalAttack = totals.attack;
  const totalDefense = totals.defense;
  const completeCount = ownedCards.length;

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <div className="flex gap-2">
            <Link href="/stadiums" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              城球場
            </Link>
            <Link href="/mission" className="rounded-lg bg-red-500 px-4 py-2 text-sm font-black text-white shadow-sm">
              ミッション
            </Link>
          </div>
        </div>

        <section className="rounded-lg border-2 border-amber-300 bg-white p-5 shadow-lg">
          <p className="text-sm font-black text-red-600">カードゲーム要素</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">武将カード図鑑</h1>
          <p className="mt-3 text-base font-bold leading-7 text-slate-700">
            今日の試合をクリアするとカードを1枚ゲット。カードが集まるほど、少年軍師デッキが強くなるよ。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <div className="rounded-lg bg-amber-100 p-4">
              <p className="text-sm font-black text-amber-900">所持カード</p>
              <p className="text-3xl font-black text-amber-950">{totalCount}枚</p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-4">
              <p className="text-sm font-black text-emerald-900">図鑑</p>
              <p className="text-3xl font-black text-emerald-950">{completeCount}/{warriorCards.length}</p>
            </div>
            <div className="rounded-lg bg-sky-100 p-4">
              <p className="text-sm font-black text-sky-900">デッキパワー</p>
              <p className="text-3xl font-black text-sky-950">{deckPower}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-4">
              <p className="text-sm font-black text-red-900">総合攻撃</p>
              <p className="text-3xl font-black text-red-950">{totalAttack}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-4">
              <p className="text-sm font-black text-blue-900">総合守備</p>
              <p className="text-3xl font-black text-blue-950">{totalDefense}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-lg border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-500">ランクでしぼりこみ</p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {filteredOwnedCount}/{filteredCards.length}枚
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRarityFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-black shadow-sm ${
                  rarityFilter === "all" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                すべて
              </button>
              {cardRarities.map((rarity) => (
                <button
                  key={rarity}
                  type="button"
                  onClick={() => setRarityFilter(rarity)}
                  className={`rounded-lg px-4 py-2 text-sm font-black shadow-sm ${
                    rarityFilter === rarity ? rarityBadge(rarity) : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => {
            const owned = ownedMap.get(card.id);
            return (
              <div key={card.id} className={owned ? "" : "opacity-55 grayscale"}>
                <SamuraiCardFace card={card} count={owned?.count ?? 0} locked={!owned} />
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
