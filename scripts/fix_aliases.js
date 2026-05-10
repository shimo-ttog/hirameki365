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

// 括弧で囲まれた別名をパイプ区切りに変換する
quizData.forEach((day) => {
    ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'].forEach(key => {
        if (day[key]) {
            let val = day[key];
            
            // 「A（または、B）」や「A（またはB）」を「A|B」に
            val = val.replace(/（または、?(.+?)）/g, '|$1');
            val = val.replace(/\(または、?(.+?)\)/g, '|$1');
            
            // 「A（B）」を「A|B」に（内側の括弧も考慮）
            // ただし、単なる補足説明の場合もあるが、脳トレとしてはどちらも正解にしたい
            val = val.replace(/（(.+?)）/g, '|$1');
            val = val.replace(/\((.+?)\)/g, '|$1');
            
            // 重複するパイプや前後の空白を除去
            val = val.split('|').map(s => s.trim()).filter(s => s !== "").join('|');
            
            day[key] = val;
        }
    });
});

fs.writeFileSync(inputPath, JSON.stringify(quizData, null, 2), 'utf8');
console.log('✅ 括弧付きの回答をパイプ区切りのバリエーションに変換しました。');
