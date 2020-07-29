const sidenav = document.getElementsByClassName("sidenav")[0];
const hamburger = document.querySelector("nav img");
const closeItem = document.getElementById("close");
const body = document.querySelector("body");

const closeNav = () => {
    sidenav.style.left = `-${sidenav.offsetWidth}px`;
    body.style.overflow = "auto";
}

hamburger.addEventListener('click', () => {
    sidenav.style.left = `0`;
    body.style.overflow = "hidden";
})

closeItem.addEventListener('click', () => {
    closeNav();
})