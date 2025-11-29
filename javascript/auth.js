const authenticate = await fetch(
  "https://oplbackend.vercel.app/admin/authenticate",
  {
    method: "POST",
    body: JSON.stringify({
      deviceId: localStorage.getItem("deviceId")
        ? localStorage.getItem("deviceId")
        : "",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  },
);

if (authenticate.success === true) {
  location.href = "/home";
} else {
  location.href = "/login";
}
