import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../data/fixed/2026-05.json');
const maximsPath = path.join(__dirname, '../data/maxims.json');

let rawData = fs.readFileSync(inputPath, 'utf8').trim();
let maximsData = JSON.parse(fs.readFileSync(maximsPath, 'utf8'));

if (rawData.startsWith('```')) {
    rawData = rawData.replace(/^```json\s*/, '').replace(/```$/, '').trim();
}

const quizData = JSON.parse(rawData);

// 漢字バリエーションのマップ
const kanjiMap = {
    "じてんしゃ": "じてんしゃ|自転車",
    "しんかんせん": "しんかんせん|新幹線",
    "くるま": "くるま|車",
    "でんわ": "でんわ|電話",
    "れいぞうこ": "れいぞうこ|冷蔵庫",
    "とけい": "とけい|時計",
    "めがね": "めがね|眼鏡|メガネ",
    "ばなな": "ばなな|バナナ",
    "さくら": "さくら|桜"
};

// 選択肢を付与するヘルパー
quizData.forEach((day, index) => {
    // 今日の格言を外部データから追加
    day.maxim = maximsData[index % maximsData.length];

    // 言葉パズル(Q4)の漢字バリエーション追加
    if (kanjiMap[day.a4]) {
        day.a4 = kanjiMap[day.a4];
    }
    // 難読漢字(Q3)で、ひらがなが正解になっている場合に漢字も許容する
    if (kanjiMap[day.a3]) {
        day.a3 = kanjiMap[day.a3];
    }

    // 奇数日は Q1（昭和回想）を選択式にする
    if (index % 2 === 0) {
        day.choices1 = [day.a1, "通天閣", "霞が関ビル", "日本武道館"].sort(() => Math.random() - 0.5);
    }
    // 3の倍数の日は Q3（難読漢字）を選択式にする
    if (index % 3 === 0) {
        const originalA3 = day.a3;
        const displayA3 = originalA3.split('|')[0];
        day.choices3 = [displayA3, "さつき", "あやめ", "つつじ"].filter(c => c !== displayA3).slice(0, 3);
        day.choices3.push(displayA3);
        day.choices3.sort(() => Math.random() - 0.5);
    }
});

fs.writeFileSync(inputPath, JSON.stringify(quizData, null, 2), 'utf8');
console.log('✅ 選択肢と格言データを追加しました。');
