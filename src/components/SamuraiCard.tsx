import { pickRewardCard, rarityBadge, type WarriorCard } from "@/lib/cards";

function cardNumber(card: WarriorCard) {
  const parsed = Number(card.id.replace("warrior-", ""));
  return Number.isFinite(parsed) ? parsed : 1;
}

function SamuraiPortrait({ card, locked }: { card: WarriorCard; locked: boolean }) {
  const number = cardNumber(card);
  const helmetStyles = ["rounded-t-full", "rounded-t-lg", "rounded-t-[2rem]", "rounded-t-sm"];
  const faceColors = ["#ffe1b8", "#ffd3a3", "#f4c58d", "#ffe8c7"];
  const uniformColors = ["#fef3c7", "#dbeafe", "#dcfce7", "#fee2e2", "#ede9fe", "#cffafe"];
  const accentColors = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2"];
  const helmet = helmetStyles[number % helmetStyles.length];
  const faceColor = faceColors[number % faceColors.length];
  const uniformColor = uniformColors[number % uniformColors.length];
  const accentColor = accentColors[number % accentColors.length];
  const eyePatch = ["伊達政宗", "柳生宗矩", "山本勘助"].includes(card.warrior);
  const smile = number % 3 !== 0;
  const flagTilt = number % 2 === 0 ? "rotate-6" : "-rotate-6";

  if (locked) {
    return (
      <div className="relative mx-auto mt-5 h-36 w-36">
        <div className="absolute left-1/2 top-0 h-28 w-24 -translate-x-1/2 rounded-t-full bg-white/30" />
        <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full bg-white/80" />
        <div className="absolute left-1/2 top-20 grid h-16 w-28 -translate-x-1/2 place-items-center rounded-t-full bg-white/40 text-5xl font-black text-slate-500">
          ?
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-white/70" />
      </div>
    );
  }

  if (card.artSheet && card.artPosition) {
    return (
      <div className="relative mx-auto mt-5 h-44 w-44 overflow-hidden rounded-full border-4 border-white/80 bg-white/20 shadow-xl">
        <div
          className="h-full w-full scale-125 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${card.artSheet})`,
            backgroundPosition: card.artPosition,
            backgroundSize: "300% 200%",
          }}
        />
        <div className="absolute bottom-2 right-2 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-2xl font-black text-slate-900 shadow">
          {card.mark}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-5 h-40 w-40">
      <div className={`absolute right-2 top-3 h-16 w-10 origin-bottom ${flagTilt} rounded-sm bg-white/85 shadow`}>
        <div className="grid h-full place-items-center text-2xl font-black text-slate-900">{card.mark}</div>
      </div>
      <div className="absolute right-9 top-10 h-20 w-1 rounded-full bg-white/80" />
      <div className="absolute left-1/2 top-2 h-16 w-28 -translate-x-1/2 rounded-t-full bg-slate-900 shadow-lg" />
      <div className={`absolute left-1/2 top-4 h-14 w-32 -translate-x-1/2 ${helmet} bg-white/25`} />
      <div className="absolute left-1/2 top-3 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-white text-xl font-black text-slate-900">
        {card.portrait}
      </div>
      <div className="absolute left-1/2 top-16 h-20 w-20 -translate-x-1/2 rounded-full shadow-inner" style={{ background: faceColor }}>
        <div className="absolute left-5 top-7 h-2 w-2 rounded-full bg-slate-900" />
        {eyePatch ? (
          <>
            <div className="absolute right-4 top-6 h-4 w-4 rounded-full bg-slate-900" />
            <div className="absolute left-4 top-7 h-0.5 w-12 rotate-12 bg-slate-900" />
          </>
        ) : (
          <div className="absolute right-5 top-7 h-2 w-2 rounded-full bg-slate-900" />
        )}
        <div className={`absolute left-1/2 top-12 h-3 w-8 -translate-x-1/2 border-b-4 border-slate-900 ${smile ? "rounded-b-full" : ""}`} />
      </div>
      <div className="absolute left-1/2 top-28 h-16 w-32 -translate-x-1/2 rounded-t-[2rem] border-4 border-white/50 shadow" style={{ background: uniformColor }}>
        <div className="absolute left-5 top-0 h-full w-2" style={{ background: accentColor }} />
        <div className="absolute right-5 top-0 h-full w-2" style={{ background: accentColor }} />
        <div className="absolute left-1/2 top-3 -translate-x-1/2 text-xl font-black text-slate-900">{card.mark}</div>
      </div>
    </div>
  );
}

export function SamuraiCardFace({
  card,
  count,
  locked = false,
}: {
  card: WarriorCard;
  count?: number;
  locked?: boolean;
}) {
  const stats = [
    { label: "攻撃", value: card.attack, color: "bg-red-300" },
    { label: "守備", value: card.defense, color: "bg-sky-300" },
    { label: "頭脳", value: card.brain, color: "bg-amber-300" },
    { label: "走力", value: card.speed, color: "bg-emerald-300" },
    { label: "気合", value: card.spirit, color: "bg-pink-300" },
  ];

  return (
    <div className={`relative min-h-96 overflow-hidden rounded-lg bg-gradient-to-br ${card.color} p-5 text-white shadow-xl`}>
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
      <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${rarityBadge(card.rarity)}`}>{card.rarity}</span>
          <h3 className="mt-1 text-2xl font-black">{card.name}</h3>
          <p className="mt-2 text-lg font-bold">{locked ? "？？？" : card.power}</p>
        </div>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white/20 text-3xl font-black">{card.mark}</div>
      </div>
      <SamuraiPortrait card={card} locked={locked} />
      <p className="relative mt-5 rounded-lg bg-white/15 p-3 text-sm font-bold leading-6">
        {locked ? "まだ出会っていない武将カード。試合をクリアして集めよう。" : card.skillText}
      </p>
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white/90 p-3 text-center text-slate-950">
          <p className="text-xs font-black text-red-700">総合攻撃</p>
          <p className="text-2xl font-black">{locked ? "???" : card.totalAttack}</p>
        </div>
        <div className="rounded-lg bg-white/90 p-3 text-center text-slate-950">
          <p className="text-xs font-black text-blue-700">総合守備</p>
          <p className="text-2xl font-black">{locked ? "???" : card.totalDefense}</p>
        </div>
      </div>
      <div className="relative mt-4 grid gap-2 rounded-lg bg-white/15 p-3">
        {stats.map((stat) => (
          <div key={stat.label} className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-2 text-xs font-black">
            <span>{stat.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-white/25">
              <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${locked ? 12 : stat.value}%` }} />
            </div>
            <span className="text-right">{locked ? "??" : stat.value}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-4 flex items-center justify-between text-sm font-black">
        <span>デッキ {card.deckPoint}pt</span>
        <span>{count ? `所持 ${count}枚` : "未所持"}</span>
      </div>
    </div>
  );
}

export function SamuraiCard({ seed, card }: { seed?: number; card?: WarriorCard }) {
  const reward = card ?? pickRewardCard(seed);
  return (
    <section>
      <p className="mb-2 text-sm font-black text-red-700">今日のごほうびカード</p>
      <SamuraiCardFace card={reward} count={1} />
    </section>
  );
}
