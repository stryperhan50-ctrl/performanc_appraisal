const sampleResume = `프로젝트: 3주 만에 React로 출결 관리 앱 완성, 120명 사용자 확보
인턴십: 스타트업에서 SQL → Python ETL 파이프라인 9일 만에 구축, 일일 처리 30만 건
자기소개: 새로운 프레임워크는 주말에 끝낸다`;

async function scan() {
  const text = document.getElementById('input').value.trim() || sampleResume;
  document.getElementById('result').innerHTML = '<p class="text-center">AI 판단 중...</p>';
  document.getElementById('result').classList.remove('hidden');

  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume: text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    render(data);
  } catch (e) {
    document.getElementById('result').innerHTML = 
      `<p class="text-red-600">API 호출 실패. 콘솔 확인!</p>`;
    console.error(e);
  }
}

function render(data) {
  const { a, b, c, rec, question } = data;
  const html = `
    <div class="grid md:grid-cols-3 gap-6">
      <div class="p-5 rounded-xl border ${a.score>=7?'score-high':a.score>=5?'score-med':'score-low'}">
        <h3 class="font-bold text-lg">실행 가능성</h3>
        <p class="text-2xl font-black">${a.score}/10</p>
        <p class="text-sm mt-2">${a.why}</p>
        <p class="italic text-xs mt-2">“${a.proof}”</p>
      </div>
      <div class="p-5 rounded-xl border ${b.score>=7?'score-high':b.score>=5?'score-med':'score-low'}">
        <h3 class="font-bold text-lg">학습 속도</h3>
        <p class="text-2xl font-black">${b.score}/10</p>
        <p class="text-sm mt-2">${b.why}</p>
      </div>
      <div class="p-5 rounded-xl border ${c.score>=7?'score-high':c.score>=5?'score-med':'score-low'}">
        <h3 class="font-bold text-lg">업무 적합성</h3>
        <p class="text-2xl font-black">${c.score}/10</p>
        <p class="text-sm mt-2">${c.why}</p>
      </div>
    </div>

    <div class="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
      <h3 class="text-2xl font-bold">최종 권고</h3>
      <p class="text-xl mt-3">${rec}</p>
      <p class="mt-4 italic text-lg">면접 질문: “${question}”</p>
    </div>
  `;
  document.getElementById('result').innerHTML = html;
}