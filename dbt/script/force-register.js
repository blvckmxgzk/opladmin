const username = document.getElementById("username-input");
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
  // Clear previous messages is a good practice, but omitted for simplicity
  // and direct adherence to the Promise chain refactoring request.

  // 1. Fetch Roblox User ID
  await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    body: JSON.stringify({
      usernames: [username.value],
      excludeBannedUsers: true,
    }),
    mode: "no-cors",
  })
    // .then 1: Check Roblox response status and parse JSON
    .then(async (roblocResponse) => {
      if (!roblocResponse.status >= 200 && !roblocResponse.status <= 299) {
        console.log(roblocResponse.ok);
        // Throw an error to be caught by the .catch() block
        throw new Error(
          `Roblox Lookup Error: ${roblocResponse.status} - ${roblocResponse.statusText}`
        );
      }
      
      return await roblocResponse.json(); // Return the promise for JSON parsing
    })

    // .then 2: Extract User ID and Grant access
    .then((data) => {
      const userId =
        data.data && data.data.data[0] ? data.data.data[0].id : null;

      if (!userId) {
        // Throw an error to be caught by the .catch() block
        throw new Error(
          `Error: Could not find user ID for username: ${username.value}`
        );
      }

      // 2. Grant access via OPL backend
      return fetch("https://oplbackend.onrender.com/admin/wl/grant", {
        method: "POST",
        body: JSON.stringify({ rank: 0, userid: userId }),
      });
    })

    // .then 3: Check Grant response status (Success case)
    .then((sendres) => {
      if (sendres.ok) {
        // Success case
        displayMessage("success");
        username.value = "";
      } else {
        // Failure on OPL backend grant - Throw an error
        throw new Error(
          `Grant Error: ${sendres.status} - ${sendres.statusText}`
        );
      }
    })

    // .catch: Handle all errors from the entire chain (Network, Status not OK, Data/ID not found)
    .catch((error) => {
      console.error(error); // Log the full error object

      // Determine the user-friendly message based on the error
      let errorMessage = `An unknown error occurred: ${error.message}`;

      if (error.message.startsWith("Roblox Lookup Error")) {
        errorMessage = error.message;
      } else if (error.message.startsWith("Error: Could not find user ID")) {
        errorMessage = error.message;
      } else if (error.message.startsWith("Grant Error")) {
        errorMessage = error.message;
      } else if (error instanceof TypeError) {
        // Handle network errors (e.g., failed to fetch)
        errorMessage = `Network/Initialization Error: ${error.message}`;
      } else if (error instanceof SyntaxError) {
        // Handle JSON parsing errors
        errorMessage = `Internal Error (JSON Parse): ${error.message}`;
      }

      displayMessage(errorMessage, true);
    });

  // .finally is not strictly required but can be added here if cleanup is needed
  // .finally(() => {
  //    // Code to run regardless of success or failure
  // });
}
