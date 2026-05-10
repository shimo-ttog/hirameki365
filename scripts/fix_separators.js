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

// 既存データの a1, a2, a3, a4 に含まれるカンマをパイプに変換（金額のカンマは除外したいが、基本的にはバリエーション用のみ）
// ただし、今のデータ構造では a4 などに "じてんしゃ,自転車" と入ってしまっている
quizData.forEach((day) => {
    ['a1', 'a2', 'a3', 'a4'].forEach(key => {
        if (day[key] && day[key].includes(',') && !day[key].match(/\d,\d/)) {
            // 数字に挟まれたカンマ（金額）以外をパイプに置換
            day[key] = day[key].replace(/,/g, '|');
        }
    });
});

fs.writeFileSync(inputPath, JSON.stringify(quizData, null, 2), 'utf8');
console.log('✅ JSONデータのカンマ区切りをパイプ区切りに修正しました。');
