import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://myvlog-f078f-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const postsTbl = ref(database, "Tbl_posts")

const addPosts = document.getElementById("add-post")
const addPostModal = document.getElementById("add-post-modal")
const hamburgerMenu = document.getElementById("hamburger")
const navLinks = document.getElementById("nav-links")
const postTitle = document.querySelector("input[name='title']")
const postDescription = document.getElementById('modal-description')
const counter  = document.getElementById("counter")
const postsEl = document.getElementById("posts")
let morePosts = false

// Reemplaza el text area de "modalContent" por el editor de texto de CKEditor.
CKEDITOR.replace('modalContent',
  {
    contentCss: "../css/index.css",
    on: {
      instanceReady: function (ev) {
        ev.editor.dataProcessor.htmlFilter.addRules({
          elements: {
            img: function (element) {
              // Add your class to the image tag
              element.attributes.class = 'post-image';
            }
          }
        });
      }
    }
  })

// Al hacer click en el boton, se oculta a si mismo y muestra el formulario.
addPosts.addEventListener("click", function(){
  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
})

// Al subir el formulario, se oculta y muestra nuevamente el boton, 
// resetea los inputs y guarda la información en una base de datos.
addPostModal.addEventListener("submit", function(e){
  e.preventDefault()
  var today = new Date();

  // Get the current date components
  var year = today.getFullYear();
  var month = today.getMonth() + 1; // Months are zero-indexed, so we add 1
  var day = today.getDate();

  if (CKEDITOR.instances.modalContent.getData() === "") {
    alert("CKEditor content is required!")
    return
  }

  const postInfo = {
    title: postTitle.value,
    description: postDescription.value,
    html: CKEDITOR.instances.modalContent.getData(),
    date: `${day}/${month}/${year}`
  }

  push(postsTbl, postInfo)

  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
  const inputs = document.getElementsByClassName("input") 
  for (let input of inputs) {
    input.value = ""
  }
  CKEDITOR.instances.modalContent.setData('')
})

// Resetea todos los inputs del formulario.
addPostModal.addEventListener("reset", function(){
  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
  CKEDITOR.instances.modalContent.setData("")
})

// En dispositivos mobiles, al hacer click en el boton,
// muestra un menú hamburguer.
hamburgerMenu.addEventListener("click", function(){
  navLinks.classList.toggle("hidden")
})

// Cuenta los caracteres restantes para la descripción del post
postDescription.addEventListener("input", function(){
  let characters = this.value.length
  let remaining = 250 - characters
  counter.textContent = `${remaining}/250`
})

// Muestra todos los posts en la base de datos.
onValue(postsTbl, function(snapshots){
  if (!snapshots.exists()) {
    postsEl.innerHTML = "<p>There are no posts yet.</p>"
    return
  }

  clearPostsEl()
  const postArray = Object.entries(snapshots.val())
  postArray.reverse().forEach( (post, index) => {
    if (index + 1 > 6) {
      renderPost(post, true)
      return
    }
    renderPost(post)
  })

  const showMore = document.createElement("button")
  showMore.classList.add("show-more")
  
  showMore.textContent = "Show more"

  postsEl.appendChild(showMore)

  if (postArray.length > 6) {
    showMore.classList.remove("hidden")
  } else {
    showMore.classList.add("hidden")
  }

  showMore.classList.contains
  showMore.addEventListener("click", function(){
    morePosts = !morePosts

    const showMoreContent = !morePosts ? "Show more" : "Show less"
    showMore.textContent = showMoreContent

    const pos = document.getElementsByClassName("post")
    for (let postEl of pos ) {
      if (postEl.classList.contains("extra-post")) {
        postEl.classList.toggle("hidden")
      }
    }
  })
})

// Limpia el contenedor de los posts.
function clearPostsEl() {
  postsEl.innerHTML = ""
}

// Muestra el post
function renderPost(post, attribute=false) {
  const postId = post[0];
  const postContent = post[1];

  const { title, html, description, date } = postContent;
  const firstImage = new DOMParser().parseFromString(html, "text/html").querySelector("img");
  const coverImage = firstImage
    ? firstImage
    : createDefaultImage(); // Create a default image element if no image is found

    if (coverImage.hasAttribute("style")) {
      coverImage.removeAttribute("style")
    }

  let newPost = document.createElement("div");
  newPost.classList.add("post")
  if (attribute) newPost.classList.add("extra-post", "hidden")
  newPost.innerHTML = `
    <p class="post-image-container"></p>
    <p class="post-date">${date}</p>
    <h1 class="post-title"><a href="article.html">${title}</a></h1>
    <p class="post-description">${description}</p>
  `;

  // Append the actual image element to the newPost container
  const removeBtn = document.createElement("button")
  removeBtn.classList.add("remove-btn")
  removeBtn.setAttribute(`data-post-id`, postId)
  removeBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>'
  newPost.appendChild(removeBtn)

  removeBtn.addEventListener("click", function(){
    const location = ref(database, `Tbl_posts/${postId}`)
    remove(location)
  })

  newPost.querySelector("p").appendChild(coverImage);
  postsEl.appendChild(newPost);
}

// Crea una imagen default para las portadas del post.
function createDefaultImage() {
  const defaultImage = document.createElement("img");
  defaultImage.src = "https://i.pinimg.com/564x/51/f0/7a/51f07a9274c577f6df844fe1f579fe0c.jpg";
  defaultImage.alt = "A hello world cover";
  defaultImage.classList.add("post-image")
  return defaultImage;
}