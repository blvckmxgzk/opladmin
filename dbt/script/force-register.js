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
      console.log(res_user.status, res_user);
      throw new Error(
        `Roblox Lookup Error: ${res_user.status} - ${res_user.statusText}`
      );
    }

    let roblocData = res_user.json();
    roblocData = JSON.parse(roblocData);
    const userId =
      roblocData.data && roblocData.data ? roblocData.data.id : null;

    if (!userId) {
      throw new Error(
        `Error: Could not find user ID for username: ${username.value}`
      );
    }

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
  }
}
