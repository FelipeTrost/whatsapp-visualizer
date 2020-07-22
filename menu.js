const sidenav = document.getElementsByClassName("sidenav")[0];
const hamburger = document.querySelector("nav img");
const closeItem = document.getElementById("close");

const closeNav = () => sidenav.style.display = "none";

hamburger.addEventListener('click', () => {
    sidenav.style.display = "flex";
})

closeItem.addEventListener('click', () => {
    closeNav();
})