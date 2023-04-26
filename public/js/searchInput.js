const search = document.querySelector("#search");
const data = document.querySelectorAll(".breed-input");

function initializeInput() {
  //Displaying only first 10 inputs
  for (let i = 0; i < data.length - 10; i++) {
    data[i + 10].classList.toggle("hide");
  }
}

search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  for (let i of data) {
    const isVisable = i.firstChild.value.toLowerCase().includes(value);

    i.classList.toggle("hide", !isVisable);
  }
  if (value === "") {
    initializeInput();
  }
});
initializeInput();

data.forEach((e) => {
  e.addEventListener("click", () => {
    data.forEach((el) => {
      if (el.firstChild.value !== e.firstChild.value) {
        el.classList.add("hide");
      }
    });
  });
});
