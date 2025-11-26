const username = document.getElementById("username-text");
const register_btn = document.getElementById("login-btn");

async function clicked() {
  try {
    const response = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernames: [toString(username.textContent)],
          excludeBannedUsers: true,
        }),
      }
    );

    if (response.ok) {
      try {
        const data = await response.json();
        const sendres = await fetch(
          "https://oplbackend.onrender.com/admin/wl/grant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rank: 0, userid: data.data[0].id }),
          }
        );

        if (sendres.ok) {
          location.reload();
        } else {
          const txt = document.createElement("p");
          txt.style.fontFamily = "Courier New";
          txt.style.color = "white";
          txt.style.fontSize = "6px";
          txt.style.width = "100%";
          txt.style.height = "8px";
          txt.textContent = sendres.statusText;
          document.appendChild(txt);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const txt = document.createElement("p");
      txt.style.fontFamily = "Courier New";
      txt.style.color = "white";
      txt.style.fontSize = "6px";
      txt.style.width = "100%";
      txt.style.height = "8px";
      txt.textContent = response.statusText;
      document.appendChild(txt);
    }
  } catch (error) {
    console.error(error);
  }
}
