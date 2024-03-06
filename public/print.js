//
//
// print Logic
document.getElementById("printButton").addEventListener("click", function () {
  printJS({
    printable: "toPrint",
    type: "html",
    style: `
      @media print {
        .no-print { display: none; }
        * {
        padding: 0;
        margin: 0;
        }
        #toPrint {
          border-collapse: seperate;
          border-spacing: 8px;
        }
        .print-box {
          border: 1px solid black;
          border-radius: 12px;
          flex: 1 0 48%;
        }
        .print-box .box-top,
        .print-box .box-mid,
        .print-box .box-bottom {
          text-align: center;
          padding: 5px 10px;
          line-height: 1.01;
        }
        .print-box .box-mid {
          text-align: justify;
        }
        .print-box .box-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .box-top-left > img {
          height: 56px;
          aspect-ratio: 1 / 1;
        }
        .box-top-right {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .print-box .box-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    `,
  });
});
// admission form print logic
document
  .getElementById("admission-form-print-button")
  .addEventListener("click", function () {
    printJS({
      printable: "to-print-form",
      type: "html",
      style: `
      @media print {
        .no-print { display: none; }
        * {
        padding: 0;
        margin: 0;
        }
        #to-print-form {
          height: 29.7cm;
          width: 21cm;
          position: relative;
          background-image: url("./content/admission-form.jpg");
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .admission-form {
          background-color: transparent;
          outline: none;
          border: 1.5px solid grey;
          height: 0.6cm;
          text-align: center;
        }
        #form-date {
          position: absolute;
          top: 7.79cm;
          left: 15.69cm;
          width: 4.23cm;
        }
        #form-name {
          position: absolute;
          top: 10.5cm;
          left: 4.17cm;
          width: 15.72cm;
        }
        #form-class {
          position: absolute;
          top: 11.44cm;
          left: 4.17cm;
          width: 5.64cm;
        }
        #form-DOB {
          position: absolute;
          top: 12.34cm;
          left: 4.17cm;
          width: 5.64cm;
        }
        #form-student-id {
          position: absolute;
          top: 13.24cm;
          left: 4.17cm;
          width: 5.64cm;
        }
        #form-gender-male {
          position: absolute;
          padding: 0;
          height: 0.6cm;
          width: 2.1cm;
          top: 14.18cm;
          left: 3.42cm;
        }
        #form-gender-female {
          position: absolute;
          padding: 0;
          height: 0.6cm;
          width: 2.1cm;
          top: 14.18cm;
          left: 5.96cm;
        }
        #form-fname {
          position: absolute;
          top: 15.1cm;
          left: 4.17cm;
          width: 5.64cm;
        }
        #form-mname {
          position: absolute;
          top: 16.02cm;
          left: 4.17cm;
          width: 5.64cm;
        }
        #form-nationality {
          position: absolute;
          top: 11.44cm;
          left: 14.28cm;
          width: 5.64cm;
        }
        #form-zip-code {
          position: absolute;
          top: 12.34cm;
          left: 14.28cm;
          width: 5.64cm;
        }
        #form-transport {
          position: absolute;
          padding: 0;
          height: 0.6cm;
          width: 2.1cm;
          top: 13.26cm;
          left: 13.54cm;
        }
        #form-diet {
          position: absolute;
          padding: 0;
          height: 0.6cm;
          width: 2.1cm;
          top: 13.26cm;
          left: 18.55cm;
        }
        #form-mobile {
          position: absolute;
          top: 14.19cm;
          left: 14.28cm;
          width: 5.64cm;
        }
        #form-whatsapp {
          position: absolute;
          top: 15.1cm;
          left: 14.28cm;
          width: 5.64cm;
        }
        #form-facebook {
          position: absolute;
          top: 16.02cm;
          left: 14.28cm;
          width: 5.64cm;
        }
        #form-prev-school-name {
          position: absolute;
          top: 19cm;
          left: 4.15cm;
          width: 10.11cm;
        }
        #form-prev-school-class {
          position: absolute;
          top: 19cm;
          left: 15.69cm;
          width: 4.19cm;
        }
        #form-address {
          position: absolute;
          top: 22.23cm;
          left: 4.15cm;
          width: 15.82cm;
        }
      }
    `,
    });
  });
//
//
//main Logic
let nextButton = document.querySelector("#print-next-button");
let feesTableBody = document.querySelector("#fee-due-table-body");
let printStudentId = document.querySelector("#print-studentId");
let printDate = document.querySelector("#print-date");
let globalData;
let countBatch = 0;
window.addEventListener("load", async () => {
  let getURL = "https://cka-backend.onrender.com/ascending-students";
  let response = await fetch(getURL);
  let data = await response.json();
  globalData = data;
  updateStudentId(countBatch);
  generateTable(countBatch);
  countBatch += 12;
  let dateURL = "https://cka-backend.onrender.com/bs-date";
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  printDate.textContent = `${parts[0]}/${parts[1]}/${parts[2]}`;
});

nextButton.addEventListener("click", () => {
  if (countBatch < globalData.length) {
    feesTableBody.innerHTML = "";
    updateStudentId(countBatch);
    generateTable(countBatch);
    countBatch += 12;
  } else {
    console.log("no more students!!");
  }
});

function updateStudentId(countBatch) {
  if (countBatch < globalData.length) {
    let countBatch2 = countBatch + 12;
    if (countBatch2 > globalData.length) {
      countBatch2 = globalData.length;
    }
    printStudentId.textContent = `${countBatch + 1} - ${countBatch2}`;
  }
}

async function generateTable(studentBatch) {
  let dateURL = "https://cka-backend.onrender.com/bs-date";
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  let getURL = "https://cka-backend.onrender.com/ascending-students";
  let response = await fetch(getURL);
  let data = await response.json();
  for (let i = studentBatch; i < studentBatch + 12; i += 2) {
    const [year, month, day] = formattedDate.split("/");
    let bsMonths = [
      "Baisakh",
      "Jestha",
      "Asar",
      "Shrawan",
      "Bhadra",
      "Ashwin",
      "Kartik",
      "Mangsir",
      "Poush",
      "Magh",
      "Falgun",
      "Chaitra",
    ];
    let bsMonth = bsMonths[parseInt(month) - 1];
    let currentMonth = bsMonth;
    if (!data[i] && !data[i + 1]) {
      break;
    } else if (data[i] && !data[i + 1]) {
      let pronoun1;
      if (data[i].gender == "male") {
        pronoun1 = "son";
      } else {
        pronoun1 = "daughter";
      }
      let feesTableRow = document.createElement("tr");
      let due1 = data[i].fees.debit - data[i].fees.credit;
      feesTableRow.innerHTML = `<td>
          <div class="print-box">
          <div class="box-top">
          <div class="box-top-left">
            <img src="./content/logo.png" alt="CKA" />
          </div>
          <div class="box-top-right">
            <div class="box-top-text">
              <h4>CHILDREN KINGDOM ACADEMY</h4>
              <p>Siddharthanagar-06, Bhairahawa</p>
              <p>Phone: +977-9847155155, +977-9804415786</p>
            </div>
          </div>
        </div>
              <div class="box-mid">
              <hr />
              <p style="text-align: center">Student Id: <b>${data[i].studentId}</b></p>
              <p>
                Dear Parents, your ${pronoun1}
                <b>${data[i].name}</b> who studies in class
                <b>${data[i].class}</b> has pending due up to the month of
                <b>${currentMonth}</b> of Rs. <b>${due1}</b>.So, please pay the fee
                within 5 days.
              </p>
            </div>
            <div class="box-bottom">
              <p>Date: <b>${formattedDate}</b></p>
              <p>Accountant</p>
            </div>
          </div>
        </td>
        <td>
          <div class="print-box">
          <div class="box-top">
          <div class="box-top-left">
            <img src="./content/logo.png" alt="CKA" />
          </div>
          <div class="box-top-right">
            <div class="box-top-text">
              <h4>CHILDREN KINGDOM ACADEMY</h4>
              <p>Siddharthanagar-06, Bhairahawa</p>
              <p>Phone: +977-9847155155, +977-9804415786</p>
            </div>
          </div>
        </div>
              <div class="box-mid">
              <hr />
              <p style="text-align: center">Student Id: <b>undefined</b></p>
              <p>
                Dear Parents, your 
                <b>undefined</b> who studies in class
                <b>undefined</b> has pending due up to the month of
                <b>undefined</b> of Rs. <b>undefined</b>.So, please pay the fee
                within 5 days.
              </p>
            </div>
            <div class="box-bottom">
              <p>Date: <b>undefined</b></p>
              <p>Accountant</p>
            </div>
          </div>
        </td>`;
      feesTableBody.appendChild(feesTableRow);
    } else {
      let pronoun1;
      let pronoun2;
      if (data[i].gender == "male") {
        pronoun1 = "son";
      } else {
        pronoun1 = "daughter";
      }
      if (data[i + 1].gender == "male") {
        pronoun2 = "son";
      } else {
        pronoun2 = "daughter";
      }
      let feesTableRow = document.createElement("tr");
      let due1 = data[i].fees.debit - data[i].fees.credit;
      let due2 = data[i + 1].fees.debit - data[i + 1].fees.credit;
      feesTableRow.innerHTML = `<td>
          <div class="print-box">
          <div class="box-top">
          <div class="box-top-left">
            <img src="./content/logo.png" alt="CKA" />
          </div>
          <div class="box-top-right">
            <div class="box-top-text">
              <h4>CHILDREN KINGDOM ACADEMY</h4>
              <p>Siddharthanagar-06, Bhairahawa</p>
              <p>Phone: +977-9847155155, +977-9804415786</p>
            </div>
          </div>
        </div>
              <div class="box-mid">
              <hr />
              <p style="text-align: center">Student Id: <b>${
                data[i].studentId
              }</b></p>
              <p>
                Dear Parents, your ${pronoun1}
                <b>${data[i].name}</b> who studies in class
                <b>${data[i].class}</b> has pending due up to the month of
                <b>${currentMonth}</b> of Rs. <b>${due1}</b>.So, please pay the fee
                within 5 days.
              </p>
            </div>
            <div class="box-bottom">
              <p>Date: <b>${formattedDate}</b></p>
              <p>Accountant</p>
            </div>
          </div>
        </td>
        <td>
          <div class="print-box">
          <div class="box-top">
          <div class="box-top-left">
            <img src="./content/logo.png" alt="CKA" />
          </div>
          <div class="box-top-right">
            <div class="box-top-text">
              <h4>CHILDREN KINGDOM ACADEMY</h4>
              <p>Siddharthanagar-06, Bhairahawa</p>
              <p>Phone: +977-9847155155, +977-9804415786</p>
            </div>
          </div>
        </div>
              <div class="box-mid">
              <hr />
              <p style="text-align: center">Student Id: <b>${
                data[i + 1].studentId
              }</b></p>
              <p>
                Dear Parents, your ${pronoun2}
                <b>${data[i + 1].name}</b> who studies in class
                <b>${data[i + 1].class}</b> has pending due up to the month of
                <b>${currentMonth}</b> of Rs. <b>${due2}</b>.So, please pay the fee
                within 5 days.
              </p>
            </div>
            <div class="box-bottom">
              <p>Date: <b>${formattedDate}</b></p>
              <p>Accountant</p>
            </div>
          </div>
        </td>`;
      feesTableBody.appendChild(feesTableRow);
    }
  }
}
// admission form
let notice = document.querySelector("#sucess-dialog");
const searchFormButton = document.querySelector("#formsearch button");
const searchFormInput = document.querySelector("#formsearch input");
const formDate = document.querySelector("#form-date");
const formName = document.querySelector("#form-name");
const formClass = document.querySelector("#form-class");
const formDOB = document.querySelector("#form-DOB");
const formStudentId = document.querySelector("#form-student-id");
const formGenderMale = document.querySelector("#form-gender-male");
const formGenderFemale = document.querySelector("#form-gender-female");
const formFname = document.querySelector("#form-fname");
const forMname = document.querySelector("#form-mname");
const formNationality = document.querySelector("#form-nationality");
const formZipCode = document.querySelector("#form-zip-code");
const formTransport = document.querySelector("#form-transport");
const formDiet = document.querySelector("#form-diet");
const formMobile = document.querySelector("#form-mobile");
const formWhatsapp = document.querySelector("#form-whatsapp");
const formFacebook = document.querySelector("#form-facebook");
const formPrevSchoolName = document.querySelector("#form-prev-shool-name");
const formPrevSchoolClass = document.querySelector("#form-prev-shool-class");
const formAddress = document.querySelector("#form-address");

searchFormButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (searchFormInput.value == "") {
    notice.innerHTML = "<h4>Failed!</h4><p>Student not found</p>";
    notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
    notice.style.border = "1px solid #D32F2F";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
      noticeToDefault();
    }, 2000);
  } else {
    fetchData(searchFormInput.value);
  }
});

async function fetchData(search) {
  //
  studentId = Number(searchFormInput.value);
  let URL = "https://cka-backend.onrender.com/students/search";
  try {
    let response = await fetch(`${URL}/${studentId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    searchFormInput.value = "";
    console.log(data);
    formDate.value = data.admitDate;
    formName.value = data.name;
    formClass.value = data.class;
    formDOB.value = data.DOB;
    formStudentId.value = data.studentId;
    if (data.gender == "male") {
      formGenderMale.checked = true;
      formGenderFemale.checked = false;
    } else {
      formGenderMale.checked = false;
      formGenderFemale.checked = true;
    }
    formFname.value = data.fname;
    forMname.value = data.mname;
    formNationality.value = "";
    formZipCode.value = "";
    if (data.transport == true) {
      formTransport.checked = true;
    } else {
      formTransport.checked = false;
    }
    if (data.diet == true) {
      formDiet.checked = true;
    } else {
      formDiet.checked = false;
    }
    formMobile.value = data.contact;
    formWhatsapp.value = "";
    formFacebook.value = "";
    notice.style.opacity = "100";
    setTimeout(() => {
      notice.style.opacity = "0";
    }, 2000);
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
  }
}
function noticeToDefault() {
  setTimeout(() => {
    notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
    notice.style.border = "1px solid #50c156";
    notice.innerHTML = "<h4>Sucess!</h4><p>Student found</p>";
  }, 300);
}
//main Logic
//
//
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
  // fetchData();
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }
});
//
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
