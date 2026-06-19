"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { RubyText } from "@/components/RubyText";
import { getActiveMission, getMissionRecords, getTodayMission, inferMistakeType, saveAnswer } from "@/lib/storage";
import { getStadiumById } from "@/lib/stadiums";
import type { Question, TodayMission } from "@/types/question";

type Feedback = {
  question: Question;
  selectedAnswer: string;
  selectedThinking: string;
  hintCount: number;
};

export default function MissionPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mission, setMission] = useState<TodayMission | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const activeMission = getActiveMission();
    const missionQuestions = getTodayMission();
    const done = getMissionRecords(activeMission.id).map((record) => record.questionId);
    setMission(activeMission);
    setQuestions(missionQuestions);
    setCurrentIndex(Math.min(done.length, missionQuestions.length - 1));
    if (done.length >= missionQuestions.length) router.replace("/result");
  }, [router]);

  if (!questions.length) {
    return <main className="min-h-screen p-6 text-lg font-bold">今日のミッションを準備しています。</main>;
  }

  const question = questions[currentIndex];
  const stadium = getStadiumById(mission?.stadiumId);

  function handleAnswered(selectedAnswer: string, selectedThinking: string, hintCount: number) {
    setFeedback({ question, selectedAnswer, selectedThinking, hintCount });
  }

  function saveAndNext() {
    if (!feedback) return;
    const isCorrect = feedback.selectedAnswer === feedback.question.answer;
    const isThinkingCorrect = feedback.selectedThinking === feedback.question.bestThinking;
    saveAnswer({
      missionId: mission?.id,
      stadiumId: mission?.stadiumId,
      learningDate: new Date().toISOString().slice(0, 10),
      questionId: feedback.question.id,
      selectedAnswer: feedback.selectedAnswer,
      isCorrect,
      selectedThinking: feedback.selectedThinking,
      isThinkingCorrect,
      hintCount: feedback.hintCount,
      subject: feedback.question.subject,
      category: feedback.question.category,
      unit: feedback.question.unit,
      examUnit: feedback.question.examUnit,
      thinkingType: feedback.question.thinkingType,
      abstractionLevel: feedback.question.abstractionLevel,
      mistakeType: inferMistakeType(feedback.question, feedback.selectedAnswer, feedback.selectedThinking),
      completedAt: new Date().toISOString(),
    });

    if (currentIndex >= questions.length - 1) {
      router.push("/result");
      return;
    }

    setFeedback(null);
    setCurrentIndex((index) => index + 1);
  }

  return (
    <main className="pattern-field min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <Link href="/cards" className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
            カード図鑑
          </Link>
        </div>

        <section className={`mb-4 rounded-lg bg-gradient-to-br ${stadium.color} p-4 text-white shadow-sm`}>
          <p className="text-xs font-black opacity-90">現在の城球場</p>
          <h1 className="mt-1 text-2xl font-black">{stadium.name}</h1>
          <p className="mt-1 text-sm font-bold"><RubyText text={`今日の10問トレーニング: ${stadium.examFocus}`} /></p>
        </section>

        {!feedback ? (
          <QuestionCard question={question} index={currentIndex} total={questions.length} onAnswered={handleAnswered} />
        ) : (
          <section className="rounded-lg border-2 border-slate-200 bg-white p-5 shadow-lg">
            <p className="text-sm font-black text-red-600"><RubyText text="答え合わせ" /></p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">
              <RubyText text={feedback.selectedAnswer === feedback.question.answer ? "ナイスヒット！" : "いいところまで考えたね"} />
            </h1>
            <div className="mt-5 grid gap-3">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-800"><RubyText text="正しい答え" /></p>
                <p className="text-xl font-black text-emerald-950"><RubyText text={feedback.question.answer} /></p>
              </div>
              <div className="rounded-lg bg-sky-50 p-4">
                <p className="text-sm font-black text-sky-800"><RubyText text="よい考え方" /></p>
                <p className="text-lg font-black text-sky-950"><RubyText text={feedback.question.bestThinking} /></p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-lg font-bold leading-8 text-amber-950">
                <RubyText text={feedback.question.explanation} />
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-red-50 p-4 text-base font-black text-red-900">
              {feedback.selectedThinking === feedback.question.bestThinking
                ? <RubyText text="考え方まで選べたね。ツーベース級の作戦力！" />
                : <RubyText text="次はこう考えてみよう。ここに気づけるとさらに強くなるよ。" />}
            </p>
            <p className="mt-3 rounded-lg bg-white p-4 text-base font-bold text-slate-700 ring-2 ring-slate-100">
              <RubyText text={`中学受験につながる一言: ${feedback.question.childTip}`} />
            </p>
            <button
              type="button"
              onClick={saveAndNext}
              className="mt-6 w-full rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-red-600"
            >
              <RubyText text={currentIndex >= questions.length - 1 ? "試合結果を見る" : "次のミッションへ"} />
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
