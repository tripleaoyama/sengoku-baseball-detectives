export type Subject = "math" | "reading";

export type AbstractionLevel = "テーマ問題" | "半抽象問題" | "受験形式問題";

export type MissionType = "出塁ミッション" | "作戦ミッション" | "決勝ミッション";

export type MistakeType =
  | "問題文の読み落とし"
  | "計算ミス"
  | "条件整理ミス"
  | "図や表にできなかった"
  | "くり返しに気づけなかった"
  | "本文の根拠を見つけられなかった"
  | "なんとなく選んだ"
  | "考え方は合っていたが答えを間違えた"
  | "なし";

export type Question = {
  id: string;
  grade: number;
  subject: Subject;
  displayTheme: "baseball_sengoku";
  missionType: MissionType;
  category: "算数" | "読解";
  unit: string;
  examUnit: string;
  level: number;
  difficulty: "easy" | "normal";
  abstractionLevel: AbstractionLevel;
  targetSkill: string;
  thinkingType: string;
  examRelevance: string;
  title: string;
  question: string;
  choices: string[];
  answer: string;
  thinkingChoices: string[];
  bestThinking: string;
  hints: [string, string, string];
  explanation: string;
  childTip: string;
  parentTip: string;
  tags: string[];
  nextAbstractQuestionId: string;
};

export type AnswerRecord = {
  missionId?: string;
  stadiumId?: string;
  learningDate: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  selectedThinking: string;
  isThinkingCorrect: boolean;
  hintCount: number;
  subject: Subject;
  category: string;
  unit: string;
  examUnit: string;
  thinkingType: string;
  abstractionLevel: AbstractionLevel;
  mistakeType: MistakeType;
  completedAt: string;
};

export type TodayMission = {
  id: string;
  date: string;
  stadiumId?: string;
  mode?: "normal" | "short" | "review" | "unit";
  targetUnit?: string;
  questionIds: string[];
  startedAt: string;
};
