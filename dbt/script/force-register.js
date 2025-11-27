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

  if (!username || !username.value) {
    console.log("Validation failed: username field not found or empty");
    displayMessage("Please enter a username", true);
    return;
  }

  console.log(`Starting registration process for username: ${username.value}`);

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
          usernames: username.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res_user.ok && (res_user.status < 200 || res_user.status > 299)) {
      console.error(`Roblox Lookup Error: Status ${res_user.status}`, res_user);
      throw new Error(
        `Roblox Lookup Error: ${res_user.status} - ${res_user.statusText}`
      );
    }

    let roblocData = await res_user.json();
    roblocData = JSON.parse(roblocData);
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
        `Grant Error: ${response.status} - ${response.statusText}`
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

// Attach event listener to button
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("login-btn");
  if (btn) {
    btn.addEventListener("click", new Promise(async (resolve) => {
      await clicked();
      resolve();
    }));
  }
});
