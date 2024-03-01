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
let notice = document.querySelector("#sucess-dialog");
const admitButton = document.querySelector("#admit-button");
const cancelButton = document.querySelector("#cancel-button");
let addName = document.querySelector("#add-name");
let addDOB = document.querySelector("#add-DOB");
let addFname = document.querySelector("#add-fname");
let addMname = document.querySelector("#add-mname");
let addContact = document.querySelector("#add-contact");
let addAddress = document.querySelector("#add-address");
let addStudentId = document.querySelector("#add-studentId");
let addAdmitDate = document.querySelector("#add-admitdate");
let addDue = document.querySelector("#result-due");
let addTransport = document.querySelector("#add-transport");
let addDiet = document.querySelector("#add-diet");
let addClass = document.querySelector("#add-class");
let addGender = document.querySelector("#add-gender");
let photoUrl = document.querySelector(".photo");
let nextStudentId;
let settings;
//
//
// To get next student ID.
getStudentId();
async function getStudentId() {
  let getURL = "https://cka-backend.onrender.com/students";
  try {
    let response = await fetch(getURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    if (!data[0].studentId) {
      nextStudentId = 1;
    } else {
      nextStudentId = Number(data[0].studentId) + 1;
    }
    addStudentId.textContent = nextStudentId;
    const date = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    const [month, day, year] = formattedDate
      .split("/")
      .map((part) => parseInt(part));
    const updatedFormattedDate = `${year}/${month
      .toString()
      .padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
    addAdmitDate.textContent = updatedFormattedDate;
  } catch (error) {
    console.log(error);
  }
}
//
//
//
admitButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (
    addName.value === "" ||
    addDOB.value === "" ||
    addFname.value === "" ||
    addMname.value === "" ||
    addContact.value === "" ||
    addAddress.value === ""
  ) {
    console.log("error");
    notice.innerHTML = "<h4>Failed!</h4><p>Student admission failed</p>";
    notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
    notice.style.border = "1px solid #D32F2F";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
      noticeToDefault();
    }, 2000);
  } else {
    fetchStudent();
  }
});
//
//
//
cancelButton.addEventListener("click", (event) => {
  event.preventDefault();
  addName.value = "";
  addDOB.value = "";
  addFname.value = "";
  addMname.value = "";
  addContact.value = "";
  addAddress.value = "";
  addTransport.checked = false;
  addDiet.checked = false;
  addClass.value = "P.G.";
  addGender.value = "male";
  addStudentId.textContent = "...";
  addAdmitDate.textContent = "...";
});
//
//
//
async function fetchStudent() {
  let getURL = "https://cka-backend.onrender.com/students";
  let getSettingsURL = "https://cka-backend.onrender.com/settings";
  try {
    let response = await fetch(getSettingsURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    settings = await response.json();
  } catch (error) {
    console.log(error);
  }
  try {
    let response = await fetch(getURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    if (!data[0].studentId) {
      nextStudentId = 1;
      console.log(nextStudentId);
    } else {
      nextStudentId = Number(data[0].studentId) + 1;
      console.log(nextStudentId);
    }
    addStudentId.textContent = nextStudentId;
    addStudent(nextStudentId, addAdmitDate.textContent);
  } catch (error) {
    console.log(error);
    notice.innerHTML = "<h4>Failed!</h4><p>Student admission failed</p>";
    notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
    notice.style.border = "1px solid #D32F2F";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
      noticeToDefault();
    }, 2000);
  }
}

async function addStudent(nextStudentId, admitDate) {
  let postURL = "https://cka-backend.onrender.com/students/add";
  let toSetMonthlyFees;
  console.log(admitDate);
  let toSetTransportFees;
  let toSetDietFees;
  let toSetExamFees = settings[0].exam;
  //
  switch (addClass.value) {
    case "P.G.":
      toSetMonthlyFees = settings[0].monthlyPG;
      break;
    case "K.G.":
      toSetMonthlyFees = settings[0].monthlyKG;
      break;
    case "nursery":
      toSetMonthlyFees = settings[0].monthlyNursery;
      break;
    case "1":
      toSetMonthlyFees = settings[0].monthly1;
      break;
    case "2":
      toSetMonthlyFees = settings[0].monthly2;
      break;
    case "3":
      toSetMonthlyFees = settings[0].monthly3;
      break;
    case "4":
      toSetMonthlyFees = settings[0].monthly4;
      break;
    case "5":
      toSetMonthlyFees = settings[0].monthly5;
      break;
    case "6":
      toSetMonthlyFees = settings[0].monthly6;
      break;
    default:
      console.log("Invalid response from select!");
  }
  //
  if (addTransport.checked) {
    toSetTransportFees = settings[0].transport;
  } else {
    toSetTransportFees = 0;
  }
  //
  if (addDiet.checked) {
    toSetDietFees = settings[0].diet;
  } else {
    toSetDietFees = 0;
  }
  //
  let jsonData = {
    name: `${addName.value}`,
    gender: `${addGender.value}`,
    class: `${addClass.value}`,
    studentId: `${nextStudentId}`,
    DOB: `${addDOB.value}`,
    admitDate: `${admitDate}`,
    fatherName: `${addFname.value}`,
    motherName: `${addMname.value}`,
    contact: `${addContact.value}`,
    address: `${addAddress.value}`,
    transport: addTransport.checked,
    diet: addDiet.checked,
    monthlyFees: toSetMonthlyFees,
    transportFees: toSetTransportFees,
    dietFees: toSetDietFees,
    examFees: toSetExamFees,
    debitAmount: [],
    creditAmount: [],
    fees: {
      debit: 0,
      credit: 0,
    },
    photo: `https://raw.githubusercontent.com/Rage-Op/imageResource/main/${nextStudentId}.jpg`,
  };
  //
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  };
  await fetch(postURL, options)
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
      getStudentId();
    })
    .catch((error) => {
      console.error("There was a problem with the add operation:", error);
      notice.innerHTML = "<h4>Failed!</h4><p>Student admission failed</p>";
      notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
      notice.style.border = "1px solid #D32F2F";
      notice.style.opacity = "100";
      setTimeout(() => {
        notice.style.opacity = "0";
        noticeToDefault();
      }, 2000);
    });
  addName.value = "";
  addDOB.value = "";
  addFname.value = "";
  addMname.value = "";
  addContact.value = "";
  addAddress.value = "";
  addTransport.checked = false;
  addDiet.checked = false;
  addClass.value = "P.G.";
  addGender.value = "male";
  addStudentId.textContent = "...";
  addAdmitDate.textContent = "...";
}
function noticeToDefault() {
  setTimeout(() => {
    notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
    notice.style.border = "1px solid #50c156";
    notice.innerHTML = "<h4>Sucess!</h4><p>Student added</p>";
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
