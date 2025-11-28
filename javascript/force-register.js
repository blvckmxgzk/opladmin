function displayMessage(text, isError = false) {
  let nextPosition = 0;
  const existingMessages = document.querySelectorAll("p");

  existingMessages.forEach((msg) => {nextPosition = Math.max(nextPosition, msg.offsetTop + msg.offsetHeight + 5);})
  
  const txt = document.createElement("p");
  txt.style.fontFamily = "Courier New";
  txt.style.color = isError ? "red" : "white";
  txt.style.fontSize = "14px";
  txt.style.textAlign = "left";
  txt.style.position = "absolute";
  txt.style.width = "100%";
  txt.style.top = `${nextPosition}px`;
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

async function register() {
  const username = document.getElementById("username-input");

    displayMessage("Force register action initiated");

  if (!username || !username.value) {
    console.log("Validation failed: username field not found or empty");
    displayMessage("Please enter a username", true);
    return;
  }

  displayMessage(`Starting registration process for username: ${username.value}`);

  // Show loading spinner and disable button
  setButtonLoading(true);

  try {
    // Step 1: Fetch Roblox User ID
    console.log("Step 1: Looking up Roblox username...");
    displayMessage("Looking up Roblox username...");
    const res_user = await fetch(
      "https://oplbackend.onrender.com/users",
      {
        method: "POST",
        body: JSON.stringify({
          username: username.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res_user.ok) {
      console.error(`Roblox Lookup Error: Status ${res_user.status}`, res_user);
      throw new Error(
        `Roblox Lookup Error: ${res_user.status} - ${res_user.error.stack}`
      );
    }

    let roblocData = await res_user.json();

    console.log(roblocData)
        
    const userId =
      roblocData.data && roblocData.data ? roblocData.data.id : null;

    if (!userId) {
      console.error(`User ID not found for username: ${username.value}`);
      throw new Error(
        `Error: Could not find user ID for username: ${username.value}`
      );
    }

    // Step 2: Confirm user ID found
    console.log(`Step 2: Username found - ${username.value} (ID: ${userId})`);
    displayMessage(`Username found: ${username.value} (ID: ${userId})`);

    // Step 3: Grant whitelist access
    console.log(`Step 3: Granting whitelist access for user ID: ${userId}`);
    displayMessage("Granting whitelist access...");
    const response = await fetch(
      "https://oplbackend.onrender.com/admin/wl/grant",
      {
        method: "POST",
        body: JSON.stringify({ rank: 0, userid: userId }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (response.ok) {
      // Step 4: Success
      console.log(`Step 4: Success! User ${username.value} (ID: ${userId}) registered successfully`);
      displayMessage("✓ User registered successfully!");
      username.value = "";
    } else {
      console.error(`Grant Error: Status ${response.status}`, response);
      throw new Error(
        `Grant Error: ${response.status} - ${response.error.stack}`
      );
    }
  } catch (error) {
    console.error("Registration process failed:", error);
    let errorMessage = `An unknown error occurred: ${error.message}`;

    if (error.message.startsWith("Roblox Lookup Error")) {
      errorMessage = error.message;
    } else if (error.message.startsWith("Error: Could not find user ID")) {
      errorMessage = error.message;
    } else if (error.message.startsWith("Grant Error")) {
      errorMessage = error.message;
    } else if (error instanceof TypeError) {
      errorMessage = `Network/Initialization Error: ${error.message}`;
    } else if (error instanceof SyntaxError) {
      errorMessage = `Internal Error (JSON Parse): ${error.message}`;
    }

    displayMessage(errorMessage, true);
  } finally {
    // Hide loading spinner and enable button
    setButtonLoading(false);
  }
};
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("login-btn");
  if (btn) {
    btn.addEventListener("click", register);
  }
});
