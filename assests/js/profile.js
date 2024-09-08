let query = new URLSearchParams(window.location.search);
let userid = query.get("userid");
console.log(userid);
function showUserInfo(userid) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${userid}`)
    .then((response) => {
      //   console.log(response.data);
      document.getElementById("head-name").innerHTML = response.data.data.name;
      document.getElementById("user-name").innerHTML = response.data.data.name;
      document.getElementById("user-username").innerHTML =
        response.data.data.username;
      console.log(response.data.data.profile_image);
      if (!(typeof response.data.data.profile_image === "object")) {
        document.getElementById("user-image").src =
          response.data.data.profile_image;
      }
      document.getElementById("user-email").innerHTML =
        response.data.data.email;
      document.getElementById("n-posts").innerHTML =
        response.data.data.posts_count;
      document.getElementById("n-comments").innerHTML =
        response.data.data.comments_count;
    });
}
showUserInfo(userid);
document.getElementById;

function getPosts() {
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${userid}/posts`)
    .then((response) => {
      console.log(response);

      const myData = response.data;
      for (let post of myData.data) {
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
          false,
          true
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

getPosts();
