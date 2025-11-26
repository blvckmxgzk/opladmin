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

async function clicked() {
  const username = document.getElementById("username-input");
  
  if (!username || !username.value) {
    displayMessage("Please enter a username", true);
    return;
  }
  
  try {
    // Fetch Roblox User ID and grant access
    const res_user = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      body: JSON.stringify({
        usernames: [username.value],
        excludeBannedUsers: true,
      }),
      mode: "no-cors",
    });

    if (!res_user.ok && (res_user.status < 200 || res_user.status > 299)) {
      throw new Error(
        `Roblox Lookup Error: ${res_user.status} - ${res_user.statusText}`
      );
    }

    const roblocData = await res_user.json();
    const userId = roblocData.data && roblocData.data[0] ? roblocData.data[0].id : null;

    if (!userId) {
      throw new Error(
        `Error: Could not find user ID for username: ${username.value}`
      );
    }

    const response = await fetch("https://oplbackend.onrender.com/admin/wl/grant", {
      method: "POST",
      body: JSON.stringify({ rank: 0, userid: userId }),
    });

    if (response.ok) {
      displayMessage("success");
      username.value = "";
    } else {
      throw new Error(
        `Grant Error: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(error);
    let errorMessage = `An unknown error occurred: ${error.message}`;

    if (error.message.startsWith("Roblox Lookup Error")) {
      errorMessage = error.message;
    } else if (
      error.message.startsWith("Error: Could not find user ID")
    ) {
      errorMessage = error.message;
    } else if (error.message.startsWith("Grant Error")) {
      errorMessage = error.message;
    } else if (error instanceof TypeError) {
      errorMessage = `Network/Initialization Error: ${error.message}`;
    } else if (error instanceof SyntaxError) {
      errorMessage = `Internal Error (JSON Parse): ${error.message}`;
    }

    displayMessage(errorMessage, true);
  }
}

// Attach event listener to button
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.addEventListener('click', clicked);
  }
});
