"use client";

export type Stadium = {
  id: string;
  name: string;
  shortName: string;
  theme: string;
  examFocus: string;
  childMessage: string;
  color: string;
  winsToClear: number;
  questionKeywords: string[];
  featuredWarriors: string[];
};

export type StadiumProgress = {
  stadiumId: string;
  unlocked: boolean;
  cleared: boolean;
  wins: number;
};

export const stadiums: Stadium[] = [
  {
    id: "osaka",
    name: "大坂城球場",
    shortName: "大坂",
    theme: "文章題と情報整理の入口",
    examFocus: "文章題・情報選択・条件整理",
    childMessage: "まずは作戦メモをよく読んで、必要な手がかりを見つけよう。",
    color: "from-red-500 to-amber-500",
    winsToClear: 2,
    questionKeywords: ["文章題", "情報選択", "条件整理", "理由"],
    featuredWarriors: ["豊臣秀吉", "石田三成", "大谷吉継", "真田幸村", "後藤又兵衛", "毛利勝永"],
  },
  {
    id: "azuchi",
    name: "安土城球場",
    shortName: "安土",
    theme: "規則を見つけるスピード作戦",
    examFocus: "規則性・周期算・表の読み取り",
    childMessage: "くり返しや表の中の決まりを見つけて、作戦を進めよう。",
    color: "from-violet-500 to-sky-600",
    winsToClear: 2,
    questionKeywords: ["規則性", "周期算", "表", "資料"],
    featuredWarriors: ["織田信長", "明智光秀", "柴田勝家", "前田利家", "丹羽長秀", "滝川一益"],
  },
  {
    id: "sendai",
    name: "仙台城球場",
    shortName: "仙台",
    theme: "条件整理の少年軍師作戦",
    examFocus: "条件整理・推理・文章題",
    childMessage: "決まっている条件から順番に入れて、守備位置を見つけよう。",
    color: "from-sky-500 to-blue-800",
    winsToClear: 2,
    questionKeywords: ["条件整理", "推理", "文章題"],
    featuredWarriors: ["伊達政宗", "片倉小十郎", "伊達成実", "支倉常長", "片倉重長", "鬼庭綱元"],
  },
  {
    id: "ueda",
    name: "上田城球場",
    shortName: "上田",
    theme: "書き出しと場合の数の守り勝ち",
    examFocus: "場合の数・書き出し・組み合わせ",
    childMessage: "もれなく、同じものを二度数えずに書き出そう。",
    color: "from-rose-500 to-red-800",
    winsToClear: 2,
    questionKeywords: ["場合の数", "書き出し", "組み合わせ"],
    featuredWarriors: ["真田幸村", "真田昌幸", "真田信之", "真田信綱", "真田昌輝", "山中鹿介"],
  },
  {
    id: "kasugayama",
    name: "春日山城球場",
    shortName: "春日山",
    theme: "読解と理由探しの読み取り作戦",
    examFocus: "指示語・接続語・理由探し・心情理解",
    childMessage: "本文の言葉に戻って、気持ちや理由を読み取ろう。",
    color: "from-cyan-500 to-teal-700",
    winsToClear: 2,
    questionKeywords: ["指示語", "接続語", "理由", "心情", "要約", "読解"],
    featuredWarriors: ["上杉謙信", "直江兼続", "上杉景勝", "柿崎景家", "甘粕景持", "宇佐美定満"],
  },
  {
    id: "kofu",
    name: "甲府館球場",
    shortName: "甲府",
    theme: "図形と陣形を数える作戦",
    examFocus: "図形感覚・数の分解・時間・お金",
    childMessage: "図やまとまりを使って、数を整理してみよう。",
    color: "from-orange-500 to-red-700",
    winsToClear: 2,
    questionKeywords: ["図形", "マス目", "数の分解", "時間", "お金"],
    featuredWarriors: ["武田信玄", "山県昌景", "馬場信春", "高坂昌信", "内藤昌豊", "山本勘助"],
  },
];

export function getStadiumById(id?: string) {
  return stadiums.find((stadium) => stadium.id === id) ?? stadiums[0];
}

export function getNextStadiumId(id: string) {
  const index = stadiums.findIndex((stadium) => stadium.id === id);
  return stadiums[index + 1]?.id;
}
