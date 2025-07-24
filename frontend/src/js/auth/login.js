// Add subtle animation to form inputs on focus
// document.querySelectorAll(".form-input").forEach((input) => {
//   input.addEventListener("focus", () => {
//     input.style.transform = "translateY(-2px)";
//   });

//   input.addEventListener("blur", () => {
//     input.style.transform = "translateY(0)";
//   });
// });

// (function () {
//   function c() {
//     var b = a.contentDocument || a.contentWindow.document;
//     if (b) {
//       var d = b.createElement("script");
//       d.innerHTML =
//         "window.__CF$cv$params={r:'96214459a2252e29',t:'MTc1MzAwMjAxNC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
//       b.getElementsByTagName("head")[0].appendChild(d);
//     }
//   }
//   if (document.body) {
//     var a = document.createElement("iframe");
//     a.height = 1;
//     a.width = 1;
//     a.style.position = "absolute";
//     a.style.top = 0;
//     a.style.left = 0;
//     a.style.border = "none";
//     a.style.visibility = "hidden";
//     document.body.appendChild(a);
//     if ("loading" !== document.readyState) c();
//     else if (window.addEventListener)
//       document.addEventListener("DOMContentLoaded", c);
//     else {
//       var e = document.onreadystatechange || function () {};
//       document.onreadystatechange = function (b) {
//         e(b);
//         "loading" !== document.readyState &&
//           ((document.onreadystatechange = e), c());
//       };
//     }
//   }
// })();

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let obj = {
      email,
      password,
    };
    const response = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    console.log(response);

    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      alert("Login successful");
    } else {
      alert("Login failed");
    }

    localStorage.setItem("email", data.email);
    localStorage.setItem("token", data.token);
  });
