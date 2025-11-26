// Password visibility toggle
const passShowBtn = document.querySelector('.pass-show');
const passIcon = document.querySelector('.pass-icon');
const passwordInput = document.getElementById('password-text');

if (passShowBtn && passwordInput && passIcon) {
  passShowBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passIcon.src = '../assets/eye.png';
    } else {
      passwordInput.type = 'password';
      passIcon.src = '../assets/eye-crossed.png';
    }
  });
}

// Login function
function login() {
  const username = document.getElementById('username-text').value;
  const password = document.getElementById('password-text').value;

  // Basic validation
  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }

  // For demo purposes, accept any credentials
  // In a real application, this would validate against a backend
  localStorage.setItem('logged-in', 'true');
  localStorage.setItem('username', username);
  
  // Redirect to home page
  window.location.href = '/home';
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username-text');
  const passwordInput = document.getElementById('password-text');
  
  if (usernameInput) {
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  }
});
