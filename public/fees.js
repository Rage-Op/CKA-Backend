// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC
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
const localURI = "http://localhost:3000";
const hostedURI = "https://cka-backend.onrender.com";
let fetchedData;
let globalStudentId;
// event listeners
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
//
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
    searchFormInput.value = "";
  }
});
// get date
async function getBsDate() {
  let dateURL = `${hostedURI}/bs-date`;
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  let [year, month, day] = formattedDate.split("/");
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
  let bsFormattedDate = `${day} ${bsMonth} ${year}`;
  feesDate.textContent = bsFormattedDate;
}
getBsDate();
//
//
//
async function fetchStudent() {
  debitColumn.innerHTML = "";
  creditColumn.innerHTML = "";
  let URL = `${hostedURI}/students/search`;
  if (!globalStudentId) {
    console.log("no student Id to search for");
  } else {
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
      creditButton.addEventListener("click", (event) => {
        event.preventDefault();
        let userCreditInput = window.prompt("Please enter your password:");
        if (userCreditInput !== null) {
          let creditPassword = userCreditInput.trim();
          if (creditPassword === "admin123") {
            console.log("processing credit");
            saveEventHandler();
            creditPassword = "";
          } else {
            prompt("Invalid password!");
          }
        } else {
          console.log("Credit dismissed.");
          prompt("Credit cancelled by user.");
        }
      });
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
      photoUrl.style.backgroundImage =
        'url("./content/user-not-found-icon.jpg")';
      searchFormInput.value = "";
    }
  }
}
//
async function saveEventHandler() {
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
      date: `${feesDate.textContent}`,
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
    const patchURL = `${hostedURI}/students/update/${globalStudentId}`;
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
        setTimeout(() => {
          window.location.reload();
        }, 6000);
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
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }
});

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
