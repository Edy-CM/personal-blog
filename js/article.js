const hamburgerMenu = document.getElementById("hamburger")
const navLinks = document.getElementById("nav-links")

hamburgerMenu.addEventListener("click", function(){
  navLinks.classList.toggle("hidden")
})