// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC
let checkbox = document.querySelector(".debit-sucess-checkbox");
let debitDate = document.querySelector("#debit-date");
let debitButton = document.querySelector("#debit-button");
let examCbx = document.querySelector("#exam-checkbox");

debitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const userInput = window.prompt("Please enter your password:");
  if (userInput !== null) {
    const password = userInput.trim();
    if (password === "admin123") {
      console.log("processing debit");
      debitFetchStudent();
    } else {
      window.prompt("Invalid password!");
    }
  } else {
    console.log("debit dismissed.");
    prompt("Debit cancelled by user.");
  }
});
//
//
// previous debit logic
async function getBsDate() {
  let dateURL = "https://cka-backend.onrender.com/bs-date";
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  return formattedDate;
}

async function calculateDaysDifference() {
  let dateURL = "https://cka-backend.onrender.com/bs-date";
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  let dateBString = await getPreviousDebitDate();
  let [yearA, monthA, dayA] = formattedDate.split("/");
  let [yearB, monthB, dayB] = dateBString.split("/");
  let daysA = parseInt(yearA) * 365 + parseInt(monthA) * 30 + parseInt(dayA);
  let daysB = parseInt(yearB) * 365 + parseInt(monthB) * 30 + parseInt(dayB);
  let daysPassed = daysA - daysB;
  debitDate.textContent = `${daysPassed} days ago`;
}

async function getPreviousDebitDate() {
  const logURL = "https://cka-backend.onrender.com/debit-log";
  try {
    let response = await fetch(`${logURL}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    return data[0].lastDebit;
  } catch (error) {
    console.log(error);
  }
}
calculateDaysDifference();
//
//
//
async function debitFetchStudent() {
  let URL = "https://cka-backend.onrender.com/students";
  let dateURL = "https://cka-backend.onrender.com/bs-date";
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
  let bsFormattedMonthDate = `${day} ${bsMonth} ${year}`;
  try {
    let response = await fetch(`${URL}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    let updateRequestArray = [];
    data.forEach((student) => {
      checkbox.checked = false;
      let newDebitAmountArray = student.debitAmount;
      let newDebitDate = bsFormattedMonthDate;
      let newDebitAmount = 0;
      let newDebitRemark;
      if (examCbx.checked) {
        if (student.transport === true && student.diet === true) {
          newDebitRemark = "Monthly Fees, Transport, Diet, Exam";
          newDebitAmount =
            newDebitAmount +
            student.monthlyFees +
            student.transportFees +
            student.dietFees +
            student.examFees;
        } else if (student.transport === true && student.diet === !true) {
          newDebitRemark = "Monthly Fees, Transport, Exam";
          newDebitAmount =
            newDebitAmount +
            student.monthlyFees +
            student.transportFees +
            student.examFees;
        } else if (student.transport === !true && student.diet === true) {
          newDebitRemark = "Monthly Fees, Diet, Exam";
          newDebitAmount =
            newDebitAmount +
            student.monthlyFees +
            student.dietFees +
            student.examFees;
        } else {
          newDebitRemark = "Monthly Fees, Exam";
          newDebitAmount =
            newDebitAmount + student.monthlyFees + student.examFees;
        }
      } else {
        if (student.transport === true && student.diet === true) {
          newDebitRemark = "Monthly Fees, Transport, Diet";
          newDebitAmount =
            newDebitAmount +
            student.monthlyFees +
            student.transportFees +
            student.dietFees;
        } else if (student.transport === true && student.diet === !true) {
          newDebitRemark = "Monthly Fees, Transport";
          newDebitAmount =
            newDebitAmount + student.monthlyFees + student.transportFees;
        } else if (student.transport === !true && student.diet === true) {
          newDebitRemark = "Monthly Fees, Diet";
          newDebitAmount =
            newDebitAmount + student.monthlyFees + student.dietFees;
        } else {
          newDebitRemark = "Monthly Fees";
          newDebitAmount = newDebitAmount + student.monthlyFees;
        }
      }
      let debitPatchObject = {
        date: newDebitDate,
        amount: newDebitAmount,
        remark: newDebitRemark,
      };
      newDebitAmountArray.push(debitPatchObject);
      let totalDebitAmount = 0;
      newDebitAmountArray.forEach((debitAmountObject) => {
        totalDebitAmount = totalDebitAmount + debitAmountObject.amount;
      });
      let studentPatchObject = {
        studentId: student.studentId,
        debitAmount: newDebitAmountArray,
        fees: {
          debit: totalDebitAmount,
          credit: student.fees.credit,
        },
      };
      updateRequestArray.push(studentPatchObject);
    });
    updateDebit(updateRequestArray);
  } catch (error) {
    console.log("error in debitFetchStudent");
    console.log(error);
  }
}
//
//
//
async function updateDebit(patchArray) {
  const patchURL = "https://cka-backend.onrender.com/debit";
  const patchDebitDateURL = "https://cka-backend.onrender.com/debit-log";
  let dateURL = "https://cka-backend.onrender.com/bs-date";
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  let renewDebitDate = {
    lastDebit: formattedDate,
  };
  const DebitDateoptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(renewDebitDate),
  };
  await fetch(patchDebitDateURL, DebitDateoptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      examCbx.checked = false;
    })
    .catch((error) => {
      console.error("There was a problem updating debit log:", error);
    });
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchArray),
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
      fetchStudent();
      checkbox.checked = true;
      setTimeout(() => {
        checkbox.checked = false;
      }, 3000);
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
      document.querySelector("#chx").style.backgroundColor = "red";
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
