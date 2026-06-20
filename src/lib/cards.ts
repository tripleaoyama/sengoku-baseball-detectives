"use client";

export type CardRarity = "SS" | "S" | "A" | "B" | "C";

export const cardRarities: CardRarity[] = ["SS", "S", "A", "B", "C"];

const rarityRewardWeights: Record<CardRarity, number> = {
  SS: 2,
  S: 6,
  A: 16,
  B: 30,
  C: 46,
};

export type WarriorCard = {
  id: string;
  name: string;
  warrior: string;
  power: string;
  rarity: CardRarity;
  color: string;
  mark: string;
  portrait: string;
  artSheet?: string;
  artPosition?: string;
  attack: number;
  defense: number;
  brain: number;
  speed: number;
  spirit: number;
  totalAttack: number;
  totalDefense: number;
  skillText: string;
  deckPoint: number;
};

export type OwnedCard = WarriorCard & {
  count: number;
  firstEarnedAt: string;
  lastEarnedAt: string;
};

const warriors = [
  "織田信長", "豊臣秀吉", "徳川家康", "伊達政宗", "真田幸村", "武田信玄", "上杉謙信", "明智光秀", "石田三成", "毛利元就",
  "黒田官兵衛", "竹中半兵衛", "本多忠勝", "前田利家", "加藤清正", "直江兼続", "島津義弘", "長宗我部元親", "北条氏康", "今川義元",
  "柴田勝家", "井伊直政", "真田昌幸", "真田信之", "大谷吉継", "前田慶次", "斎藤道三", "浅井長政", "松永久秀", "片倉小十郎",
  "徳川秀忠", "豊臣秀長", "蒲生氏郷", "藤堂高虎", "立花宗茂", "小早川隆景", "吉川元春", "島津義久", "島津家久", "最上義光",
  "佐竹義重", "龍造寺隆信", "大友宗麟", "鍋島直茂", "宇喜多秀家", "小西行長", "福島正則", "細川忠興", "細川藤孝", "丹羽長秀",
  "滝川一益", "榊原康政", "酒井忠次", "山県昌景", "馬場信春", "高坂昌信", "内藤昌豊", "朝倉義景", "足利義昭", "森蘭丸",
  "毛利輝元", "小早川秀秋", "安国寺恵瓊", "黒田長政", "加藤嘉明", "脇坂安治", "片桐且元", "池田輝政", "山内一豊", "堀秀政",
  "佐々成政", "荒木村重", "筒井順慶", "雑賀孫市", "九鬼嘉隆", "蜂須賀小六", "可児才蔵", "山中鹿介", "尼子経久", "宇喜多直家",
  "北条氏政", "北条氏直", "北条綱成", "太田道灌", "蘆名盛氏", "伊達成実", "支倉常長", "柳生宗矩", "宮本武蔵", "佐々木小次郎",
  "塚原卜伝", "上泉信綱", "千利休", "古田織部", "前田玄以", "増田長盛", "長束正家", "浅野長政", "南部信直", "津軽為信",
  "尼子晴久", "大内義隆", "陶晴賢", "三好長慶", "三好義継", "松平元康", "織田信忠", "織田信雄", "織田信孝", "豊臣秀次",
  "豊臣秀頼", "淀殿", "お市の方", "濃姫", "まつ", "細川ガラシャ", "立花誾千代", "甲斐姫", "井伊直虎", "寿桂尼",
  "武田勝頼", "武田信繁", "武田信虎", "諏訪御料人", "上杉景勝", "上杉景虎", "柿崎景家", "甘粕景持", "宇佐美定満", "村上義清",
  "真田信綱", "真田昌輝", "穴山梅雪", "小山田信茂", "秋山信友", "原虎胤", "飯富虎昌", "土屋昌恒", "板垣信方", "甘利虎泰",
  "島左近", "佐竹義宣", "結城秀康", "蒲生秀行", "京極高次", "京極竜子", "生駒親正", "生駒一正", "仙石秀久", "戸沢盛安",
  "蘆名盛隆", "伊達輝宗", "伊達稙宗", "伊達晴宗", "片倉重長", "留守政景", "鬼庭綱元", "最上義守", "安東愛季", "蠣崎季広",
  "里見義堯", "里見義弘", "里見義頼", "太田資正", "佐野昌綱", "由良成繁", "長野業正", "長野業盛", "上泉泰綱", "成田長泰",
  "長宗我部信親", "香宗我部親泰", "十河一存", "三好実休", "安宅冬康", "本願寺顕如", "本願寺教如", "下間頼廉", "顕如光佐", "鈴木重秀",
  "根来寺杉坊", "明石全登", "後藤又兵衛", "毛利勝永", "長宗我部盛親", "塙団右衛門", "木村重成", "薄田兼相", "大野治長", "大野治房",
  "島津歳久", "島津豊久", "新納忠元", "伊集院忠棟", "肝付兼続", "有馬晴信", "大村純忠", "大友義統", "高橋紹運", "立花道雪",
  "鍋島勝茂", "龍造寺政家", "秋月種実", "相良義陽", "阿蘇惟将", "甲斐宗運", "宗義智", "小早川秀包", "毛利秀元", "吉川広家",
  "森長可", "齋藤朝信", "真柄直隆", "鳥居元忠", "仁科盛信", "清水宗治", "鬼庭左月斎", "本庄繁長", "服部半蔵", "太原雪斎",
  "山本勘助", "本多正信", "成田長親", "岡部元信", "北条早雲", "北条氏照", "北条氏邦", "森可成", "前野長康", "一柳直末"
];

const colors = [
  "from-sky-500 to-blue-700",
  "from-red-500 to-rose-700",
  "from-emerald-500 to-green-700",
  "from-amber-400 to-orange-600",
  "from-violet-500 to-indigo-700",
  "from-orange-500 to-red-700",
  "from-cyan-500 to-teal-700",
  "from-fuchsia-500 to-pink-700",
  "from-lime-500 to-emerald-700",
  "from-slate-500 to-slate-800"
];

const powers = [
  "ひらめきアップ",
  "チャレンジアップ",
  "じっくりアップ",
  "作戦アップ",
  "スピードアップ",
  "陣形アップ",
  "読み取りアップ",
  "集中アップ",
  "書き出しアップ",
  "表づくりアップ"
];

const portraits = ["兜", "球", "旗", "月", "星", "風", "龍", "策", "城", "扇"];
const warriorArtPositions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];

const warriorArtSheets = [
  { start: 0, end: 5, src: "/assets/card-art/top-ss-warriors.png" },
  { start: 6, end: 11, src: "/assets/card-art/warriors-006-011.png" },
  { start: 12, end: 17, src: "/assets/card-art/warriors-012-017.png" },
  { start: 18, end: 23, src: "/assets/card-art/warriors-018-023.png" },
  { start: 24, end: 29, src: "/assets/card-art/warriors-024-029.png" },
  { start: 30, end: 35, src: "/assets/card-art/warriors-030-035.png" },
  { start: 36, end: 41, src: "/assets/card-art/warriors-036-041.png" },
  { start: 42, end: 47, src: "/assets/card-art/warriors-042-047.png" },
  { start: 48, end: 53, src: "/assets/card-art/warriors-048-053.png" },
  { start: 54, end: 59, src: "/assets/card-art/warriors-054-059.png" },
  { start: 60, end: 65, src: "/assets/card-art/warriors-060-065.png" },
  { start: 66, end: 71, src: "/assets/card-art/warriors-066-071.png" },
  { start: 72, end: 77, src: "/assets/card-art/warriors-072-077.png" },
  { start: 78, end: 83, src: "/assets/card-art/warriors-078-083.png" },
  { start: 84, end: 89, src: "/assets/card-art/warriors-084-089.png" },
  { start: 90, end: 95, src: "/assets/card-art/warriors-090-095.png" },
  { start: 96, end: 101, src: "/assets/card-art/warriors-096-101.png" },
  { start: 102, end: 107, src: "/assets/card-art/warriors-102-107.png" },
  { start: 108, end: 113, src: "/assets/card-art/warriors-108-113.png" },
  { start: 114, end: 119, src: "/assets/card-art/warriors-114-119.png" },
  { start: 120, end: 125, src: "/assets/card-art/warriors-120-125.png" },
  { start: 126, end: 131, src: "/assets/card-art/warriors-126-131.png" },
  { start: 132, end: 137, src: "/assets/card-art/warriors-132-137.png" },
  { start: 138, end: 143, src: "/assets/card-art/warriors-138-143.png" },
  { start: 144, end: 149, src: "/assets/card-art/warriors-144-149.png" },
  { start: 150, end: 155, src: "/assets/card-art/warriors-150-155.png" },
  { start: 156, end: 161, src: "/assets/card-art/warriors-156-161.png" },
  { start: 162, end: 167, src: "/assets/card-art/warriors-162-167.png" },
  { start: 168, end: 173, src: "/assets/card-art/warriors-168-173.png" },
  { start: 174, end: 179, src: "/assets/card-art/warriors-174-179.png" },
  { start: 180, end: 185, src: "/assets/card-art/warriors-180-185.png" },
  { start: 186, end: 191, src: "/assets/card-art/warriors-186-191.png" },
  { start: 192, end: 197, src: "/assets/card-art/warriors-192-197.png" },
  { start: 198, end: 203, src: "/assets/card-art/warriors-198-203.png" },
  { start: 204, end: 209, src: "/assets/card-art/warriors-204-209.png" },
  { start: 210, end: 215, src: "/assets/card-art/warriors-210-215.png" },
  { start: 216, end: 221, src: "/assets/card-art/warriors-216-221.png" },
  { start: 222, end: 227, src: "/assets/card-art/warriors-222-227.png" },
  { start: 228, end: 233, src: "/assets/card-art/warriors-228-233.png" },
];

function artForIndex(index: number) {
  const sheet = warriorArtSheets.find((item) => index >= item.start && index <= item.end);
  if (!sheet) return {};

  return {
    artSheet: sheet.src,
    artPosition: warriorArtPositions[index - sheet.start],
  };
}

const attackLeaders = new Set([
  "上杉謙信", "真田幸村", "本多忠勝", "柴田勝家", "加藤清正", "島津義弘", "立花宗茂", "前田慶次", "山県昌景", "馬場信春",
  "柿崎景家", "雑賀孫市", "可児才蔵", "後藤又兵衛", "毛利勝永", "長宗我部盛親", "島津豊久", "新納忠元", "高橋紹運", "立花道雪",
  "前田利家", "福島正則", "吉川元春", "井伊直政", "榊原康政", "黒田長政", "加藤嘉明", "島左近", "木村重成", "塙団右衛門",
  "森長可", "齋藤朝信", "真柄直隆", "本庄繁長", "森可成"
]);

const defenseLeaders = new Set([
  "徳川家康", "北条氏康", "武田信玄", "毛利元就", "真田昌幸", "真田信之", "藤堂高虎", "井伊直政", "榊原康政", "酒井忠次",
  "北条綱成", "上杉景勝", "佐竹義重", "鍋島直茂", "山内一豊", "池田輝政", "結城秀康", "京極高次", "長野業正", "成田長泰",
  "加藤清正", "太田道灌", "丹羽長秀", "蒲生氏郷", "高坂昌信", "大谷吉継", "堀秀政", "北条氏政", "北条氏直", "筒井順慶",
  "鳥居元忠", "成田長親", "岡部元信", "北条氏照", "北条氏邦", "清水宗治"
]);

const brainLeaders = new Set([
  "黒田官兵衛", "竹中半兵衛", "明智光秀", "石田三成", "毛利元就", "徳川家康", "武田信玄", "真田昌幸", "直江兼続", "小早川隆景",
  "宇喜多直家", "松永久秀", "斎藤道三", "細川藤孝", "千利休", "古田織部", "前田玄以", "増田長盛", "長束正家", "安国寺恵瓊",
  "尼子経久", "本多正信", "鍋島直茂", "小早川隆景", "吉川元春", "北条氏康", "上杉景勝", "片倉小十郎", "細川忠興", "浅野長政",
  "丹羽長秀", "蒲生氏郷", "毛利輝元", "黒田長政", "大友宗麟", "長宗我部元親", "本願寺顕如", "下間頼廉", "甲斐宗運", "宗義智",
  "太原雪斎", "山本勘助", "本多正信", "北条早雲", "岡部元信", "服部半蔵"
]);

const speedLeaders = new Set([
  "豊臣秀吉", "伊達政宗", "織田信長", "明智光秀", "滝川一益", "九鬼嘉隆", "蜂須賀小六", "前田慶次", "雑賀孫市", "真田幸村",
  "島津家久", "島津義弘", "小早川隆景", "長宗我部元親", "蒲生氏郷", "森蘭丸", "可児才蔵", "脇坂安治", "仙石秀久", "宗義智",
  "井伊直政", "榊原康政", "佐々成政", "黒田長政", "藤堂高虎", "小西行長", "立花宗茂", "島津豊久", "毛利秀元", "小早川秀包",
  "服部半蔵", "森長可", "前野長康", "一柳直末"
]);

const spiritLeaders = new Set([
  "真田幸村", "上杉謙信", "武田信玄", "伊達政宗", "本多忠勝", "加藤清正", "福島正則", "大谷吉継", "山中鹿介", "立花誾千代",
  "井伊直虎", "甲斐姫", "淀殿", "細川ガラシャ", "真田信繁", "木村重成", "塙団右衛門", "毛利勝永", "土屋昌恒", "高橋紹運",
  "島津豊久", "馬場信春", "北条綱成", "吉川元春", "立花宗茂", "立花道雪", "柴田勝家", "榊原康政", "酒井忠次", "井伊直政",
  "山県昌景", "堀秀政", "島左近", "長宗我部盛親", "大野治長", "大野治房", "薄田兼相", "明石全登", "後藤又兵衛", "新納忠元",
  "鳥居元忠", "仁科盛信", "清水宗治", "鬼庭左月斎", "本庄繁長", "真柄直隆"
]);

function rarityBase(rarity: CardRarity) {
  if (rarity === "SS") return 88;
  if (rarity === "S") return 80;
  if (rarity === "A") return 70;
  if (rarity === "B") return 60;
  return 50;
}

function rarityFor(index: number): CardRarity {
  if (index < 10) return "SS";
  if (index < 30) return "S";
  if (index < 70) return "A";
  if (index < 130) return "B";
  return "C";
}

function stat(index: number, offset: number, rarity: CardRarity) {
  const base = rarityBase(rarity);
  const variation = ((index * 17 + offset * 13) % 19) - 9;
  return Math.max(35, Math.min(99, base + variation));
}

function clampStat(value: number) {
  return Math.max(35, Math.min(99, value));
}

function historicalBonus(warrior: string, ability: "attack" | "defense" | "brain" | "speed" | "spirit") {
  if (ability === "attack" && attackLeaders.has(warrior)) return 12;
  if (ability === "defense" && defenseLeaders.has(warrior)) return 12;
  if (ability === "brain" && brainLeaders.has(warrior)) return 12;
  if (ability === "speed" && speedLeaders.has(warrior)) return 12;
  if (ability === "spirit" && spiritLeaders.has(warrior)) return 12;

  if (warrior.includes("信玄") || warrior.includes("官兵衛") || warrior.includes("半兵衛")) {
    return ability === "brain" || ability === "defense" ? 8 : 0;
  }
  if (warrior.includes("謙信") || warrior.includes("忠勝") || warrior.includes("義弘")) {
    return ability === "attack" || ability === "spirit" ? 8 : 0;
  }
  if (warrior.includes("秀吉") || warrior.includes("政宗")) {
    return ability === "speed" || ability === "brain" ? 7 : 0;
  }
  if (warrior.includes("北条") || warrior.includes("徳川")) {
    return ability === "defense" ? 7 : 0;
  }
  if (warrior.includes("毛利")) {
    return ability === "brain" || ability === "defense" ? 6 : 0;
  }
  if (warrior.includes("島津") || warrior.includes("立花")) {
    return ability === "attack" || ability === "speed" ? 6 : 0;
  }
  return 0;
}

function deckBonus(rarity: CardRarity) {
  if (rarity === "SS") return 100;
  if (rarity === "S") return 75;
  if (rarity === "A") return 50;
  if (rarity === "B") return 30;
  return 15;
}

export const warriorCards: WarriorCard[] = warriors.map((warrior, index) => {
  const rarity = rarityFor(index);
  const art = artForIndex(index);
  const attack = clampStat(stat(index + 1, 1, rarity) + historicalBonus(warrior, "attack"));
  const defense = clampStat(stat(index + 1, 2, rarity) + historicalBonus(warrior, "defense"));
  const brain = clampStat(stat(index + 1, 3, rarity) + historicalBonus(warrior, "brain"));
  const speed = clampStat(stat(index + 1, 4, rarity) + historicalBonus(warrior, "speed"));
  const spirit = clampStat(stat(index + 1, 5, rarity) + historicalBonus(warrior, "spirit"));
  const totalAttack = attack + speed + Math.round(brain / 2);
  const totalDefense = defense + spirit + Math.round(brain / 2);
  const power = powers[index % powers.length];
  return {
    id: `warrior-${String(index + 1).padStart(3, "0")}`,
    name: `${warrior}カード`,
    warrior,
    power,
    rarity,
    color: colors[index % colors.length],
    mark: warrior.slice(0, 1),
    portrait: portraits[index % portraits.length],
    artSheet: art.artSheet,
    artPosition: art.artPosition,
    attack,
    defense,
    brain,
    speed,
    spirit,
    totalAttack,
    totalDefense,
    skillText: `${power}。攻撃・守備・頭脳・走力・気合の5能力を持つ作戦カード。`,
    deckPoint: Math.round((attack + defense + brain + speed + spirit) / 5) + deckBonus(rarity),
  };
});

function seededUnit(seed: number) {
  const value = Math.sin(seed || Date.now()) * 10000;
  return value - Math.floor(value);
}

export function pickRewardCard(seed = Date.now(), pool: WarriorCard[] = warriorCards) {
  const source = pool.length ? pool : warriorCards;
  const availableRarities = cardRarities.filter((rarity) => source.some((card) => card.rarity === rarity));
  const totalWeight = availableRarities.reduce((sum, rarity) => sum + rarityRewardWeights[rarity], 0);
  let cursor = seededUnit(seed) * totalWeight;

  for (const rarity of availableRarities) {
    cursor -= rarityRewardWeights[rarity];
    if (cursor <= 0) {
      const rarityCards = source.filter((card) => card.rarity === rarity);
      return rarityCards[Math.floor(seededUnit(seed + rarity.length + rarity.charCodeAt(0)) * rarityCards.length)];
    }
  }

  return source[source.length - 1];
}

export function rarityBadge(rarity: CardRarity) {
  if (rarity === "SS") return "bg-rose-200 text-rose-950";
  if (rarity === "S") return "bg-yellow-200 text-yellow-950";
  if (rarity === "A") return "bg-blue-200 text-blue-950";
  if (rarity === "B") return "bg-emerald-200 text-emerald-950";
  return "bg-white/80 text-slate-900";
}
