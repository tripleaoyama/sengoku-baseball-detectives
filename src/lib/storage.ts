"use client";

import questions from "@/data/questions.json";
import { pickRewardCard, warriorCards, type OwnedCard, type WarriorCard } from "@/lib/cards";
import { getNextStadiumId, getStadiumById, stadiums, type StadiumProgress } from "@/lib/stadiums";
import type { AnswerRecord, MistakeType, Question, TodayMission } from "@/types/question";

const HISTORY_KEY = "sbbt_answer_history";
const TODAY_KEY = "sbbt_today_mission";
const CARDS_KEY = "sbbt_owned_cards";
const REWARD_CARDS_KEY = "sbbt_reward_cards_by_mission";
const STADIUM_PROGRESS_KEY = "sbbt_stadium_progress";
const SELECTED_STADIUM_KEY = "sbbt_selected_stadium";
const STADIUM_RECORDED_MISSIONS_KEY = "sbbt_stadium_recorded_missions";
const CHILD_PROFILE_KEY = "sbbt_child_profile";
export const QUESTIONS_PER_MISSION = 10;
export const SHORT_QUESTIONS_PER_MISSION = 5;
export const REVIEW_QUESTIONS_PER_MISSION = 5;
const MATH_QUESTIONS_PER_MISSION = 7;
const READING_QUESTIONS_PER_MISSION = 3;

type MissionOptions = {
  mode?: TodayMission["mode"];
  questionCount?: number;
  targetUnit?: string;
};

export type ChildProfile = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  storageVersion: 1;
};

const allQuestions = questions as Question[];

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage may be blocked. The app should still be playable.
  }
}

export function getHistory(): AnswerRecord[] {
  return readJson<AnswerRecord[]>(HISTORY_KEY, []);
}

export function saveAnswer(record: AnswerRecord) {
  writeJson(HISTORY_KEY, [...getHistory(), record]);
}

export function getChildProfile(): ChildProfile {
  const saved = readJson<ChildProfile | null>(CHILD_PROFILE_KEY, null);
  if (saved?.id) return saved;

  const now = new Date().toISOString();
  return {
    id: `local-child-${now}`,
    name: "",
    createdAt: now,
    updatedAt: now,
    storageVersion: 1,
  };
}

export function saveChildName(name: string) {
  const current = getChildProfile();
  const now = new Date().toISOString();
  const profile = {
    ...current,
    name: name.trim(),
    updatedAt: now,
  };
  writeJson(CHILD_PROFILE_KEY, profile);
  return profile;
}

export function resetAllLocalSaveData() {
  if (!canUseStorage()) return;
  [
    HISTORY_KEY,
    TODAY_KEY,
    CARDS_KEY,
    REWARD_CARDS_KEY,
    STADIUM_PROGRESS_KEY,
    SELECTED_STADIUM_KEY,
    STADIUM_RECORDED_MISSIONS_KEY,
    CHILD_PROFILE_KEY,
  ].forEach((key) => window.localStorage.removeItem(key));
}

export function getStadiumProgress(): StadiumProgress[] {
  const saved = readJson<StadiumProgress[]>(STADIUM_PROGRESS_KEY, []);
  return stadiums.map((stadium, index) => {
    const current = saved.find((progress) => progress.stadiumId === stadium.id);
    return {
      stadiumId: stadium.id,
      unlocked: index === 0 || Boolean(current?.unlocked),
      cleared: Boolean(current?.cleared),
      wins: current?.wins ?? 0,
    };
  });
}

function writeStadiumProgress(progress: StadiumProgress[]) {
  writeJson(STADIUM_PROGRESS_KEY, progress);
}

export function getSelectedStadium() {
  const progress = getStadiumProgress();
  const selectedId = readJson<string | null>(SELECTED_STADIUM_KEY, null);
  const selected = progress.find((item) => item.stadiumId === selectedId && item.unlocked);
  return getStadiumById(selected?.stadiumId ?? progress.find((item) => item.unlocked)?.stadiumId);
}

export function selectStadium(stadiumId: string) {
  const progress = getStadiumProgress();
  const target = progress.find((item) => item.stadiumId === stadiumId);
  if (!target?.unlocked) return false;
  writeJson(SELECTED_STADIUM_KEY, stadiumId);
  return true;
}

export function recordStadiumMissionClear(missionId: string, stadiumId?: string) {
  if (!stadiumId) return;
  const recorded = readJson<Record<string, boolean>>(STADIUM_RECORDED_MISSIONS_KEY, {});
  if (recorded[missionId]) return;

  const stadium = getStadiumById(stadiumId);
  const nextStadiumId = getNextStadiumId(stadiumId);
  let clearedNow = false;
  const progress = getStadiumProgress().map((item) => {
    if (item.stadiumId !== stadiumId) return item;
    const wins = item.wins + 1;
    clearedNow = wins >= stadium.winsToClear;
    return { ...item, wins, cleared: item.cleared || clearedNow };
  });

  const nextProgress = progress.map((item) =>
    item.stadiumId === nextStadiumId ? { ...item, unlocked: item.unlocked || clearedNow } : item
  );
  writeStadiumProgress(nextProgress);
  writeJson(STADIUM_RECORDED_MISSIONS_KEY, { ...recorded, [missionId]: true });
}

export function getTodayRecords(date = todayKey()) {
  return getHistory().filter((record) => record.learningDate === date);
}

export function getMissionRecords(missionId?: string) {
  if (!missionId) return [];
  return getHistory().filter((record) => record.missionId === missionId);
}

export function clearTodayProgress(date = todayKey()) {
  const rest = getHistory().filter((record) => record.learningDate !== date);
  writeJson(HISTORY_KEY, rest);
}

function getQuestionScore(question: Question, keywords: string[]) {
  const text = `${question.unit} ${question.examUnit} ${question.thinkingType} ${question.tags.join(" ")}`;
  return keywords.reduce((score, keyword) => (text.includes(keyword) ? score + 1 : score), 0);
}

function pickBySubject(subject: "math" | "reading", count: number, avoidIds: Set<string>, keywords: string[] = []) {
  const preferred = allQuestions
    .filter((q) => q.subject === subject && !avoidIds.has(q.id) && getQuestionScore(q, keywords) > 0)
    .sort((a, b) => getQuestionScore(b, keywords) - getQuestionScore(a, keywords));
  const pool = allQuestions.filter((q) => q.subject === subject && !avoidIds.has(q.id));
  const fallback = allQuestions.filter((q) => q.subject === subject);
  const preferredIds = new Set(preferred.map((question) => question.id));
  const fill = (pool.length ? pool : fallback).filter((question) => !preferredIds.has(question.id));
  const source = [...preferred, ...fill];
  return source.slice(0, count).sort(() => Math.random() - 0.5);
}

function uniqueLatestQuestionIds(records: AnswerRecord[]) {
  const seen = new Set<string>();
  return [...records]
    .reverse()
    .map((record) => record.questionId)
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function pickMixedQuestions(count: number, avoidIds: Set<string>, keywords: string[]) {
  const mathCount = Math.max(1, Math.round(count * 0.7));
  const readingCount = count - mathCount;
  return [
    ...pickBySubject("math", mathCount, avoidIds, keywords),
    ...pickBySubject("reading", readingCount, avoidIds, keywords),
  ];
}

function pickUnitQuestions(unit: string, count: number, avoidIds: Set<string>) {
  const pool = allQuestions.filter((question) => question.unit === unit && !avoidIds.has(question.id));
  const fallback = allQuestions.filter((question) => question.unit === unit);
  const source = pool.length >= count ? pool : fallback;
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}

function pickReviewQuestions(count: number) {
  const reviewIds = uniqueLatestQuestionIds(
    getHistory().filter((record) => !record.isCorrect || !record.isThinkingCorrect || record.hintCount > 0)
  );
  const recentIds = uniqueLatestQuestionIds(getHistory());
  const ids = reviewIds.length ? reviewIds : recentIds;
  const selected = ids
    .map((id) => allQuestions.find((question) => question.id === id))
    .filter(Boolean)
    .slice(0, count) as Question[];
  if (selected.length >= count) return selected;

  const usedIds = new Set(selected.map((question) => question.id));
  return [
    ...selected,
    ...allQuestions.filter((question) => !usedIds.has(question.id)).sort(() => Math.random() - 0.5).slice(0, count - selected.length),
  ];
}

function createMission(date = todayKey(), options: MissionOptions = {}): TodayMission {
  const stadium = getSelectedStadium();
  const recentIds = new Set(getHistory().slice(-24).map((record) => record.questionId));
  const mode = options.mode ?? "normal";
  const questionCount = options.questionCount ?? QUESTIONS_PER_MISSION;
  const selected =
    mode === "review"
      ? pickReviewQuestions(questionCount)
      : mode === "unit" && options.targetUnit
        ? pickUnitQuestions(options.targetUnit, questionCount, recentIds)
        : questionCount === QUESTIONS_PER_MISSION
          ? [
              ...pickBySubject("math", MATH_QUESTIONS_PER_MISSION, recentIds, stadium.questionKeywords),
              ...pickBySubject("reading", READING_QUESTIONS_PER_MISSION, recentIds, stadium.questionKeywords),
            ]
          : pickMixedQuestions(questionCount, recentIds, stadium.questionKeywords);
  const mission = {
    id: `${date}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date,
    stadiumId: stadium.id,
    mode,
    targetUnit: options.targetUnit,
    questionIds: selected.map((q) => q.id),
    startedAt: new Date().toISOString(),
  };
  writeJson<TodayMission>(TODAY_KEY, mission);
  return mission;
}

export function getActiveMission(forceNew = false): TodayMission {
  const date = todayKey();
  const saved = readJson<TodayMission | null>(TODAY_KEY, null);
  if (
    !forceNew &&
    saved?.date === date &&
    saved.questionIds.length > 0 &&
    getMissionRecords(saved.id).length < saved.questionIds.length
  ) {
    return saved;
  }

  return createMission(date);
}

export function getCurrentMission(): TodayMission | null {
  return readJson<TodayMission | null>(TODAY_KEY, null);
}

export function startNewMission(options: MissionOptions = {}) {
  return createMission(todayKey(), options);
}

export function startShortMission() {
  return startNewMission({ mode: "short", questionCount: SHORT_QUESTIONS_PER_MISSION });
}

export function startReviewMission() {
  return startNewMission({ mode: "review", questionCount: REVIEW_QUESTIONS_PER_MISSION });
}

export function startUnitMission(unit: string) {
  return startNewMission({ mode: "unit", targetUnit: unit, questionCount: SHORT_QUESTIONS_PER_MISSION });
}

export function getReviewQuestionCount() {
  return uniqueLatestQuestionIds(getHistory().filter((record) => !record.isCorrect || !record.isThinkingCorrect || record.hintCount > 0)).length;
}

export function getAvailableUnits() {
  return [...new Set(allQuestions.map((question) => question.unit))];
}

export function getTodayMission(forceNew = false): Question[] {
  const mission = getActiveMission(forceNew);
  return mission.questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as Question[];
}

export function getCurrentMissionQuestions(): Question[] {
  const mission = getCurrentMission();
  if (!mission) return [];
  return mission.questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as Question[];
}

export function getTodayCompletedMatchCount(date = todayKey()) {
  const grouped = new Map<string, number>();
  getTodayRecords(date).forEach((record) => {
    const id = record.missionId ?? "legacy";
    grouped.set(id, (grouped.get(id) ?? 0) + 1);
  });
  return [...grouped.values()].filter((count) => count >= SHORT_QUESTIONS_PER_MISSION).length;
}

export function getQuestionById(id: string) {
  return allQuestions.find((question) => question.id === id);
}

export function getStreak() {
  const dates = Array.from(new Set(getHistory().map((record) => record.learningDate))).sort().reverse();
  let count = 0;
  const cursor = new Date(todayKey());
  for (const date of dates) {
    const expected = cursor.toISOString().slice(0, 10);
    if (date !== expected) break;
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function inferMistakeType(question: Question, selectedAnswer: string, selectedThinking: string): MistakeType {
  if (selectedAnswer === question.answer && selectedThinking === question.bestThinking) return "なし";
  if (selectedThinking.includes("なんとなく")) return "なんとなく選んだ";
  if (selectedThinking === question.bestThinking && selectedAnswer !== question.answer) return "考え方は合っていたが答えを間違えた";
  if (question.examUnit.includes("周期")) return "くり返しに気づけなかった";
  if (question.examUnit.includes("条件")) return "条件整理ミス";
  if (question.subject === "reading") return "本文の根拠を見つけられなかった";
  if (question.unit.includes("図形") || question.unit.includes("表")) return "図や表にできなかった";
  return "問題文の読み落とし";
}

export function titleFor(records: AnswerRecord[]) {
  const correct = records.filter((r) => r.isCorrect).length;
  const thinking = records.filter((r) => r.isThinkingCorrect).length;
  const hints = records.reduce((sum, r) => sum + r.hintCount, 0);
  if (records.length >= SHORT_QUESTIONS_PER_MISSION && correct === records.length && hints === 0) return "ホームラン軍師";
  if (records.length >= SHORT_QUESTIONS_PER_MISSION && correct >= Math.ceil(records.length * 0.8)) return "今日の名将";
  if (thinking >= Math.ceil(records.length * 0.7)) return "作戦キャッチャー";
  if (records.some((r) => r.category === "読解" && r.isCorrect)) return "読み取り侍";
  return "見習い軍師";
}

function hydrateOwnedCard(card: OwnedCard): OwnedCard {
  const latest =
    warriorCards.find((warriorCard) => warriorCard.id === card.id) ??
    warriorCards.find((warriorCard) => warriorCard.name === card.name || warriorCard.warrior === card.warrior) ??
    warriorCards[0];
  return {
    ...latest,
    count: Number.isFinite(card.count) ? card.count : 1,
    firstEarnedAt: card.firstEarnedAt ?? new Date().toISOString(),
    lastEarnedAt: card.lastEarnedAt ?? new Date().toISOString(),
  };
}

export function getOwnedCards(): OwnedCard[] {
  return readJson<OwnedCard[]>(CARDS_KEY, []).map(hydrateOwnedCard);
}

export function addOwnedCard(card: WarriorCard) {
  const now = new Date().toISOString();
  const owned = getOwnedCards();
  const existing = owned.find((item) => item.id === card.id);
  const next = existing
    ? owned.map((item) => (item.id === card.id ? { ...card, count: item.count + 1, firstEarnedAt: item.firstEarnedAt, lastEarnedAt: now } : item))
    : [...owned, { ...card, count: 1, firstEarnedAt: now, lastEarnedAt: now }];
  writeJson(CARDS_KEY, next);
}

type RewardStore = Record<string, { cardId: string; saved: boolean }>;

export function getMissionRewardCard(records: AnswerRecord[], missionId = getCurrentMission()?.id ?? "legacy") {
  const saved = readJson<RewardStore>(REWARD_CARDS_KEY, {});
  const savedReward = saved[missionId];
  const savedCard = savedReward ? warriorCards.find((card) => card.id === savedReward.cardId) : undefined;
  if (savedCard) return { card: savedCard, saved: savedReward.saved };

  const mission = getCurrentMission();
  const stadium = getStadiumById(mission?.stadiumId);
  const featuredCards = warriorCards.filter((card) => stadium.featuredWarriors.includes(card.warrior));
  const seed = records.reduce(
    (sum, record) => sum + record.questionId.length + (record.isCorrect ? 7 : 2) + record.completedAt.length,
    missionId.length
  );
  const rewardPool = featuredCards.length ? featuredCards : warriorCards;
  const card = rewardPool[Math.abs(seed) % rewardPool.length] ?? pickRewardCard(seed);
  writeJson<RewardStore>(REWARD_CARDS_KEY, { ...saved, [missionId]: { cardId: card.id, saved: false } });
  return { card, saved: false };
}

export function saveMissionRewardCard(records: AnswerRecord[], missionId = getCurrentMission()?.id ?? "legacy") {
  const saved = readJson<RewardStore>(REWARD_CARDS_KEY, {});
  const reward = getMissionRewardCard(records, missionId);
  const mission = getCurrentMission();
  if (!reward.saved) {
    addOwnedCard(reward.card);
    writeJson<RewardStore>(REWARD_CARDS_KEY, { ...saved, [missionId]: { cardId: reward.card.id, saved: true } });
  }
  recordStadiumMissionClear(missionId, mission?.stadiumId);
  return reward.card;
}
