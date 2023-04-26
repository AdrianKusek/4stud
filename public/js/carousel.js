const carousel = document.querySelectorAll(".carousel-img");
const carouselNext = document.querySelector(".carousel-next");
const carouselPrevious = document.querySelector(".carousel-previous");

currentItem = carousel.length - carousel.length;

carousel.forEach((e, i) => {
  if (i !== currentItem) {
    e.classList.toggle("hide");
  }
});

carouselNext.addEventListener("click", () => {
  carousel[currentItem].classList.toggle("hide");
  if (currentItem === carousel.length - 1) {
    currentItem = 0;
  } else {
    currentItem++;
  }

  carousel[currentItem].classList.toggle("hide");
});
carouselPrevious.addEventListener("click", () => {
  carousel[currentItem].classList.toggle("hide");
  if (currentItem === 0) {
    currentItem = carousel.length - 1;
  } else {
    currentItem--;
  }

  carousel[currentItem].classList.toggle("hide");
});
