const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const PROMPT = `너는 6개월 성과 예측 전문가다. 아래 이력서만 보고 JSON으로 답해:

{
  "a": {"score": 8, "why": "3주 만에 앱 완성", "proof": "120명 사용자"},
  "b": {"score": 9, "why": "9일 만에 ETL 구축"},
  "c": {"score": 7, "why": "Python 실무 경험"},
  "rec": "즉시 면접 진행",
  "question": "ETL 파이프라인에서 가장 큰 장애는?"
}`;

module.exports = async (req, res) => {
  const { resume } = req.body;

  try {
    const result = await model.generateContent([PROMPT, resume || '']);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
      res.status(500).json({ rec: '분석 실패', question: '다시 시도' });
    }
  } catch (error) {
    console.error("Error in talentScanner:", error);
    res.status(500).json({ rec: '오류 발생', question: '다시 시도해 주세요.' });
  }
};
