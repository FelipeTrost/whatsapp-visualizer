const sidenav = document.getElementsByClassName("sidenav")[0];
const hamburger = document.querySelector("nav img");
const closeItem = document.getElementById("close");

hamburger.addEventListener('click', () => {
    sidenav.style.display = "flex";
})

closeItem.addEventListener('click', () => {
    sidenav.style.display = "none";
})