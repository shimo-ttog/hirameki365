import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../data/fixed/2026-05.json');
let rawData = fs.readFileSync(inputPath, 'utf8').trim();

if (rawData.startsWith('```')) {
    rawData = rawData.replace(/^```json\s*/, '').replace(/```$/, '').trim();
}

const quizData = JSON.parse(rawData);
const outputDir = path.join(__dirname, '../src/content/blog');

/**
 * 問題ブロックのHTMLを生成する
 */
function renderQuestion(title, q, a, choices, id) {
    let inputHtml = '';
    if (choices && choices.length > 0) {
        inputHtml = `<div class="choices-group">
${choices.map((c, i) => `      <label class="choice-label"><input type="radio" name="q${id}" value="${c}" class="user-answer-radio"> ${c}</label>`).join('\n')}
    </div>`;
    } else {
        inputHtml = `    <input type="text" class="user-answer-input" placeholder="ここに入力" data-q-id="q${id}">`;
    }

    return `<div class="quiz-step" data-step="${id}" style="display: none;">
  <div class="step-indicator">第 ${id} 問 / 全 7 問</div>
  <h3>${title}</h3>
  <div class="question-block" data-correct="${a}">
    <p class="question-text">${q}</p>
${inputHtml}
    <span class="judgment-mark" id="mark-q${id}"></span>
    <div class="answer-hidden">正解：<strong>${a.replace(/\|/g, ' または ')}</strong></div>
  </div>
  <div class="step-nav">
    <button class="btn-adult btn-primary judge-btn" data-step="${id}">答えを判定する</button>
    <button class="btn-adult btn-outline next-btn hidden" data-step="${id}">次の問題へ ＞</button>
  </div>
</div>`;
}

if (fs.existsSync(outputDir)) {
    fs.readdirSync(outputDir).forEach(file => fs.unlinkSync(path.join(outputDir, file)));
} else {
    fs.mkdirSync(outputDir, { recursive: true });
}

const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

quizData.forEach((day) => {
    const dateObj = new Date(day.date);
    const dayOfWeek = weekdays[dateObj.getDay()];
    const dateParts = day.date.split('-');
    const formattedDate = `${dateParts[0]}年${parseInt(dateParts[1])}月${parseInt(dateParts[2])}日(${dayOfWeek})`;

    // Q1のタイトルを問題文から動的に判定
    const q1Text = day.q1 || day.昭和回想 || "";
    let q1Title = "昭和・平成回想";
    if (q1Text.includes("昭和")) {
        q1Title = "昭和回想";
    } else if (q1Text.includes("平成")) {
        q1Title = "平成回想";
    }

    const q1 = renderQuestion(q1Title, q1Text, day.a1, day.choices1, 1);
    const q2 = renderQuestion("買い物計算", day.q2 || day.買い物計算, day.a2, day.choices2, 2);
    const q3 = renderQuestion("難読漢字", day.q3 || day.難読漢字, day.a3, day.choices3, 3);
    const q4 = renderQuestion("言葉パズル", day.q4 || day.言葉パズル, day.a4, day.choices4, 4);
    const q5 = renderQuestion("ひらめきパズル", day.q5, day.a5, day.choices5, 5);
    const q6 = renderQuestion("記憶力テスト", day.q6, day.a6, day.choices6, 6);
    const q7 = renderQuestion("間違い探し", day.q7, day.a7, day.choices7, 7);

    const markdownContent = `---
title: "ひらめき365：${formattedDate}"
date: "${day.date}"
trivia: "${day.豆知識.replace(/"/g, '\\"')}"
maxim: "${(day.maxim || "今日という日は、残りの人生の最初の一日です。").replace(/"/g, '\\"')}"
---

${q1}
${q2}
${q3}
${q4}
${q5}
${q6}
${q7}
`;

    fs.writeFileSync(path.join(outputDir, `${day.date}.md`), markdownContent, 'utf8');
});

console.log('✅ インタラクティブな回答欄を含むMarkdownを再生成しました！');