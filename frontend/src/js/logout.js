(document.getElementById("logout-2") || document.getElementById("logout")).addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userUsername");
  localStorage.removeItem("userData");
  localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");

    window.location.href = "login.html";
  });
