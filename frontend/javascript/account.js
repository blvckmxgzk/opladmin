const username_text = document.getElementById("username-text")
const password_text = document.getElementById("password-text")
const login_btn = document.getElementById("login-btn")
const request_btn = document.getElementById("request-btn")

async function registerUser() {
  const user = login_btn.value;
  const pass = password_text.value;

  const res = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass }),
  });

  alert(await res.text());
}

async function login() {
  const user = login_btn.value;
  const pass = password_text.value;

  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass }),
  });

  if (res.ok) {
    alert(await res.text());
  } else {
    alert(await res.text());
  }
}

async function request_clicked() {
  location.href = "../request/index.html"
}