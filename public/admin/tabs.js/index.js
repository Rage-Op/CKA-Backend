// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC
const toggler = document.getElementById("theme-toggle");

function checkStoredTheme() {
  let darkTheme = localStorage.getItem("darkTheme");
  if (darkTheme === "true") {
    toggler.checked = true;
    document.body.classList.add("dark");
  } else {
    toggler.checked = false;
    document.body.classList.remove("dark");
  }
}

window.addEventListener("load", () => {
  fetchData();
});

const indexDate = document.querySelector("#index-date");
const indexStudents = document.querySelector("#index-students");
const date = new Date();
const options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

const formattedDate = date.toLocaleDateString("en-US", options);
const lastTwoDigitsOfYear = formattedDate.slice(-2); // Extract last two digits of the year
const updatedFormattedDate = formattedDate.slice(0, -4) + lastTwoDigitsOfYear; // Replace last 4 digits with last two digits of the year
indexDate.innerText = updatedFormattedDate;

async function fetchData() {
  let response = await fetch("https://cka-backend.onrender.com/students");
  let data = await response.json();
  let studentCount = data.length;
  indexStudents.innerText = studentCount;
}
// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC

const sideLinks = document.querySelectorAll(
  ".sidebar .side-menu li a:not(.logout)"
);

sideLinks.forEach((item) => {
  const li = item.parentElement;
  item.addEventListener("click", () => {
    sideLinks.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

const menuBar = document.querySelector(".content nav .bx.bx-menu");
const sideBar = document.querySelector(".sidebar");

menuBar.addEventListener("click", () => {
  sideBar.classList.toggle("close");
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }
});
toggler.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkTheme", true);
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkTheme", false);
  }
});
checkStoredTheme();
