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

CKEDITOR.replace('modalContent')

addPosts.addEventListener("click", function(){
  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
})

addPostModal.addEventListener("submit", function(e){
  e.preventDefault()
  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
  const inputs = document.getElementsByClassName("input") 
  for (let input of inputs) {
    input.value = ""
  }
  CKEDITOR.instances.modalContent.setData('')
})

addPostModal.addEventListener("reset", function(){
  addPostModal.classList.toggle("hidden")
  addPosts.classList.toggle("hidden")
})

hamburgerMenu.addEventListener("click", function(){
  navLinks.classList.toggle("hidden")
})