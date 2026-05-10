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

// Q5 (ひらめき系) のネタ
const inspirationQuizzes = [
    { q: "「目・山・傘」の前に共通してつく言葉は何？", a: "ふじ|富士" },
    { q: "「水・木・火」の後に共通してつく言葉は何？", a: "ようび|曜日" },
    { q: "「空・紙・船」の後に共通してつく言葉は何？", a: "ひこうき|飛行機" },
    { q: "「朝・昼・晩」に共通して食べるものは？", a: "ごはん|食事" },
    { q: "「春・夏・秋・冬」をまとめて何と呼ぶ？", a: "しき|四季" },
    { q: "「赤・青・黄」は信号機の何？", a: "いろ|色" },
    { q: "「犬・猫・鳥」は一般的に何と呼ばれる？", a: "どうぶつ|動物" },
    { q: "「日本・アメリカ・中国」は何の名前？", a: "くに|国" },
    { q: "「円・ドル・ユーロ」は何の単位？", a: "おかね|お金|通貨" },
    { q: "「ピアノ・ギター・太鼓」をまとめて何と呼ぶ？", a: "がっき|楽器" }
];

// Q7 (間違い探し) の漢字ペア
const kanjiPairs = [
    { c: "鳥", w: "烏" },
    { c: "大", w: "犬" },
    { c: "白", w: "百" },
    { c: "目", w: "自" },
    { c: "日", w: "曰" },
    { c: "石", w: "右" },
    { c: "玉", w: "王" },
    { c: "土", w: "士" },
    { c: "間", w: "問" },
    { c: "名", w: "各" }
];

const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

quizData.forEach((day, index) => {
    // Q5: ひらめき
    const insp = inspirationQuizzes[index % inspirationQuizzes.length];
    day.q5 = insp.q;
    day.a5 = insp.a;

    // Q6: 記憶力
    if (index % 2 === 0) {
        day.q6 = "今日の「昭和回想（Q1）」の正解は何でしたか？（画面を戻らずに思い出してみましょう）";
        day.a6 = day.a1.split('|')[0]; // 最初の1つを正解にする
    } else {
        const dateObj = new Date(day.date);
        dateObj.setDate(dateObj.getDate() - 3); // 3日前
        const threeDaysAgo = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
        const dayOfWeek = weekdays[dateObj.getDay()];
        day.q6 = `3日前の「${threeDaysAgo}」は何曜日でしたか？`;
        day.a6 = dayOfWeek;
    }

    // Q7: 間違い探し
    const pair = kanjiPairs[index % kanjiPairs.length];
    const len = 15;
    const pos = Math.floor(Math.random() * len) + 1; // 1〜15
    let grid = "";
    for (let i = 1; i <= len; i++) {
        grid += (i === pos) ? pair.w : pair.c;
    }
    day.q7 = `次の文字の中に一つだけ違う漢字があります。左から何番目でしょうか？\n\n「${grid}」`;
    day.a7 = pos.toString();
    
    // Q7は選択肢を作る
    let choices = [pos.toString()];
    while (choices.length < 4) {
        let r = Math.floor(Math.random() * len) + 1;
        if (!choices.includes(r.toString())) choices.push(r.toString());
    }
    day.choices7 = choices.sort((a, b) => parseInt(a) - parseInt(b));
});

fs.writeFileSync(inputPath, JSON.stringify(quizData, null, 2), 'utf8');
console.log('✅ 5月分のデータを7問構成（Q5-Q7追加）に拡張しました。');
