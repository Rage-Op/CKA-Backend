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
//
window.addEventListener("load", () => {
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }
});
//
let notice = document.querySelector("#sucess-dialog");
let settingsPG = document.querySelector("#settings-PG");
let settingsKG = document.querySelector("#settings-KG");
let settingsNursery = document.querySelector("#settings-nursery");
let settingsClass1 = document.querySelector("#settings-class1");
let settingsClass2 = document.querySelector("#settings-class2");
let settingsClass3 = document.querySelector("#settings-class3");
let settingsClass4 = document.querySelector("#settings-class4");
let settingsClass5 = document.querySelector("#settings-class5");
let settingsClass6 = document.querySelector("#settings-class6");
let settingsTransport = document.querySelector("#settings-transport");
let settingsDiet = document.querySelector("#settings-diet");
let settingsExam = document.querySelector("#settings-exam");
let saveButton = document.querySelector("#admit-button");
let cancelButton = document.querySelector("#cancel-button");

cancelButton.addEventListener("click", async (event) => {
  event.preventDefault();
  let URL = "https://cka-backend.onrender.com/settings";

  try {
    let response = await fetch(`${URL}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    settingsPG.value = data.name;
    settingsKG.value = data.DOB;
    settingsNursery.value = data.fatherName;
    settingsClass1.value = data.motherName;
    settingsClass2.value = data.contact;
    settingsClass3.value = data.address;
    settingsClass4.value = data.studentId;
    settingsClass5.value = data.admitDate;
    settingsClass6.value = data.transport;
    settingsTransport.value = data.diet;
    settingsDiet.value = data.class;
    settingsExam.value = data.class;
  } catch (error) {
    console.log(error);
    settingsPG.value = "!";
    settingsKG.value = "!";
    settingsNursery.value = "!";
    settingsClass1.value = "!";
    settingsClass2.value = "!";
    settingsClass3.value = "!";
    settingsClass4.value = "!";
    settingsClass5.value = "!";
    settingsClass6.value = "!";
    settingsTransport.value = "!";
    settingsDiet.value = "!";
    settingsExam.value = "!";
  }
});
// On page load function called
fetchSettings();

async function fetchSettings() {
  let URL = "https://cka-backend.onrender.com/settings";

  try {
    let response = await fetch(`${URL}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    settingsPG.value = data[0].monthlyPG;
    settingsKG.value = data[0].monthlyKG;
    settingsNursery.value = data[0].monthlyNursery;
    settingsClass1.value = data[0].monthly1;
    settingsClass2.value = data[0].monthly2;
    settingsClass3.value = data[0].monthly3;
    settingsClass4.value = data[0].monthly4;
    settingsClass5.value = data[0].monthly5;
    settingsClass6.value = data[0].monthly6;
    settingsTransport.value = data[0].transport;
    settingsDiet.value = data[0].diet;
    settingsExam.value = data[0].exam;
    saveButton.addEventListener("click", saveEventHandler);
  } catch (error) {
    console.log(error);
    settingsPG.value = "!";
    settingsKG.value = "!";
    settingsNursery.value = "!";
    settingsClass1.value = "!";
    settingsClass2.value = "!";
    settingsClass3.value = "!";
    settingsClass4.value = "!";
    settingsClass5.value = "!";
    settingsClass6.value = "!";
    settingsTransport.value = "!";
    settingsDiet.value = "!";
    settingsExam.value = "!";
  }
}

async function saveEventHandler(event) {
  event.preventDefault();
  saveButton.removeEventListener("click", saveEventHandler);
  let data = {
    monthlyPG: Number(settingsPG.value),
    monthlyKG: Number(settingsKG.value),
    monthlyNursery: Number(settingsNursery.value),
    monthly1: Number(settingsClass1.value),
    monthly2: Number(settingsClass2.value),
    monthly3: Number(settingsClass3.value),
    monthly4: Number(settingsClass4.value),
    monthly5: Number(settingsClass5.value),
    monthly6: Number(settingsClass6.value),
    transport: Number(settingsTransport.value),
    exam: Number(settingsExam.value),
    diet: Number(settingsDiet.value),
  };
  const patchURL = `https://cka-backend.onrender.com/settings`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  await fetch(patchURL, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      notice.style.opacity = "100";
      setTimeout(() => {
        notice.style.opacity = "0";
      }, 2000);
    })
    .catch((error) => {
      console.error("There was a problem with the delete operation:", error);
      notice.innerHTML = "<h4>Failed!</h4><p>Update failed</p>";
      notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
      notice.style.border = "1px solid #D32F2F";
      notice.style.opacity = "100";
      setTimeout(() => {
        notice.style.opacity = "0";
        noticeToDefault();
      }, 2000);
    });
}

function noticeToDefault() {
  setTimeout(() => {
    notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
    notice.style.border = "1px solid #50c156";
    notice.innerHTML = "<h4>Sucess!</h4><p>Student updated</p>";
  }, 300);
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
// Sidebar
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
// Theme
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
