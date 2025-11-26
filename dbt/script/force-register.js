const username = document.getElementById("username-text");
const register_btn = document.getElementById("login-btn");

// Helper function to create and display a message element
function displayMessage(text, isError = false) {
  const txt = document.createElement("p");
  txt.style.fontFamily = "Courier New";
  txt.style.color = isError ? "red" : "white"; // Use red for errors for better visibility
  txt.style.fontSize = "16px"; // Increased size for better visibility
  txt.style.width = "100%";
  txt.style.textAlign = "left"; // Center the text
  txt.textContent = text;

  // Find a suitable parent element to append the message to,
  // e.g., the body or a specific container. Assuming 'document.body' for general use.
  // Note: 'document.appendChild(txt)' is generally only for the document root.
  document.body.appendChild(txt);
}

async function clicked() {
  // Clear previous messages if necessary, although not explicitly requested,
  // it's good practice. You might need to adjust this based on your HTML structure.

  try {
    // 1. Fetch Roblox User ID
    const roblocResponse = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The original code used toString(username.textContent) which is likely incorrect.
          // It should probably be just username.textContent if it's an element,
          // or username.value if it's an input field. Assuming it's a text element.
          usernames: [username.textContent],
          excludeBannedUsers: true,
        }),
      }
    );

    if (roblocResponse.ok) {
      try {
        const data = await roblocResponse.json();
        const userId = data.data && data.data[0] ? data.data[0].id : null;

        if (!userId) {
          displayMessage(
            `Error: Could not find user ID for username: ${username.textContent}`,
            true
          );
          return; // Stop execution on specific data error
        }

        // 2. Grant access via OPL backend
        const sendres = await fetch(
          "https://oplbackend.onrender.com/admin/wl/grant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rank: 0, userid: userId }),
          }
        );

        if (sendres.ok) {
          // Success case
          displayMessage("success");
          location.reload();
        } else {
          // Failure on OPL backend grant
          const errorText = `Grant Error: ${sendres.status} - ${sendres.statusText}`;
          displayMessage(errorText, true);
        }
      } catch (error) {
        // JSON parsing error or other exceptions in the inner block
        console.error(error);
        displayMessage(
          `Internal Error (Post-Roblox Fetch): ${error.message}`,
          true
        );
      }
    } else {
      // Failure on Roblox user lookup
      const errorText = `Roblox Lookup Error: ${roblocResponse.status} - ${roblocResponse.statusText}`;
      displayMessage(errorText, true);
    }
  } catch (error) {
    // Network errors or exceptions in the outer block
    console.error(error);
    displayMessage(`Network/Initialization Error: ${error.message}`, true);
  }
}
