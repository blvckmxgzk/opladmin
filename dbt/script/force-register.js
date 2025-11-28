function displayMessage(text, isError = false) {
  const txt = document.createElement("p");
  txt.style.fontFamily = "Courier New";
  txt.style.color = isError ? "red" : "white";
  txt.style.fontSize = "16px";
  txt.style.width = "100%";
  txt.style.textAlign = "left";
  txt.textContent = text;
  document.body.appendChild(txt);
}

function setButtonLoading(isLoading) {
  const btn = document.getElementById("login-btn");
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.id = "btn-spinner";
    btn.textContent = "";
    btn.appendChild(spinner);
    const text = document.createTextNode("Processing");
    btn.appendChild(text);
  } else {
    btn.disabled = false;
    const spinner = document.getElementById("btn-spinner");
    if (spinner) spinner.remove();
    btn.textContent = "force-register";
  }
}

async function clicked() {
  const username = document.getElementById("username-input");

  console.log("Force register action initiated");
  displayMessage("Initiating force register...");

  if (!username || !username.value) {
    console.log("Validation failed: username field not found or empty");
    displayMessage("Please enter a username", true);
    return;
  }

  console.log("Starting registration process for username: " + username.value);
  displayMessage("Starting registration for: " + username.value);

  setButtonLoading(true);

  try {
    console.log("Step 1: Looking up Roblox username...");
    displayMessage("Step 1: Looking up Roblox username...");
    
    const res_user = await fetch("https://oplbackend.onrender.com/users", {
      method: "POST",
      body: JSON.stringify({ usernames: username.value }),
      headers: { "Content-Type": "application/json" }
    });

    console.log("Step 1 response received: " + res_user.status);

    if (!res_user.ok) {
      console.error("Roblox Lookup Error: Status " + res_user.status);
      throw new Error("Roblox Lookup Error: " + res_user.status + " - " + res_user.statusText);
    }

    let roblocData = await res_user.json();
    console.log("Raw response: " + JSON.stringify(roblocData));
    
    if (typeof roblocData === "string") {
      roblocData = JSON.parse(roblocData);
    }
    
    const userId = roblocData.data && roblocData.data.id ? roblocData.data.id : null;

    if (!userId) {
      console.error("User ID not found for username: " + username.value);
      throw new Error("Error: Could not find user ID for username: " + username.value);
    }

    console.log("Step 2: Username found - " + username.value + " (ID: " + userId + ")");
    displayMessage("Username found: " + username.value + " (ID: " + userId + ")");

    console.log("Step 3: Granting whitelist access for user ID: " + userId);
    displayMessage("Step 3: Granting whitelist access...");
    
    const response = await fetch("https://oplbackend.onrender.com/admin/wl/grant", {
      method: "POST",
      body: JSON.stringify({ rank: 0, userid: userId }),
      headers: { "Content-Type": "application/json" }
    });

    console.log("Step 3 response received: " + response.status);

    if (response.ok) {
      console.log("Step 4: Success! User " + username.value + " (ID: " + userId + ") registered successfully");
      displayMessage("Success! User registered successfully!");
      username.value = "";
    } else {
      console.error("Grant Error: Status " + response.status);
      throw new Error("Grant Error: " + response.status + " - " + response.statusText);
    }
  } catch (error) {
    console.error("Registration process failed: " + error.message);
    let errorMessage = "An unknown error occurred: " + error.message;

    if (error.message.indexOf("Roblox Lookup Error") >= 0) {
      errorMessage = error.message;
    } else if (error.message.indexOf("Could not find user ID") >= 0) {
      errorMessage = error.message;
    } else if (error.message.indexOf("Grant Error") >= 0) {
      errorMessage = error.message;
    } else if (error instanceof TypeError) {
      errorMessage = "Network/Initialization Error: " + error.message;
    } else if (error instanceof SyntaxError) {
      errorMessage = "Internal Error (JSON Parse): " + error.message;
    }

    displayMessage(errorMessage, true);
  } finally {
    setButtonLoading(false);
  }
}

window.clicked = clicked;

document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById("login-btn");
  if (btn) {
    btn.addEventListener("click", clicked);
  }
});
