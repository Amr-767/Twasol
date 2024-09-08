// variables

let currentPage = 1;
let lastPage = 1;

function createPost(
  id,
  profile_image,
  username,
  image,
  time,
  title,
  body,
  comments,
  tags,
  userid = "",
  remove = false
) {
  let card = document.createElement("div");
  card.classList.add("card", `post-${id}`);
  card.innerHTML = `
    
      <div class="card-header test" style="gap: 20px">
        <div id="user-post-info">
          <img
              class="rounded-circle"
              style="width: 40px; height: 40px"
              src="${profile_image}"
              alt=""
          />
          <h6>${username}</h6>
        </div>
        
      </div>
      <div class="card-body">
          <img
              decoding="async"
              src="${image}"
              class="w-100"
              alt=""
          />
          <p>${time}</p>
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
              ${body}
          </p>
          <hr>
          <div class="cardfooter" id="cardfooter">
            <div class="comment-icons" id="comment-icons">
              <i class="fa-solid fa-pen"></i>
              <span>(${comments}) comments</span> 
              <i class="fa-solid fa-arrow-down down-arrow"></i>
            </div>
            <div class="tags ${
              tags.length !== 0 ? "domargin" : ""
            }" style="display:inline;">
                ${tags.map((tag) => `<p class="tag">${tag.name}</p>`).join("")}
            </div>
          </div>
      </div>  
      
  `;
  let commentContainer = document.createElement("div");
  commentContainer.classList.add("comments-container");
  commentContainer.id = "comments-container";
  let CraetecommentContainer = document.createElement("div");
  CraetecommentContainer.classList.add("create-comment-container");

  CraetecommentContainer.innerHTML = `
  <div class="makecomment">
    <input type="text" placeholder="Type your Comment !" id= "commentText">
    <button class="btn btn-outline-success" id="createCommentBtn">Send</button>
  </div>
  `;
  if (localStorage.getItem("username")) {
    if (JSON.parse(localStorage.getItem("username")).id === userid) {
      let userPostControls = `
      <div> 
        <button id="editbtn" class="btn btn-dark">Edit</button> 
        <button id="deletebtn" class="btn btn-danger">Delete</button>
      </div>`;
      card.querySelector(".card-header").innerHTML += userPostControls;
      card.querySelector("#editbtn").addEventListener("click", () => {
        editbtnclicked(title, body, id);
      });
      card.querySelector("#deletebtn").addEventListener("click", () => {
        deletePost(id);
      });
    }
  }
  card.querySelector("#user-post-info").addEventListener("click", () => {
    window.location.href = `profile.html?userid=${userid}`;
  });
  card.append(CraetecommentContainer);
  card.append(commentContainer);
  document.querySelector("#post-c").append(card);

  document.querySelector(".comment-icons").addEventListener("click", () => {
    document.querySelector("#comments-container").classList.toggle("on");
  });
  document.getElementById("createCommentBtn").addEventListener("click", () => {
    createComment(id);
  });
  card.addEventListener("click", handlePostClick);
  if (remove) {
    card.removeEventListener("click", handlePostClick);
    card.querySelector(".card-body").style.cursor = "initial";
    document.getElementById("add-post").style.display = "none";
    document.getElementById("return").style.display = "flex";
  }
}

function handlePostClick(event) {
  if (event.target.closest(".card-body")) {
    let mainPost = event.currentTarget;
    let postId = mainPost.classList[1].split("-")[1];
    showpost(postId);
  }
  // return postId;
}

function editbtnclicked(title, body, id) {
  console.log(id);
  document.getElementById("title-post-modal").innerHTML = "Edit Post";
  document.getElementById("title").value = title;
  document.getElementById("body").value = body;
  document.getElementById("create-post").innerHTML = "Edit";
  document.getElementById("isEdit").value = id;
  let postmodal = new bootstrap.Modal(document.getElementById("post-modal"));
  postmodal.toggle();
}

function createbtnclicked() {
  console.log("heloo");
  document.getElementById("title-post-modal").innerHTML = "Create Post";
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
  document.getElementById("isEdit").value = "";
  document.getElementById("create-post").innerHTML = "Create";
}

function deletePost(id) {
  let sure = confirm("Are you Sure\nDo you Want to Delete The Post ? ");
  if (sure) {
    axios
      .delete(
        `https://tarmeezacademy.com/api/v1/posts/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        message("The Post has already deleted successfully !", "x");
        getPosts(1, true, false);
      })
      .catch((error) => {
        message(error.response.data.message, "danger");
      });
  }
}

function showpost(id) {
  window.removeEventListener("scroll", pagination);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
      console.log("a7a");
      document.getElementById("post-c").innerHTML = "";
      let post = response.data.data;
      let username = post.author.username;
      let profile_image = post.author.profile_image;
      if (typeof profile_image === "object") {
        profile_image = "../assests/images/user.png";
      }
      let id = post.id;
      let title = post.title || "";
      let body = post.body;
      let comments = post.comments_count;
      let time = post.created_at;
      let image = post.image;
      let tags = post.tags || []; // Default to an empty array if tags are undefined
      let userscomments = post.comments;
      let userid = post.author.id;
      createPost(
        id,
        profile_image,
        username,
        image,
        time,
        title,
        body,
        comments,
        tags,
        userid,
        true
      );
      if (localStorage.getItem("token")) {
        document.querySelector(".create-comment-container").style.display =
          "flex";
      }
      document.querySelector(".down-arrow").style.display = "block";

      if (userscomments.length !== 0) {
        for (let comment of userscomments) {
          let commentImage = comment.author.profile_image;
          if (typeof commentImage === "object") {
            commentImage = "../assests/images/user.png";
          }
          let commentUsername = comment.author.username;
          let commentBody = comment.body;
          document.getElementById("comments-container").innerHTML += `
          <div class = "comment">
            <div class="head">
              <img src="${commentImage}" alt="">
              <span>${commentUsername}</span>
            </div>
            <hr>
            <div class="body">
              <p>${commentBody}</p>
            </div>
          </div>
        `;
        }
      }
    })
    .catch((error) => {
      let timer = 10;
      const alertContent = message(
        "sorry ! an error occured while showing the post if the problem still appears please contact us to help you ",
        "danger"
      );
      const counter = document.createElement("p");
      counter.innerHTML = `${timer} seconds left to reload the page`;
      alertContent.appendChild(counter);

      const intervalId = setInterval(() => {
        timer -= 1;
        counter.innerText = `${timer} seconds left to reload the page`;

        if (timer <= 0) {
          clearInterval(intervalId);
          // Go to the previous page after the timer ends
          window.location.reload();
        }
      }, 1000);

      throw new Error(error);
    });
}

function createComment(id) {
  let commentText = document.getElementById("commentText").value;
  console.log(commentText);
  if (!commentText.trim()) {
    message("Sorry ! you can't type an empty comment", "danger");
    return;
  }
  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
      {
        body: commentText,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then(() => {
      showpost(id);
      message("you added a comment", "x");
    })
    .catch((error) => {
      message(`${error?.response?.data?.message || error}`, "danger");
    });
}

function createLogout() {
  document.querySelector("#close").click();
  document.querySelector("#login").style.display = "none";
  document.querySelector("#register").style.display = "none";
  let logout = document.createElement("button");
  logout.innerHTML = "Logout";
  logout.id = "logout";
  logout.classList.add("btn", "btn-outline-danger");
  if (localStorage.getItem("username")) {
    let info = document.createElement("span");
    info.classList.add("info");
    info.addEventListener("click", () => {
      location.href = `profile.html?userid=${
        JSON.parse(localStorage.getItem("username")).id
      }`;
    });
    let user = JSON.parse(localStorage.getItem("username"));
    let username = user.username;
    let profile_image = user.profile_image;
    if (typeof profile_image === "object") {
      profile_image = "../assests/images/user.png";
    }

    info.innerHTML = `
       <img
            decoding="async"
              src="${profile_image}"
              
              alt=""
            />
      <p> ${username} </p>
    `;
    document.querySelector("#btns-container").append(info);
  }

  document.querySelector("#btns-container").append(logout);
  document.getElementById("logout").addEventListener("click", () => {
    createLogin();
    if (document.querySelector(".create-comment-container")) {
      document.querySelector(".create-comment-container").style.display =
        "none";
    }
  });
  document.getElementById("add-post").style.display = "flex";
}
// console.log(JSON.parse(localStorage.getItem("username")).id);
function createLogin() {
  localStorage.clear();
  document.querySelector("#login").style.display = "block";
  document.querySelector("#register").style.display = "block";
  if (document.getElementById("logout")) {
    document.getElementById("logout").remove();
    document.querySelector(".info").remove();
    document.getElementById("add-post").style.display = "none";
    message("logged Out successfully! ", "check");
    // window.location.reload();
  }
}

// end of the page

function pagination() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  console.log(scrollTop, windowHeight, documentHeight);
  // Check if the user has scrolled to the bottom
  if (scrollTop + windowHeight >= documentHeight && currentPage <= lastPage) {
    console.log("reached");
    currentPage++;
    getPosts(currentPage, false, false);
  } else if (currentPage > lastPage) {
    currentPage = 1;
    getPosts(currentPage, false, false);
  }
}

window.addEventListener("scroll", pagination);

function getPosts(page = 1, doDelete = true, doSpinner = true) {
  if (doSpinner) {
    document.getElementById("spinner-container").style.display = "flex";
  }
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=50&page=${page}`)
    .then((response) => {
      if (doDelete) {
        document.getElementById("post-c").innerHTML = "";
      }
      const myData = response.data;
      for (let post of myData.data) {
        let username = post.author.username;
        let profile_image = post.author.profile_image;
        if (typeof profile_image === "object") {
          profile_image = "../assests/images/user.png";
        }
        lastPage = myData.meta.last_page;
        let id = post.id;
        let title = post.title || "";
        let body = post.body;
        let comments = post.comments_count;
        let time = post.created_at;
        let image = post.image;
        let tags = post.tags || []; // Default to an empty array if tags are undefined
        let userid = post.author.id;
        createPost(
          id,
          profile_image,
          username,
          image,
          time,
          title,
          body,
          comments,
          tags,
          userid
        );
        if (tags.length !== 0) {
          document.querySelector(".tags").classList.add("domarginL");
        }
      }
    })
    .catch((error) => {
      message(error.response?.data?.message || "An error occurred", "danger");
      throw new Error(error);
    })
    .finally(() => {
      document.getElementById("spinner-container").style.display = "none";
    });
}

function newPost() {
  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  let image = document.getElementById("image");
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image.files[0]) {
    formData.append("image", image.files[0]);
  }
  document.getElementById("close-post-modal").click();
  document.getElementById("spinner-container").style.display = "flex";
  console.log("isEdit value : " + document.getElementById("isEdit").value);
  if (document.getElementById("isEdit").value === "") {
    console.log("create post");
    axios
      .post("https://tarmeezacademy.com/api/v1/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        getPosts();
      })
      .catch((error) => {
        document.getElementById("close-post-modal").click();
        message(error.response.data.message, "danger");
      })
      .finally(() => {
        document.getElementById("spinner-container").style.display = "none";
      });
  } else {
    console.log("edit post");

    let id = document.getElementById("isEdit").value;
    formData.append("_method", "put");
    axios
      .post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        getPosts();
      })
      .catch((error) => {
        document.getElementById("close-post-modal").click();
        message(error?.response?.data?.message || error, "danger");
        throw new Error(error);
      })
      .finally(() => {
        document.getElementById("spinner-container").style.display = "none";
      });
  }
}
function login() {
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: document.querySelector("#username").value,
      password: document.querySelector("#pass").value,
    })
    .then((response) => {
      let user = response.data.user;
      let token = response.data.token;
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("username", JSON.stringify(user));
      createLogout();
      if (document.getElementById("post-c").children.length === 1) {
        document.querySelector(".create-comment-container").style.display =
          "flex";
      }
      message("logged in successfully !", "check");
    })
    .catch((error) => {
      document.querySelector("#close").click();
      message(error.response?.data?.message || "An error occurred", "danger");
    });
}
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

document.getElementById("post-btn").addEventListener("click", createbtnclicked);
document.getElementById("create-post").addEventListener("click", newPost);
document.getElementById("loginbtn").addEventListener("click", () => {
  login();
});
document.getElementById("register").addEventListener("click", () => {
  location.href = "register.html";
  // window.open("register.html", "_blank");
});

document.getElementById("return").addEventListener("click", () => {
  window.location.reload();
});
document.getElementById("profile-link").addEventListener("click", () => {
  if (localStorage.getItem("username")) {
    window.location.href = `profile.html?userid=${
      JSON.parse(localStorage.getItem("username")).id
    }`;
  } else {
    message("You Don't have a profile ! Please login .", "danger");
  }
});

window.onload = function () {
  if (localStorage.getItem("token")) {
    createLogout();
  } else {
    createLogin();
  }
  getPosts();
};
