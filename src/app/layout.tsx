import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "戦国武将ベースボール探偵団",
  description: "小2向けの算数・読解ミッションWebアプリ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  if (window.__sbbtTapFallbackReady) return;
  window.__sbbtTapFallbackReady = true;

  function closestArticle(node) {
    while (node && node.tagName !== 'ARTICLE') {
      node = node.parentNode;
    }
    return node;
  }

  function closestWithAttribute(node, attr) {
    while (node && node !== document) {
      if (node.getAttribute && node.getAttribute(attr) !== null) return node;
      node = node.parentNode;
    }
    return null;
  }

  function paint(root, selector, attr, value, selectedClass) {
    var buttons = root.querySelectorAll(selector);
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      button.className = button.className.replace(selectedClass, '');
      if (button.getAttribute(attr) === value) {
        button.className = button.className + selectedClass;
      }
    }
  }

  function updateSubmit(root) {
    var submit = root.querySelector('[data-check-answer]');
    if (!submit) return;
    if (root.getAttribute('data-selected-answer') && root.getAttribute('data-selected-thinking')) {
      submit.removeAttribute('disabled');
      submit.className = submit.className.replace('disabled:bg-slate-300', '');
    }
  }

  function handleMissionTap(event) {
    var answerButton = closestWithAttribute(event.target, 'data-answer-choice');
    if (answerButton) {
      var answerRoot = closestArticle(answerButton);
      if (!answerRoot) return;
      var answer = answerButton.getAttribute('data-answer-choice') || '';
      answerRoot.setAttribute('data-selected-answer', answer);
      paint(answerRoot, '[data-answer-choice]', 'data-answer-choice', answer, ' border-blue-600 bg-blue-100 text-blue-950');
      updateSubmit(answerRoot);
      return;
    }

    var thinkingButton = closestWithAttribute(event.target, 'data-thinking-choice');
    if (thinkingButton) {
      var thinkingRoot = closestArticle(thinkingButton);
      if (!thinkingRoot) return;
      var thinking = thinkingButton.getAttribute('data-thinking-choice') || '';
      thinkingRoot.setAttribute('data-selected-thinking', thinking);
      paint(thinkingRoot, '[data-thinking-choice]', 'data-thinking-choice', thinking, ' border-emerald-600 bg-emerald-100 text-emerald-950');
      updateSubmit(thinkingRoot);
      return;
    }

    var submitButton = closestWithAttribute(event.target, 'data-check-answer');
    if (submitButton) {
      var submitRoot = closestArticle(submitButton);
      if (!submitRoot) return;
      var selectedAnswer = submitRoot.getAttribute('data-selected-answer') || '';
      var selectedThinking = submitRoot.getAttribute('data-selected-thinking') || '';
      var feedback = submitRoot.querySelector('[data-fallback-feedback]');
      if (!selectedAnswer || !selectedThinking || !feedback) return;
      var correct = submitButton.getAttribute('data-correct-answer') || '';
      var best = submitButton.getAttribute('data-best-thinking') || '';
      var explanation = submitButton.getAttribute('data-explanation') || '';
      var result = selectedAnswer === correct ? 'ナイスヒット！' : 'いいところまで考えたね';
      feedback.className = feedback.className.replace('hidden', '');
      feedback.innerHTML = result + '<br>正しい答え: ' + correct + '<br>よい考え方: ' + best + '<br>' + explanation;
      try {
        feedback.scrollIntoView(false);
      } catch (error) {}
    }
  }

  document.addEventListener('click', handleMissionTap, true);
  document.addEventListener('touchend', handleMissionTap, true);
})();`,
          }}
        />
      </body>
    </html>
  );
}
