import Link from "next/link";
import questionsData from "@/data/questions.json";
import type { Question } from "@/types/question";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const allQuestions = questionsData as Question[];

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeCount(value: string | string[] | undefined) {
  return getValue(value) === "10" ? 10 : 5;
}

function normalizeIndex(value: string | string[] | undefined, max: number) {
  const index = Number.parseInt(getValue(value) ?? "0", 10);
  if (Number.isNaN(index) || index < 0) return 0;
  return Math.min(index, max);
}

function buildQuestionUrl(count: number, index: number) {
  return `/ipad-mission?count=${count}&q=${index}`;
}

function buildAnswerUrl(count: number, index: number, answer: string) {
  const params = new URLSearchParams({ count: String(count), q: String(index), answer });
  return `/ipad-mission?${params.toString()}`;
}

function buildFeedbackUrl(count: number, index: number, answer: string, thinking: string) {
  const params = new URLSearchParams({ count: String(count), q: String(index), answer, thinking, checked: "1" });
  return `/ipad-mission?${params.toString()}`;
}

export default async function IpadMissionPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const count = normalizeCount(params.count);
  const questions = allQuestions.slice(0, count);
  const currentIndex = normalizeIndex(params.q, questions.length);
  const question = questions[currentIndex];
  const checked = getValue(params.checked) === "1";
  const selectedAnswer = getValue(params.answer) ?? "";
  const selectedThinking = getValue(params.thinking) ?? "";

  if (currentIndex >= questions.length) {
    return (
      <main className="min-h-screen bg-amber-50 px-4 py-6">
        <div className="mx-auto max-w-2xl rounded-lg border-2 border-amber-200 bg-white p-6 shadow-lg">
          <p className="text-sm font-black text-amber-700">iPad用ミッション</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">ミッション完了！</h1>
          <p className="mt-4 text-lg font-bold leading-8 text-slate-700">
            最後まで進めました。PC版は今まで通り、iPadではこの軽い画面を使えます。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="rounded-lg bg-slate-900 px-5 py-4 text-center text-lg font-black text-white">
              ホームへ
            </Link>
            <Link href={buildQuestionUrl(count, 0)} className="rounded-lg bg-emerald-700 px-5 py-4 text-center text-lg font-black text-white">
              もう一度
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!question) {
    return <main className="min-h-screen p-6 text-lg font-bold">iPad用ミッションを準備しています。</main>;
  }

  const showFeedback = checked && selectedAnswer && selectedThinking;
  const isAnswerCorrect = selectedAnswer === question.answer;
  const isThinkingCorrect = selectedThinking === question.bestThinking;

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

        {!showFeedback ? (
          <section className="rounded-lg border-2 border-amber-200 bg-white p-5 shadow-lg">
            <p className="text-sm font-black text-red-600">iPad用ミッション</p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950">{question.title}</h1>
            <p className="mt-4 rounded-lg bg-amber-50 p-4 text-lg font-bold leading-8 text-slate-800">{question.question}</p>

            {!selectedAnswer ? (
              <div className="mt-5 grid gap-3">
                <p className="text-base font-black text-slate-900">答えをタップ</p>
                {question.choices.map((choice) => (
                  <Link
                    key={choice}
                    href={buildAnswerUrl(count, currentIndex, choice)}
                    className="block min-h-14 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-4 text-lg font-black text-slate-900 shadow-sm"
                  >
                    {choice}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-3">
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm font-black text-red-700">選んだ答え</p>
                  <p className="mt-1 text-xl font-black text-red-950">{selectedAnswer}</p>
                </div>
                <p className="text-base font-black text-slate-900">考え方をタップ</p>
                {question.thinkingChoices.map((choice) => (
                  <Link
                    key={choice}
                    href={buildFeedbackUrl(count, currentIndex, selectedAnswer, choice)}
                    className="block min-h-14 rounded-lg border-2 border-sky-200 bg-sky-50 px-4 py-4 text-base font-black text-slate-900 shadow-sm"
                  >
                    {choice}
                  </Link>
                ))}
                <Link href={buildQuestionUrl(count, currentIndex)} className="mt-2 block rounded-lg bg-white px-4 py-3 text-center text-base font-black text-slate-700 shadow-sm">
                  答えを選び直す
                </Link>
              </div>
            )}
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

            <Link
              href={currentIndex >= questions.length - 1 ? buildQuestionUrl(count, questions.length) : buildQuestionUrl(count, currentIndex + 1)}
              className="mt-6 block w-full rounded-lg bg-red-500 px-6 py-4 text-center text-xl font-black text-white shadow-lg"
            >
              {currentIndex >= questions.length - 1 ? "完了する" : "次の問題へ"}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
