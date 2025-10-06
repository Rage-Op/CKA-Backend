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
const searchFormButton = document.querySelector("#formsearch button");
const searchFormInput = document.querySelector("#formsearch input");
let updateName = document.querySelector("#update-name");
let updateDOB = document.querySelector("#update-DOB");
let updateFname = document.querySelector("#update-fname");
let updateMname = document.querySelector("#update-mname");
let updateContact = document.querySelector("#update-contact");
let updateAddress = document.querySelector("#update-address");
let updateOldDue = document.querySelector("#update-old-due");
let updateDiscount = document.querySelector("#update-discount");
let updateTransport = document.querySelector("#update-transport");
let updateDiet = document.querySelector("#update-diet");
let updateClass = document.querySelector("#add-class");
let photoUrl = document.querySelector(".update-photo");
let updateStudentId = document.querySelector("#add-studentId");
let updateAdmitDate = document.querySelector("#add-admitdate");
let saveButton = document.querySelector("#admit-button");
let cancelButton = document.querySelector("#cancel-button");
const localURI = window.location.origin;
const hostedURI = "https://cka-backend.onrender.com";
let globalData;
//
cancelButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchFormInput.value = "";
  updateName.value = "";
  updateDOB.value = "";
  updateFname.value = "";
  updateMname.value = "";
  updateContact.value = "";
  updateAddress.value = "";
  updateOldDue.value = "";
  updateDiscount.value = "";
  updateTransport.checked = false;
  updateDiet.checked = false;
  updateClass.value = "P.G.";
  photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
});
//
searchFormButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (searchFormInput.value === "") {
    console.log("not a valid student ID");
    notice.innerHTML = "<h4>Failed!</h4><p>Search failed</p>";
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
async function fetchStudent() {
  studentId = searchFormInput.value;
  let URL = `${localURI}/students/search`;
  try {
    let response = await fetch(`${URL}/${studentId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    globalData = data;
    updateName.value = data.name;
    updateDOB.value = data.DOB;
    updateFname.value = data.fatherName;
    updateMname.value = data.motherName;
    updateContact.value = data.contact;
    updateAddress.value = data.address;
    console.log(data.debitAmount[0].remark);
    console.log(data.creditAmount[0].bill);
    updateOldDue.value = data.debitAmount[0].amount;
    updateDiscount.value = data.creditAmount[0].amount;
    updateStudentId.textContent = data.studentId;
    updateAdmitDate.textContent = data.admitDate;
    updateTransport.checked = data.transport;
    updateDiet.checked = data.diet;
    updateClass.value = data.class;
    searchFormInput.value = "";
    saveButton.addEventListener("click", saveEventHandler);
    if (!data.photo) {
      photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
    } else {
      photoUrl.style.backgroundImage = `url(${data.photo})`;
    }
  } catch (error) {
    console.log(error);
    updateName.value = "";
    updateDOB.value = "";
    updateFname.value = "";
    updateMname.value = "";
    updateContact.value = "";
    updateAddress.value = "";
    updateOldDue.value = "";
    updateDiscount.value = "";
    updateTransport.checked = false;
    updateDiet.checked = false;
    updateClass.value = "P.G.";
    photoUrl.style.backgroundImage = 'url("./content/user-not-found-icon.jpg")';
    searchFormInput.value = "";
  }
}
async function saveEventHandler(event) {
  event.preventDefault();
  let newFeesDebit =
    globalData.fees.debit -
    globalData.debitAmount[0].amount +
    Number(updateOldDue.value);
  let newDebitAmount = globalData.debitAmount;
  newDebitAmount[0].amount = Number(updateOldDue.value);
  let newFeesCredit =
    globalData.fees.credit -
    globalData.creditAmount[0].amount +
    Number(updateDiscount.value);
  let newCreditAmount = globalData.creditAmount;
  newCreditAmount[0].amount = Number(updateDiscount.value);
  saveButton.removeEventListener("click", saveEventHandler);
  console.log(studentId);
  let data = {
    name: `${updateName.value}`,
    DOB: `${updateDOB.value}`,
    class: `${updateClass.value}`,
    fatherName: `${updateFname.value}`,
    motherName: `${updateMname.value}`,
    contact: `${updateContact.value}`,
    address: `${updateAddress.value}`,
    debitAmount: newDebitAmount,
    creditAmount: newCreditAmount,
    fees: {
      debit: newFeesDebit,
      credit: newFeesCredit,
    },
    transport: updateTransport.checked,
    diet: updateDiet.checked,
  };
  const patchURL = `${localURI}/students/update/${studentId}`;
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
      setTimeout(() => {
        window.location.reload();
      }, 6000);
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
  updateName.value = "";
  updateDOB.value = "";
  updateFname.value = "";
  updateMname.value = "";
  updateContact.value = "";
  updateAddress.value = "";
  updateOldDue.value = "";
  updateDiscount.value = "";
  updateTransport.checked = false;
  updateDiet.checked = false;
  updateClass.value = "P.G.";
  photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
  searchFormInput.value = "";
}
//
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
