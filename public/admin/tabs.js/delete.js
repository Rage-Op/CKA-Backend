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
const searchFormButton = document.querySelector("#formsearch button");
const searchFormInput = document.querySelector("#formsearch input");
let resultName = document.querySelector("#result-name");
let resultDOB = document.querySelector("#result-DOB");
let resultFname = document.querySelector("#result-fname");
let resultMname = document.querySelector("#result-mname");
let resultContact = document.querySelector("#result-contact");
let resultAddress = document.querySelector("#result-address");
let resultClass = document.querySelector("#result-class");
let resultAdmitDate = document.querySelector("#result-admit-date");
let resultTransport = document.querySelector("#result-transport");
let resultDiet = document.querySelector("#result-diet");
let resultGender = document.querySelector("#result-gender");
let resultStudentId = document.querySelector("#result-student-id");
let resultCredit = document.querySelector("#result-credit");
let resultDebit = document.querySelector("#result-debit");
let resultDue = document.querySelector("#result-due");
let photoUrl = document.querySelector(".photo");
let idToBeDeleted;
let cancelButton = document.querySelector("#admit-button");
let deleteButton = document.querySelector("#cancel-button");
// Reminder: the selector for cancelButton and deleteButton doesnot makes sense but ignore it!!
//
cancelButton.addEventListener("click", () => {
  searchFormInput.value = "";
  resultName.textContent = "....................";
  resultDOB.textContent = "....................";
  resultFname.textContent = "....................";
  resultMname.textContent = "....................";
  resultContact.textContent = "....................";
  resultAddress.textContent = "....................";
  resultTransport.textContent = "....................";
  resultDiet.textContent = "....................";
  resultClass.textContent = "....................";
  resultAdmitDate.textContent = "....................";
  resultGender.textContent = "....................";
  resultStudentId.textContent = "....................";
  resultCredit.textContent = 0;
  resultDebit.textContent = 0;
  resultDue.textContent = 0;
});
//
searchFormButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (searchFormInput.value === "") {
    console.log("not a valid student ID");
  } else {
    fetchStudent();
  }
});
//
async function fetchStudent() {
  studentId = searchFormInput.value;
  let URL = "https://cka-backend.onrender.com/students/search";
  try {
    let response = await fetch(`${URL}/${studentId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    resultName.textContent = data.name;
    resultDOB.textContent = data.DOB;
    resultFname.textContent = data.fatherName;
    resultMname.textContent = data.motherName;
    resultContact.textContent = data.contact;
    resultAddress.textContent = data.address;
    resultClass.textContent = data.class;
    resultAdmitDate.textContent = data.admitDate;
    resultTransport.textContent = data.transport;
    resultDiet.textContent = data.diet;
    resultGender.textContent = data.gender;
    resultStudentId.textContent = data.studentId;
    resultCredit.textContent = data.fees.credit;
    resultDebit.textContent = data.fees.debit;
    resultDue.textContent = data.fees.debit - data.fees.credit;
    idToBeDeleted = data.studentId;
    searchFormInput.value = "";
    deleteButton.addEventListener("click", deleteEventHandler);
    if (!data.photo) {
      photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
    } else {
      photoUrl.style.backgroundImage = `url(${data.photo})`;
    }
  } catch (error) {
    console.log(error);
    resultName.textContent = "....................";
    resultDOB.textContent = "....................";
    resultFname.textContent = "....................";
    resultMname.textContent = "....................";
    resultContact.textContent = "....................";
    resultAddress.textContent = "....................";
    resultTransport.textContent = "....................";
    resultDiet.textContent = "....................";
    resultClass.textContent = "....................";
    resultAdmitDate.textContent = "....................";
    resultGender.textContent = "....................";
    resultStudentId.textContent = "....................";
    resultCredit.textContent = 0;
    resultDebit.textContent = 0;
    photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
    searchFormInput.value = "";
    resultDue.textContent = 0;
  }
}
async function deleteEventHandler() {
  deleteButton.removeEventListener("click", deleteEventHandler);
  console.log(studentId);
  const deleteURL = `https://cka-backend.onrender.com/students/delete/${studentId}`;
  const options = {
    method: "DELETE",
  };
  await fetch(deleteURL, options)
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
      notice.innerHTML = "<h4>Failed!</h4><p>Delete failed</p>";
      notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
      notice.style.border = "1px solid #D32F2F";
      notice.style.opacity = "100";
      setTimeout(() => {
        notice.style.opacity = "0";
        notice.innerHTML = "<h4>Sucess!</h4><p>Student deleted</p>";
      }, 2000);
    });
  resultName.textContent = "....................";
  resultDOB.textContent = "....................";
  resultFname.textContent = "....................";
  resultMname.textContent = "....................";
  resultContact.textContent = "....................";
  resultAddress.textContent = "....................";
  resultTransport.textContent = "....................";
  resultDiet.textContent = "....................";
  resultClass.textContent = "....................";
  resultAdmitDate.textContent = "....................";
  resultGender.textContent = "....................";
  resultStudentId.textContent = "....................";
  resultCredit.textContent = 0;
  resultDebit.textContent = 0;
  photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
  searchFormInput.value = "";
  resultDue.textContent = 0;
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
