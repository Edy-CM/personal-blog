import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://myvlog-f078f-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const postsTbl = ref(database, "Tbl_posts")

const postsEl = document.getElementById("posts")
const hamburgerMenu = document.getElementById("hamburger")
const navLinks = document.getElementById("nav-links")

onValue(postsTbl, function(snapshots){
  if (!snapshots.exists()) {
    postsEl.innerHTML = "<p>There are no posts...</p>"
  }

  clearPostsEl()

  const postsArray = Object.entries(snapshots.val())
  const lastPosts = postsArray.slice(-3)
  lastPosts.reverse().forEach(post => {
    renderPost(post)
  })
})

function clearPostsEl() {
  postsEl.innerHTML = ""
}

function renderPost(post, attribute=false) {
  const postId = post[0];
  const postContent = post[1];

  const { title, html, description, date } = postContent;
  const firstImage = new DOMParser().parseFromString(html, "text/html").querySelector("img");
  const coverImage = firstImage
    ? firstImage
    : createDefaultImage(); // Create a default image element if no image is found

    if (coverImage.attributes.style) {
      coverImage.removeAttribute("style")
      coverImage.classList.add("banner")
    }

  let newPost = document.createElement("div");
  newPost.classList.add("post")
  if (attribute) newPost.classList.add("extra-post", "hidden")
  newPost.innerHTML = `
    <p class="post-image-container"></p>
    <p class="post-date">${date}</p>
    <h1 class="post-title"><a href="article.html?id=${postId}">${title}</a></h1>
    <p class="post-description">${description}</p>
  `
  newPost.querySelector("p").appendChild(coverImage);
  postsEl.appendChild(newPost);
}

hamburgerMenu.addEventListener("click", function(){
  navLinks.classList.toggle("hidden")
})

// Crea una imagen default para las portadas del post.
function createDefaultImage() {
  const defaultImage = document.createElement("img");
  defaultImage.src = "https://i.pinimg.com/564x/51/f0/7a/51f07a9274c577f6df844fe1f579fe0c.jpg";
  defaultImage.alt = "A hello world cover";
  defaultImage.classList.add("post-image")
  return defaultImage;
}

let copyYear = new Date().getFullYear()
document.getElementById("copy").textContent = `Copyright @ ${copyYear}`