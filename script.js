const SUPABASE_URL = 'https://labmhtrafdslfwqmzgky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYm1odHJhZmRzbGZ3cW16Z2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTAzNzksImV4cCI6MjA2NTI2NjM3OX0.CviQ3lzngfvqDFwEtDw5cTRSEICWliunXngYCokhbNs';

const form = document.getElementById('survey-form');
const staffInput = document.getElementById('staff');

// 敬称がなければ「さん」を付ける関数
function ensureSuffix(name) {
  const suffixes = ['君', 'くん', 'ちゃん', 'さん', '様', 'さま'];
  const hasSuffix = suffixes.some(suffix => name.endsWith(suffix));
  return (!hasSuffix && name !== '') ? name + 'さん' : name;
}

// 入力途中で自動補完
staffInput.addEventListener('input', () => {
  let name = staffInput.value.trim();
  if (name === '') return;

  staffInput.value = ensureSuffix(name);
});

// フォーム送信
form.addEventListener('submit', async e => {
  e.preventDefault();

  const staffName = ensureSuffix(form.staff.value.trim());

  const data = {
    staff: staffName,
    service_rating: form.service_rating.value,
    comments: form.comments.value,
    created_at: new Date().toISOString()
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/staff_feedback`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'ご協力ありがとうございます';
    btn.disabled = true;
  } else {
    alert('送信に失敗しました。時間を置いて再度お試しください。');
  }
});
