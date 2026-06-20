import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.join(process.cwd(), "public", "ipad-static");
const questions = JSON.parse(await readFile(path.join(process.cwd(), "src", "data", "questions.json"), "utf8"));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function page(title, body) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #fff7ed;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif;
      font-size: 18px;
      line-height: 1.65;
    }
    main { max-width: 720px; margin: 0 auto; padding: 20px 14px 48px; }
    .top { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .card { background: #ffffff; border: 2px solid #fed7aa; border-radius: 12px; padding: 20px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
    .pill { display: inline-block; border-radius: 999px; background: #ffffff; padding: 8px 14px; font-size: 14px; font-weight: 900; color: #334155; text-decoration: none; }
    .eyebrow { margin: 0 0 8px; color: #dc2626; font-size: 14px; font-weight: 900; }
    h1 { margin: 0; font-size: 28px; line-height: 1.25; }
    h2 { margin: 18px 0 8px; font-size: 20px; }
    p { margin: 12px 0 0; }
    .question { margin-top: 16px; border-radius: 10px; background: #fffbeb; padding: 16px; font-weight: 800; }
    .choice { display: block; min-height: 58px; margin-top: 12px; border: 2px solid #cbd5e1; border-radius: 10px; background: #f8fafc; padding: 14px 16px; color: #0f172a; text-decoration: none; font-weight: 900; }
    .thinking { border-color: #bae6fd; background: #f0f9ff; font-size: 17px; }
    .primary { display: block; margin-top: 20px; border-radius: 10px; background: #ef4444; padding: 16px; color: #ffffff; text-align: center; text-decoration: none; font-size: 20px; font-weight: 900; }
    .secondary { display: block; margin-top: 12px; border-radius: 10px; background: #0f172a; padding: 14px; color: #ffffff; text-align: center; text-decoration: none; font-weight: 900; }
    .box { margin-top: 12px; border-radius: 10px; padding: 14px; font-weight: 800; }
    .green { background: #ecfdf5; color: #064e3b; }
    .blue { background: #f0f9ff; color: #0c4a6e; }
    .amber { background: #fffbeb; color: #78350f; }
    .muted { background: #f8fafc; color: #334155; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function rel(...parts) {
  return parts.join("/");
}

async function writeHtml(parts, html) {
  const filePath = path.join(outputRoot, ...parts);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
}

function questionPage(count, index, question) {
  const choices = question.choices
    .map((choice, answerIndex) => `<a class="choice" href="${rel(`q${index}-a${answerIndex}.html`)}">${escapeHtml(choice)}</a>`)
    .join("\n");
  return page(
    `iPad用ミッション ${index + 1}`,
    `<main>
  <div class="top">
    <a class="pill" href="/">ホーム</a>
    <span class="pill">${index + 1} / ${count}</span>
  </div>
  <section class="card">
    <p class="eyebrow">iPad用ミッション</p>
    <h1>${escapeHtml(question.title)}</h1>
    <p class="question">${escapeHtml(question.question)}</p>
    <h2>答えをタップ</h2>
    ${choices}
  </section>
</main>`,
  );
}

function answerPage(count, index, question, answerIndex) {
  const selectedAnswer = question.choices[answerIndex];
  const choices = question.thinkingChoices
    .map((choice, thinkingIndex) => `<a class="choice thinking" href="${rel(`q${index}-a${answerIndex}-t${thinkingIndex}.html`)}">${escapeHtml(choice)}</a>`)
    .join("\n");
  return page(
    `考え方を選ぶ ${index + 1}`,
    `<main>
  <div class="top">
    <a class="pill" href="q${index}.html">戻る</a>
    <span class="pill">${index + 1} / ${count}</span>
  </div>
  <section class="card">
    <p class="eyebrow">選んだ答え</p>
    <h1>${escapeHtml(selectedAnswer)}</h1>
    <h2>考え方をタップ</h2>
    ${choices}
    <a class="secondary" href="q${index}.html">答えを選び直す</a>
  </section>
</main>`,
  );
}

function feedbackPage(count, index, question, answerIndex, thinkingIndex) {
  const selectedAnswer = question.choices[answerIndex];
  const selectedThinking = question.thinkingChoices[thinkingIndex];
  const nextHref = index >= count - 1 ? "finish.html" : `q${index + 1}.html`;
  const nextLabel = index >= count - 1 ? "完了する" : "次の問題へ";
  const title = selectedAnswer === question.answer ? "ナイスヒット！" : "いいところまで考えたね";
  const thinkingText = selectedThinking === question.bestThinking ? "考え方もばっちり。" : "次はこの考え方を使ってみよう。";

  return page(
    `答え合わせ ${index + 1}`,
    `<main>
  <div class="top">
    <a class="pill" href="q${index}.html">問題へ戻る</a>
    <span class="pill">${index + 1} / ${count}</span>
  </div>
  <section class="card">
    <p class="eyebrow">答え合わせ</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="box green">
      <strong>正しい答え</strong>
      <p>${escapeHtml(question.answer)}</p>
    </div>
    <div class="box blue">
      <strong>よい考え方</strong>
      <p>${escapeHtml(question.bestThinking)}</p>
    </div>
    <div class="box amber">${escapeHtml(question.explanation)}</div>
    <div class="box muted">${escapeHtml(thinkingText)}</div>
    <a class="primary" href="${nextHref}">${escapeHtml(nextLabel)}</a>
  </section>
</main>`,
  );
}

function finishPage(count) {
  return page(
    "iPad用ミッション完了",
    `<main>
  <section class="card">
    <p class="eyebrow">iPad用ミッション</p>
    <h1>ミッション完了！</h1>
    <p>最後まで進めました。PC版は今まで通り、iPadではこの軽いHTML版を使えます。</p>
    <a class="primary" href="/">ホームへ</a>
    <a class="secondary" href="q0.html">もう一度</a>
  </section>
</main>`,
  );
}

await rm(outputRoot, { force: true, recursive: true });

await writeHtml(
  ["index.html"],
  page(
    "iPad用ミッション",
    `<main>
  <section class="card">
    <p class="eyebrow">iPad用ミッション</p>
    <h1>問題数を選ぶ</h1>
    <a class="primary" href="5/q0.html">iPad 5問</a>
    <a class="secondary" href="10/q0.html">iPad 10問</a>
  </section>
</main>`,
  ),
);

for (const count of [5, 10]) {
  const missionQuestions = questions.slice(0, count);
  await writeHtml([String(count), "finish.html"], finishPage(count));

  for (const [questionIndex, question] of missionQuestions.entries()) {
    await writeHtml([String(count), `q${questionIndex}.html`], questionPage(count, questionIndex, question));

    for (const [answerIndex] of question.choices.entries()) {
      await writeHtml([String(count), `q${questionIndex}-a${answerIndex}.html`], answerPage(count, questionIndex, question, answerIndex));

      for (const [thinkingIndex] of question.thinkingChoices.entries()) {
        await writeHtml(
          [String(count), `q${questionIndex}-a${answerIndex}-t${thinkingIndex}.html`],
          feedbackPage(count, questionIndex, question, answerIndex, thinkingIndex),
        );
      }
    }
  }
}

console.log("Generated static iPad mission pages.");
