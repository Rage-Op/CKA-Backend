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

let notice = document.querySelector("#sucess-dialog");
let creditCheckbox = document.querySelector(".credit-sucess-checkbox");
const searchFormButton = document.querySelector("#formsearch button");
const searchFormInput = document.querySelector("#formsearch input");
let photoUrl = document.querySelector("#fees-photo");
let feesName = document.querySelector("#fees-name");
let feesClass = document.querySelector("#fees-class");
let feesStudentId = document.querySelector("#fees-studentId");
let feesDate = document.querySelector("#fees-date");
let feesDebit = document.querySelector("#result-debit");
let feesCredit = document.querySelector("#result-credit");
let feesDue = document.querySelector("#result-due");
let creditAmount = document.querySelector("#credit-amount");
let creditBill = document.querySelector("#credit-bill");
let creditButton = document.querySelector("#admit-button");
let cancelButton = document.querySelector("#cancel-button");
const debitColumn = document.querySelector("#debit-column");
const creditColumn = document.querySelector("#credit-column");
let fetchedData;
let globalStudentId;

cancelButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchFormInput.value = "";
  feesName.textContent = "....................";
  feesClass.textContent = "....................";
  feesDebit.textContent = 0;
  feesCredit.textContent = 0;
  feesDue.textContent = 0;
  debitColumn.innerHTML = "";
  creditColumn.innerHTML = "";
  feesStudentId.textContent = "...";
  photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
});

searchFormButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (searchFormInput.value === "") {
    console.log("not a valid student ID");
  } else {
    fetchedData = "";
    globalStudentId = searchFormInput.value;
    creditColumn.innerHTML = "";
    debitColumn.innerHTML = "";
    fetchStudent();
  }
});
//
//
// get date
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentDate = new Date();
const day = currentDate.getDate();
const month = months[currentDate.getMonth()];
const year = currentDate.getFullYear();
const formattedDate = `${day} ${month} ${year}`;
feesDate.textContent = formattedDate;
//
//
//
async function fetchStudent() {
  debitColumn.innerHTML = "";
  creditColumn.innerHTML = "";
  let URL = "https://cka-backend.onrender.com/students/search";
  try {
    let response = await fetch(`${URL}/${globalStudentId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    fetchedData = data;
    feesName.textContent = data.name;
    feesStudentId.textContent = data.studentId;
    feesClass.textContent = data.class;
    feesCredit.textContent = data.fees.credit;
    feesDebit.textContent = data.fees.debit;
    feesDue.textContent = data.fees.debit - data.fees.credit;
    if (!data.photo) {
      photoUrl.style.backgroundImage = 'url("./content/user-icon.jpg")';
    } else {
      photoUrl.style.backgroundImage = `url(${data.photo})`;
    }
    //
    //
    // logic for creating tables from data
    data.debitAmount.forEach((object) => {
      let row = document.createElement("tr");
      let cell = document.createElement("td");
      cell.innerHTML = `<div class="box">
      <h5>${object.date}</h5>
      <p>Nrs. ${object.amount}</p>
      <p>${object.remark}</p>
      </div>`;
      row.appendChild(cell);
      debitColumn.appendChild(row);
    });
    data.creditAmount.forEach((object) => {
      let row = document.createElement("tr");
      let cell = document.createElement("td");
      cell.innerHTML = `<div class="box">
      <h5>${object.date}</h5>
      <p>Nrs. ${object.amount}</p>
      <p>Bill No. ${object.bill}</p>
      </div>`;
      row.appendChild(cell);
      creditColumn.appendChild(row);
    });
    creditButton.addEventListener("click", saveEventHandler);
  } catch (error) {
    console.log(error);
    feesName.textContent = "....................";
    feesClass.textContent = "....................";
    feesStudentId.textContent = "...";
    feesDebit.textContent = 0;
    feesCredit.textContent = 0;
    feesDue.textContent = 0;
    debitColumn.innerHTML = "";
    creditColumn.innerHTML = "";
    photoUrl.style.backgroundImage = 'url("./content/user-not-found-icon.jpg")';
    searchFormInput.value = "";
  }
}
//
//
//
async function saveEventHandler(event) {
  event.preventDefault();
  document.querySelector("#credit-chx").style.backgroundColor = "";
  if (creditAmount.value == "" || creditBill.value == "") {
    console.log("credit amount or bill number not defined");
  } else if (isNaN(creditAmount.value) || isNaN(creditBill.value)) {
    console.log("Invalid credit amount ot bill number");
  } else {
    creditButton.removeEventListener("click", saveEventHandler);
    //
    //
    // new credit amount logic
    let newCreditArray = fetchedData.creditAmount;
    newCreditArray.push({
      date: `${formattedDate}`,
      amount: Number(creditAmount.value),
      bill: `${creditBill.value}`,
    });
    let totalCreditAmount = 0;
    newCreditArray.forEach((credits) => {
      totalCreditAmount = totalCreditAmount + credits.amount;
    });
    //
    let data = {
      creditAmount: newCreditArray,
      fees: {
        debit: fetchedData.fees.debit,
        credit: totalCreditAmount,
      },
    };
    const patchURL = `https://cka-backend.onrender.com/students/update/${globalStudentId}`;
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
        creditAmount.value = "";
        creditBill.value = "";
        creditCheckbox.checked = true;
        setTimeout(() => {
          creditCheckbox.checked = false;
        }, 3000);
        console.log("Response data:", data);
        notice.style.opacity = "100";
        fetchStudent();
        setTimeout(() => {
          notice.style.opacity = "0";
        }, 2000);
      })
      .catch((error) => {
        console.error("There was a problem with the credit operation:", error);
        notice.innerHTML = "<h4>Failed!</h4><p>Update failed</p>";
        notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
        notice.style.border = "1px solid #D32F2F";
        notice.style.opacity = "100";
        setTimeout(() => {
          notice.style.opacity = "0";
          noticeToDefault();
        }, 2000);
        document.querySelector("#credit-chx").style.backgroundColor = "red";
      });
    searchFormInput.value = "";
  }
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
