const username = document.getElementById("username-text");
const register_btn = document.getElementById("login-btn");

async function clicked() {
  try {
    const response = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          usernames: [username.textContent],
          excludeBannedUsers: true,
        }),
      }
    );

    if (response.ok) {
      try {
        const data = await response.json()
        const sendres = await fetch(
          "https://oplbackend.onrender.com/admin/wl/grant",
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ rank: 0, userid: data.data[0].id }),
          }
        );

        if (sendres.ok) location.reload()
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
