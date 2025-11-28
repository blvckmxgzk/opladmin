const loggedIn = localStorage.getItem("logged-in") || false;

if (loggedIn !== null && loggedIn === true) {
  location.href = "/home";
} else {
  location.href = "/login";
}
