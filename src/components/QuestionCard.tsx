"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/types/question";
import { HintBox } from "./HintBox";
import { RubyText } from "./RubyText";

type QuestionCardProps = {
  question: Question;
  index: number;
  total: number;
  onAnswered: (selectedAnswer: string, selectedThinking: string, hintCount: number) => void;
};

export function QuestionCard({ question, index, total, onAnswered }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedThinking, setSelectedThinking] = useState("");
  const [hintCount, setHintCount] = useState(0);

  const canSubmit = selectedAnswer && selectedThinking;
  const answerChoices = useMemo(() => shuffleChoices(question.choices, `${question.id}-answer`), [question.id, question.choices]);
  const thinkingChoices = useMemo(() => shuffleChoices(question.thinkingChoices, question.id), [question.id, question.thinkingChoices]);

  return (
    <article className="rounded-lg border-2 border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-red-600">
            <RubyText text={question.missionType} /> {index + 1}/{total}
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-950"><RubyText text={question.title} /></h1>
        </div>
        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
          <RubyText text={`${question.category}・${question.unit}`} />
        </span>
      </div>

      <p className="mt-5 rounded-lg bg-sky-50 p-4 text-lg font-bold leading-9 text-slate-900"><RubyText text={question.question} /></p>

      <section className="mt-5">
        <h2 className="text-lg font-black"><RubyText text="答えをえらぼう" /></h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {answerChoices.map((choice) => (
            <button
              key={choice}
              type="button"
              data-answer-choice={choice}
              onClick={() => setSelectedAnswer(choice)}
              className={`min-h-14 rounded-lg border-2 px-4 py-3 text-left text-lg font-black transition ${
                selectedAnswer === choice
                  ? "border-blue-600 bg-blue-100 text-blue-950"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <RubyText text={choice} />
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-black"><RubyText text="どう考えた？" /></h2>
        <div className="mt-3 grid gap-3">
          {thinkingChoices.map((choice) => (
            <button
              key={choice}
              type="button"
              data-thinking-choice={choice}
              onClick={() => setSelectedThinking(choice)}
              className={`min-h-12 rounded-lg border-2 px-4 py-3 text-left text-base font-bold transition ${
                selectedThinking === choice
                  ? "border-emerald-600 bg-emerald-100 text-emerald-950"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <RubyText text={choice} />
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5">
        <HintBox
          hints={question.hints}
          shownCount={hintCount}
          onShowHint={() => setHintCount((count) => Math.min(3, count + 1))}
        />
      </div>

      <button
        type="button"
        data-check-answer="true"
        data-correct-answer={question.answer}
        data-best-thinking={question.bestThinking}
        data-explanation={question.explanation}
        disabled={!canSubmit}
        onClick={() => onAnswered(selectedAnswer, selectedThinking, hintCount)}
        className="mt-6 w-full rounded-lg bg-red-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-red-600 disabled:bg-slate-300"
      >
        <RubyText text="答え合わせをする" />
      </button>
      <div data-fallback-feedback="true" className="mt-5 hidden rounded-lg bg-amber-50 p-4 text-base font-black leading-7 text-amber-950" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var cards = document.querySelectorAll('[data-check-answer]');
  for (var i = 0; i < cards.length; i += 1) {
    var submit = cards[i];
    var root = submit;
    while (root && root.tagName !== 'ARTICLE') {
      root = root.parentNode;
    }
    if (!root || root.getAttribute('data-fallback-ready') === 'true') continue;
    root.setAttribute('data-fallback-ready', 'true');
    var selectedAnswer = '';
    var selectedThinking = '';
    var answerButtons = root.querySelectorAll('[data-answer-choice]');
    var thinkingButtons = root.querySelectorAll('[data-thinking-choice]');
    var feedback = root.querySelector('[data-fallback-feedback]');
    function paint(list, attr, value, selectedClass) {
      for (var j = 0; j < list.length; j += 1) {
        var button = list[j];
        if (button.getAttribute(attr) === value) {
          button.className = button.className + ' ' + selectedClass;
        } else {
          button.className = button.className.replace(selectedClass, '');
        }
      }
    }
    function updateSubmit() {
      if (selectedAnswer && selectedThinking) {
        submit.removeAttribute('disabled');
        submit.className = submit.className.replace('disabled:bg-slate-300', '');
      }
    }
    for (var a = 0; a < answerButtons.length; a += 1) {
      answerButtons[a].addEventListener('click', function () {
        selectedAnswer = this.getAttribute('data-answer-choice') || '';
        paint(answerButtons, 'data-answer-choice', selectedAnswer, ' border-blue-600 bg-blue-100 text-blue-950');
        updateSubmit();
      });
    }
    for (var t = 0; t < thinkingButtons.length; t += 1) {
      thinkingButtons[t].addEventListener('click', function () {
        selectedThinking = this.getAttribute('data-thinking-choice') || '';
        paint(thinkingButtons, 'data-thinking-choice', selectedThinking, ' border-emerald-600 bg-emerald-100 text-emerald-950');
        updateSubmit();
      });
    }
    submit.addEventListener('click', function () {
      if (!selectedAnswer || !selectedThinking || !feedback) return;
      var correct = this.getAttribute('data-correct-answer') || '';
      var best = this.getAttribute('data-best-thinking') || '';
      var explanation = this.getAttribute('data-explanation') || '';
      var result = selectedAnswer === correct ? 'ナイスヒット！' : 'いいところまで考えたね';
      feedback.className = feedback.className.replace('hidden', '');
      feedback.innerHTML = result + '<br>正しい答え: ' + correct + '<br>よい考え方: ' + best + '<br>' + explanation;
      try {
        feedback.scrollIntoView(false);
      } catch (error) {}
    });
  }
})();`,
        }}
      />
    </article>
  );
}

function shuffleChoices(choices: string[], seedText: string) {
  const shuffled = [...choices];
  let seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
