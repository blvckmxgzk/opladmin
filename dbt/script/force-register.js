const username = document.getElementById("username-input");
const register_btn = document.getElementById("login-btn");

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
  const res_user = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    body: JSON.stringify({
      usernames: [username.value],
      excludeBannedUsers: true,
    }),
    mode: "no-cors",
  });
  
  res_user.then(async (roblocResponse) => {
    if (!roblocResponse.status >= 200 && !roblocResponse.status <= 299) {
      console.log(roblocResponse.ok);
      throw new Error(
        `Roblox Lookup Error: ${roblocResponse.status} - ${roblocResponse.statusText}`
      );
    }

    const roblocData = await roblocResponse.json();

    roblocData.then((data) => {
      const userId =
        data.data && data.data.data[0] ? data.data.data[0].id : null;

      if (!userId) {
        throw new Error(
          `Error: Could not find user ID for username: ${username.value}`
        );
      }

      const response = fetch("https://oplbackend.onrender.com/admin/wl/grant", {
        method: "POST",
        body: JSON.stringify({ rank: 0, userid: userId }),
      });

      response
        .then((sendres) => {
          if (sendres.ok) {
            displayMessage("success");
            username.value = "";
          } else {
            throw new Error(
              `Grant Error: ${sendres.status} - ${sendres.statusText}`
            );
          }
        })
        .catch((error) => {
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
        });
    });
  });
}
