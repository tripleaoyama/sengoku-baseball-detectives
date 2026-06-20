import questionsData from "@/data/questions.json";
import type { Question } from "@/types/question";

type RouteContext = {
  params: Promise<{
    count: string;
    page: string;
  }>;
};

const allQuestions = questionsData as Question[];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeCount(value: string) {
  return value === "10" ? 10 : 5;
}

function html(title: string, body: string) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff7ed; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif; font-size: 18px; line-height: 1.65; }
    main { max-width: 720px; margin: 0 auto; padding: 20px 14px 48px; }
    .top { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .card { background: #fff; border: 2px solid #fed7aa; border-radius: 12px; padding: 20px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
    .pill { display: inline-block; border-radius: 999px; background: #fff; padding: 8px 14px; font-size: 14px; font-weight: 900; color: #334155; text-decoration: none; }
    .eyebrow { margin: 0 0 8px; color: #dc2626; font-size: 14px; font-weight: 900; }
    h1 { margin: 0; font-size: 28px; line-height: 1.25; }
    h2 { margin: 18px 0 8px; font-size: 20px; }
    p { margin: 12px 0 0; }
    .question { margin-top: 16px; border-radius: 10px; background: #fffbeb; padding: 16px; font-weight: 800; }
    .choice { display: block; min-height: 58px; margin-top: 12px; border: 2px solid #cbd5e1; border-radius: 10px; background: #f8fafc; padding: 14px 16px; color: #0f172a; text-decoration: none; font-weight: 900; }
    .thinking { border-color: #bae6fd; background: #f0f9ff; font-size: 17px; }
    .primary { display: block; margin-top: 20px; border-radius: 10px; background: #ef4444; padding: 16px; color: #fff; text-align: center; text-decoration: none; font-size: 20px; font-weight: 900; }
    .secondary { display: block; margin-top: 12px; border-radius: 10px; background: #0f172a; padding: 14px; color: #fff; text-align: center; text-decoration: none; font-weight: 900; }
    .box { margin-top: 12px; border-radius: 10px; padding: 14px; font-weight: 800; }
    .green { background: #ecfdf5; color: #064e3b; }
    .blue { background: #f0f9ff; color: #0c4a6e; }
    .amber { background: #fffbeb; color: #78350f; }
    .muted { background: #f8fafc; color: #334155; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function response(title: string, body: string, status = 200) {
  return new Response(html(title, body), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function questionPath(count: number, index: number) {
  return `/ipad-lite/${count}/q${index}.html`;
}

function answerPath(count: number, index: number, answerIndex: number) {
  return `/ipad-lite/${count}/q${index}-a${answerIndex}.html`;
}

function feedbackPath(count: number, index: number, answerIndex: number, thinkingIndex: number) {
  return `/ipad-lite/${count}/q${index}-a${answerIndex}-t${thinkingIndex}.html`;
}

function shell(count: number, index: number, inner: string) {
  return `<main>
  <div class="top">
    <a class="pill" href="/">ホーム</a>
    <span class="pill">${index + 1} / ${count}</span>
  </div>
  ${inner}
</main>`;
}

function renderQuestion(count: number, index: number, question: Question) {
  const choices = question.choices
    .map((choice, answerIndex) => `<a class="choice" href="${answerPath(count, index, answerIndex)}">${escapeHtml(choice)}</a>`)
    .join("");

  return response(
    `iPad用ミッション ${index + 1}`,
    shell(
      count,
      index,
      `<section class="card">
    <p class="eyebrow">iPad用ミッション</p>
    <h1>${escapeHtml(question.title)}</h1>
    <p class="question">${escapeHtml(question.question)}</p>
    <h2>答えをタップ</h2>
    ${choices}
  </section>`,
    ),
  );
}

function renderAnswer(count: number, index: number, question: Question, answerIndex: number) {
  const selectedAnswer = question.choices[answerIndex];
  const choices = question.thinkingChoices
    .map((choice, thinkingIndex) => `<a class="choice thinking" href="${feedbackPath(count, index, answerIndex, thinkingIndex)}">${escapeHtml(choice)}</a>`)
    .join("");

  return response(
    `考え方を選ぶ ${index + 1}`,
    shell(
      count,
      index,
      `<section class="card">
    <p class="eyebrow">選んだ答え</p>
    <h1>${escapeHtml(selectedAnswer)}</h1>
    <h2>考え方をタップ</h2>
    ${choices}
    <a class="secondary" href="${questionPath(count, index)}">答えを選び直す</a>
  </section>`,
    ),
  );
}

function renderFeedback(count: number, index: number, question: Question, answerIndex: number, thinkingIndex: number) {
  const selectedAnswer = question.choices[answerIndex];
  const selectedThinking = question.thinkingChoices[thinkingIndex];
  const nextHref = index >= count - 1 ? `/ipad-lite/${count}/finish.html` : questionPath(count, index + 1);
  const nextLabel = index >= count - 1 ? "完了する" : "次の問題へ";
  const title = selectedAnswer === question.answer ? "ナイスヒット！" : "いいところまで考えたね";
  const thinkingText = selectedThinking === question.bestThinking ? "考え方もばっちり。" : "次はこの考え方を使ってみよう。";

  return response(
    `答え合わせ ${index + 1}`,
    shell(
      count,
      index,
      `<section class="card">
    <p class="eyebrow">答え合わせ</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="box green"><strong>正しい答え</strong><p>${escapeHtml(question.answer)}</p></div>
    <div class="box blue"><strong>よい考え方</strong><p>${escapeHtml(question.bestThinking)}</p></div>
    <div class="box amber">${escapeHtml(question.explanation)}</div>
    <div class="box muted">${escapeHtml(thinkingText)}</div>
    <a class="primary" href="${nextHref}">${escapeHtml(nextLabel)}</a>
  </section>`,
    ),
  );
}

function renderFinish(count: number) {
  return response(
    "iPad用ミッション完了",
    `<main>
  <section class="card">
    <p class="eyebrow">iPad用ミッション</p>
    <h1>ミッション完了！</h1>
    <p>最後まで進めました。PC版は今まで通り、iPadではこの軽いHTML版を使えます。</p>
    <a class="primary" href="/">ホームへ</a>
    <a class="secondary" href="${questionPath(count, 0)}">もう一度</a>
  </section>
</main>`,
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { count: rawCount, page } = await context.params;
  const count = normalizeCount(rawCount);
  const questions = allQuestions.slice(0, count);

  if (page === "finish.html") return renderFinish(count);

  const match = page.match(/^q(\d+)(?:-a(\d+))?(?:-t(\d+))?\.html$/);
  if (!match) return response("Not Found", "<main><section class=\"card\"><h1>ページが見つかりません</h1></section></main>", 404);

  const index = Number(match[1]);
  const answerIndex = match[2] === undefined ? undefined : Number(match[2]);
  const thinkingIndex = match[3] === undefined ? undefined : Number(match[3]);
  const question = questions[index];

  if (!question) return renderFinish(count);
  if (answerIndex === undefined) return renderQuestion(count, index, question);
  if (!question.choices[answerIndex]) return renderQuestion(count, index, question);
  if (thinkingIndex === undefined) return renderAnswer(count, index, question, answerIndex);
  if (!question.thinkingChoices[thinkingIndex]) return renderAnswer(count, index, question, answerIndex);

  return renderFeedback(count, index, question, answerIndex, thinkingIndex);
}
