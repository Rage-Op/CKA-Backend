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
  // Load all students when the page loads
  fetchAllStudents();
});
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
const localURI = window.location.origin;
const hostedURI = "https://cka-backend.onrender.com";
const studentsTableBody = document.querySelector("#students-table-body");
//
searchFormButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (searchFormInput.value === "") {
    console.log("not a valid student ID");
    notice.innerHTML = "<h4>Failed!</h4><p>Student not found</p>";
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

// Fetch all students in ascending order
async function fetchAllStudents() {
  try {
    let URL = `${localURI}/ascending-students`;
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch students data");
    }

    let students = await response.json();
    displayStudentsTable(students);
  } catch (error) {
    console.error("Error fetching all students:", error);
    notice.innerHTML = "<h4>Failed!</h4><p>Could not load students</p>";
    notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
    notice.style.border = "1px solid #D32F2F";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
      noticeToDefault();
    }, 2000);
  }
}

// Display students in the table
function displayStudentsTable(students) {
  // Clear existing table content
  studentsTableBody.innerHTML = "";

  // Add each student to the table
  students.forEach((student) => {
    const due = student.fees.debit - student.fees.credit;

    const row = document.createElement("tr");
    row.dataset.studentId = student.studentId;

    row.innerHTML = `
      <td>${student.studentId}</td>
      <td>${student.name}</td>
      <td>${student.class}</td>
      <td>${student.contact}</td>
      <td>${student.address}</td>
      <td>${student.gender}</td>
      <td class="credit">Npr. ${student.fees.credit}</td>
      <td class="debit">Npr. ${student.fees.debit}</td>
      <td class="due">Npr. ${due}</td>
    `;

    // Add click event to show student details
    row.addEventListener("click", () => {
      displayStudentDetails(student);
    });

    studentsTableBody.appendChild(row);
  });
}

// Display student details in the top section
function displayStudentDetails(student) {
  resultName.textContent = student.name;
  resultDOB.textContent = student.DOB;
  resultFname.textContent = student.fatherName;
  resultMname.textContent = student.motherName;
  resultContact.textContent = student.contact;
  resultAddress.textContent = student.address;
  resultClass.textContent = student.class;
  resultAdmitDate.textContent = student.admitDate;
  resultTransport.textContent = student.transport;
  resultDiet.textContent = student.diet;
  resultGender.textContent = student.gender;
  resultStudentId.textContent = student.studentId;
  resultCredit.textContent = student.fees.credit;
  resultDebit.textContent = student.fees.debit;
  resultDue.textContent = student.fees.debit - student.fees.credit;

  if (!student.photo) {
    photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
  } else {
    photoUrl.style.backgroundImage = `url(${student.photo})`;
  }

  // Show success notification
  notice.innerHTML = "<h4>Success!</h4><p>Student found</p>";
  notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
  notice.style.border = "1px solid #50c156";
  notice.style.opacity = "100";

  // Scroll to the top to see the student details
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    notice.style.opacity = "0";
  }, 2000);
}

//
async function fetchStudent() {
  // studentId = searchFormInput.value;
  studentId = Number(searchFormInput.value);
  let URL = `${localURI}/students/search`;
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
    searchFormInput.value = "";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
    }, 2000);
    if (!data.photo) {
      console.log("no photo");
      photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
    } else {
      photoUrl.style.backgroundImage = `url(${data.photo})`;
    }
  } catch (error) {
    console.log(error);
    notice.innerHTML = "<h4>Failed!</h4><p>Student not found</p>";
    notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
    notice.style.border = "1px solid #D32F2F";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
      noticeToDefault();
    }, 2000);
    resultName.textContent = "....................";
    resultDOB.textContent = "....................";
    resultFname.textContent = "....................";
    resultMname.textContent = "....................";
    resultContact.textContent = "....................";
    resultAddress.textContent = "....................";
    resultTransport.textContent = "....................";
    resultDiet.textContent = "....................";
    resultGender.textContent = "....................";
    resultStudentId.textContent = "....................";
    resultCredit.textContent = 0;
    resultDebit.textContent = 0;
    photoUrl.style.backgroundImage = 'url("./content/user-not-found-icon.jpg")';
    searchFormInput.value = "";

    // resultDue.textContent = data.fees.debit - data.fees.credit;
  }
}
//
function noticeToDefault() {
  setTimeout(() => {
    notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
    notice.style.border = "1px solid #50c156";
    notice.innerHTML = "<h4>Success!</h4><p>Student found</p>";
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
