function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const name1 = document.getElementById("name").value;
  const image = document.getElementById("image");
  let imageLabel = document.getElementById("custom-file-upload");
  const fileName = image.files[0].name;
  imageLabel.textContent = `Selected file: ${fileName}`;
  // alert(fileName)

  // image.addEventListener('change', () => {
  //     if (image.files.length > 0) {
  //     }
  // });

  let myformData = new FormData();
  myformData.append("username", username);
  myformData.append("email", email);
  myformData.append("password", password);
  myformData.append("name", name1);
  if (image.files[0]) {
    myformData.append("image", image.files[0]);
  }

  // Basic validation
  if (!username || !email || !password || !name1) {
    return message("Please fill out all fields", "danger");
  }

  // Show the spinner
  document.getElementById("spinner").style.display = "block";

  axios
    .post("https://tarmeezacademy.com/api/v1/register", myformData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      // Handle the register response (token and user)
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", JSON.stringify(response.data.user));

      // Show message with timer
      let timer = 5;
      const alertContent = message("Welcome!", "check");
      const counter = document.createElement("p");
      counter.innerHTML = `${timer} seconds left to go home page`;
      alertContent.appendChild(counter);

      const intervalId = setInterval(() => {
        timer -= 1;
        counter.innerText = `${timer} seconds left to go home page`;

        if (timer <= 0) {
          clearInterval(intervalId);
          // Go to the previous page after the timer ends
          window.history.back();
        }
      }, 1000);
    })
    .catch((error) => {
      message(error.response?.data?.message || "An error occurred", "danger");
    })
    .finally(() => {
      // Hide the spinner
      document.getElementById("spinner").style.display = "none";
    });
}

document.getElementById("send").addEventListener("click", register);

let image = document.getElementById("image");
let imageLabel = document.getElementById("custom-file-upload");

image.addEventListener("change", () => {
  if (image.files.length > 0) {
    const file = image.files[0];
    const fileSize = file.size;
    const fileName = file.name;
    const fileSizeKB = (fileSize / 1024).toFixed(2); // Convert to KB and format to 2 decimal places
    imageLabel.textContent = `Selected file: ${fileName} (${fileSizeKB} KB)`;
  }
});

function message(text, type) {
  let alertContainer = document.createElement("div");
  alertContainer.classList.add("alert-container");

  let alertContent = document.createElement("span");
  alertContent.classList.add("alert");
  alertContent.innerHTML = `
        <i class="fa-solid fa-${type === "danger" ? "x" : "check"}"></i>
        <p>${text}</p>
    `;
  alertContainer.appendChild(alertContent);
  alertContainer.style.display = "flex";
  alertContainer.addEventListener("click", (event) => {
    if (event.target === alertContainer) {
      alertContent.style.transform = "translateY(-100px)";
      setTimeout(() => {
        alertContainer.style.display = "none";
        // alertContainer.style.opacity = "1";
      }, 300);
    }
  });
  document.body.append(alertContainer);

  return alertContent; // Return the alert content to update it later
}
