// script.js
const SUPABASE_URL = 'https://labmhtrafdslfwqmzgky.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYm1odHJhZmRzbGZ3cW16Z2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTAzNzksImV4cCI6MjA2NTI2NjM3OX0.CviQ3lzngfvqDFwEtDw5cTRSEICWliunXngYCokhbNs';

const form = document.getElementById('survey-form')
const thanks = document.getElementById('thanks-image-container')

form.addEventListener('submit', async e => {
  e.preventDefault()

  const data = {
    staff: form.staff.value,
    service_rating: form.service_rating.value,
    comments: form.comments.value,
    created_at: new Date().toISOString()
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/staff_feedback`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(data)
  })

  if (res.ok) {
    form.reset()
    thanks.style.display = 'block'
    setTimeout(() => thanks.scrollIntoView({ behavior: 'smooth' }), 200)
  } else {
    alert('送信に失敗しました。時間を置いて再度お試しください。')
  }
})
