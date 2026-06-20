"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import questionsData from "@/data/questions.json";
import type { Question } from "@/types/question";

type Feedback = {
  selectedAnswer: string;
  selectedThinking: string;
};

const allQuestions = questionsData as Question[];

function getCountFromUrl() {
  if (typeof window === "undefined") return 5;
  const params = new URLSearchParams(window.location.search);
  return params.get("count") === "10" ? 10 : 5;
}

export default function IpadMissionPage() {
  const [count, setCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCount(getCountFromUrl());
  }, []);

  const questions = useMemo(() => allQuestions.slice(0, count), [count]);
  const question = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedAnswer = String(formData.get("answer") ?? "");
    const selectedThinking = String(formData.get("thinking") ?? "");

    if (!selectedAnswer || !selectedThinking) {
      setMessage("答えと考え方を1つずつ選んでね。");
      return;
    }

    setMessage("");
    setFeedback({ selectedAnswer, selectedThinking });
  }

  function goNext() {
    setFeedback(null);
    setMessage("");
    setCurrentIndex((index) => index + 1);
  }

  if (isFinished) {
    return (
      <main className="min-h-screen bg-amber-50 px-4 py-6">
        <div className="mx-auto max-w-2xl rounded-lg border-2 border-amber-200 bg-white p-6 shadow-lg">
          <p className="text-sm font-black text-amber-700">iPad用ミッション</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">ミッション完了！</h1>
          <p className="mt-4 text-lg font-bold leading-8 text-slate-700">
            ここまで解けたら十分すごい。PC版と同じ問題を、iPad用の軽い画面で最後まで進めました。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="rounded-lg bg-slate-900 px-5 py-4 text-center text-lg font-black text-white">
              ホームへ
            </Link>
            <Link href="/cards" className="rounded-lg bg-emerald-700 px-5 py-4 text-center text-lg font-black text-white">
              カード図鑑へ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!question) {
    return <main className="min-h-screen p-6 text-lg font-bold">iPad用ミッションを準備しています。</main>;
  }

  const isAnswerCorrect = feedback?.selectedAnswer === question.answer;
  const isThinkingCorrect = feedback?.selectedThinking === question.bestThinking;

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/" className="rounded-lg bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
            ホーム
          </Link>
          <p className="rounded-full bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>

        {!feedback ? (
          <section className="rounded-lg border-2 border-amber-200 bg-white p-5 shadow-lg">
            <p className="text-sm font-black text-red-600">iPad用ミッション</p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950">{question.title}</h1>
            <p className="mt-4 rounded-lg bg-amber-50 p-4 text-lg font-bold leading-8 text-slate-800">{question.question}</p>

            <form key={question.id} onSubmit={handleSubmit} className="mt-5 grid gap-5">
              <fieldset className="grid gap-3">
                <legend className="text-base font-black text-slate-900">答え</legend>
                {question.choices.map((choice) => (
                  <label
                    key={choice}
                    className="flex min-h-14 items-center gap-3 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black text-slate-900"
                  >
                    <input className="h-6 w-6 accent-red-500" type="radio" name="answer" value={choice} />
                    <span>{choice}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="text-base font-black text-slate-900">考え方</legend>
                {question.thinkingChoices.map((choice) => (
                  <label
                    key={choice}
                    className="flex min-h-14 items-center gap-3 rounded-lg border-2 border-sky-200 bg-sky-50 px-4 py-3 text-base font-black text-slate-900"
                  >
                    <input className="h-6 w-6 accent-sky-600" type="radio" name="thinking" value={choice} />
                    <span>{choice}</span>
                  </label>
                ))}
              </fieldset>

              {message && <p className="rounded-lg bg-red-50 p-3 text-base font-black text-red-700">{message}</p>}

              <button type="submit" className="rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg">
                答え合わせをする
              </button>
            </form>
          </section>
        ) : (
          <section className="rounded-lg border-2 border-slate-200 bg-white p-5 shadow-lg">
            <p className="text-sm font-black text-red-600">答え合わせ</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {isAnswerCorrect ? "ナイスヒット！" : "いいところまで考えたね"}
            </h1>

            <div className="mt-5 grid gap-3">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-800">正しい答え</p>
                <p className="text-xl font-black text-emerald-950">{question.answer}</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-4">
                <p className="text-sm font-black text-sky-800">よい考え方</p>
                <p className="text-lg font-black text-sky-950">{question.bestThinking}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 text-lg font-bold leading-8 text-amber-950">{question.explanation}</div>
            </div>

            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-base font-black text-slate-800">
              {isThinkingCorrect ? "考え方もばっちり。" : "次はこの考え方を使ってみよう。"}
            </p>

            <button type="button" onClick={goNext} className="mt-6 w-full rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg">
              {currentIndex >= questions.length - 1 ? "完了する" : "次の問題へ"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
