const authenticate = fetch(
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

const response = authenticate.json()

if (response.success) {
  location.href = "/home";
} else {
  location.href = "/login";
}
