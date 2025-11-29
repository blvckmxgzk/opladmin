// Password visibility toggle
const passShowBtn = document.querySelector(".pass-show");
const passIcon = document.querySelector(".pass-icon");
const passwordInput = document.getElementById("password-text");

if (passShowBtn && passwordInput && passIcon) {
  passShowBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passIcon.src = "../assets/eye.png";
    } else {
      passwordInput.type = "password";
      passIcon.src = "../assets/eye-crossed.png";
    }
  });
}

// Button loading state function
function setButtonLoading(isLoading) {
  const btn = document.querySelector(".login-btn");
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.id = "btn-spinner";
    btn.textContent = "";
    btn.appendChild(spinner);
    const text = document.createTextNode("Logging in");
    btn.appendChild(text);
  } else {
    btn.disabled = false;
    const spinner = document.getElementById("btn-spinner");
    if (spinner) spinner.remove();
    btn.textContent = "login";
  }
}

// Login function
async function login() {
  const username = document.getElementById("username-text").value;
  const password = document.getElementById("password-text").value;

  // Basic validation
  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  // Show loading spinner
  setButtonLoading(true);

  try {
    const response = await fetch(
      "https://oplbackend.vercel.app/admin/authenticate/login",
      {
        method: "POST",
        body: JSON.stringify({
          user: username,
          pass: password,
          deviceId: localStorage.getItem("deviceId")
            ? localStorage.getItem("deviceId")
            : crypto.randomUUID(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Redirect to home page
    if (response.success === true) {
      if (!localStorage.getItem("deviceId")) {
        localStorage.setItem("deviceId", crypto.randomUUID());
      }
      location.href = "/home";
    } else {
      alert(response.error);
      setButtonLoading(false);
    }
  } catch (error) {
    console.error("Login error:", error);
    setButtonLoading(false);
    alert("An error occurred during login");
  }
}

// Allow Enter key to submit
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username-text");
  const passwordInput = document.getElementById("password-text");

  if (usernameInput) {
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") login();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") login();
    });
  }
});
