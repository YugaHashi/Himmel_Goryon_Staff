const SUPABASE_URL = 'https://labmhtrafdslfwqmzgky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYm1odHJhZmRzbGZ3cW16Z2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTAzNzksImV4cCI6MjA2NTI2NjM3OX0.CviQ3lzngfvqDFwEtDw5cTRSEICWliunXngYCokhbNs';

const form = document.getElementById('survey-form');
const staffInput = document.getElementById('staff');

const SUFFIXES = ['君', 'くん', 'ちゃん', 'さん', '様', 'さま'];

function ensureSuffix(name) {
  const n = name.trim();
  const hasSuffix = SUFFIXES.some(s => n.endsWith(s));
  return (!hasSuffix && n !== '') ? n + 'さん' : n;
}

// ▼ ここが重要：入力途中の付与ロジック
let lastValue = '';
let isComposing = false;

staffInput.addEventListener('compositionstart', () => { isComposing = true; });
staffInput.addEventListener('compositionend', () => {
  isComposing = false;
  maybeAppendSuffix();
});

staffInput.addEventListener('input', () => {
  if (isComposing) return;           // IME変換中は触らない
  maybeAppendSuffix();
});

function maybeAppendSuffix() {
  const val = staffInput.value;
  const trimmed = val.trim();

  // 空なら何もしない
  if (trimmed === '') {
    lastValue = '';
    return;
  }

  // 既に敬称ありなら何もしない
  if (SUFFIXES.some(s => trimmed.endsWith(s))) {
    lastValue = trimmed;
    return;
  }

  // カーソルが末尾にないなら何もしない（途中削除・挿入対策）
  const atEnd = staffInput.selectionStart === val.length &&
                staffInput.selectionEnd === val.length;
  if (!atEnd) {
    lastValue = trimmed;
    return;
  }

  // 前回より短くなっていたら削除中なので付けない
  if (trimmed.length <= lastValue.length) {
    lastValue = trimmed;
    return;
  }

  // ここまで来たら「増加＆末尾入力」→ 敬称付与
  const withSuffix = ensureSuffix(trimmed);
  staffInput.value = withSuffix;
  lastValue = withSuffix.trim();
}

// ▼ 送信時の最終ガード（万一に備えて）
form.addEventListener('submit', async e => {
  e.preventDefault();

  const staffName = ensureSuffix(form.staff.value);

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
