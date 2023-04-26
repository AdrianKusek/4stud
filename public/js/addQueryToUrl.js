let searchUrl = window.location.search;
var searchParams = new URLSearchParams(searchUrl);
let aaa = Array.from(searchParams);
let inputs = document.querySelectorAll("input");

aaa.forEach((e) => {
  inputs.forEach((i) => {
    if (i.name === e[0] && i.value === e[1]) {
     
      i.checked = true;
    }
  });
});
let arr = Array.from(searchParams);

searchParams.delete("gender");
searchParams.delete("breed");
searchParams.delete("age");
searchParams.delete("city");
searchParams.delete("radius");

let cityEl = document.querySelector(".city");

cityEl.addEventListener("click", () => {
  event.preventDefault();
  arr = arr.filter((e) => e[0] !== "radius");
});

function isInArray(arr, el) {
  let bool = false;

  for (let a of arr) {
    if (a[1] === el.value) {
      bool = true;
      return bool;
    }
  }
}
function isCity(el, arr) {
  let bool = false;
  for (let a of arr) {
    if (a[0] === "city") {
      bool = true;
      return bool;
    }
  }
}

function updateQuery(el, arr) {
  if (el.name !== "radius") {
    if (isInArray(arr, el)) {
      arr = arr.filter((e) => {
        return e[1] !== el.value;
      });
    } else {
      arr.push([el.name, el.value]);
    }

    if (isCity(el, arr)) {
      arr = arr.filter((e) => {
        return e[0] !== "city";
      });

      arr.push(["city", cityEl.firstChild.value]);
    }
  } else {
    let radiusArray = arr.filter((e) => e[0] === "radius");
    let clickedArray = [[el.name, el.value]];

    if (!radiusArray.length) {
      arr.push([el.name, el.value]);
    } else if (radiusArray[0][1] === clickedArray[0][1]) {
      arr = arr.filter((e) => e[0] !== "radius");
    } else {
      arr = arr.filter((e) => e[0] !== "radius");
      arr.push([el.name, el.value]);
    }
  }

  for (let el of arr) {
    searchParams.append(el[0], el[1]);
  }
  window.location.search = searchParams;
}

let links = document.querySelectorAll(".link");

links.forEach((el) => {
  el.addEventListener("click", () => {
    event.preventDefault();
    updateQuery(el.firstChild, arr);
  });
});
