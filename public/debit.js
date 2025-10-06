// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC
let checkbox = document.querySelector(".debit-sucess-checkbox");
let debitDate = document.querySelector("#debit-date");
let debitButton = document.querySelector("#debit-button");
let examCbx = document.querySelector("#exam-checkbox");
let backupButton = document.querySelector("#backup-button");

backupButton.addEventListener("click", (event) => {
  event.preventDefault();
  backupStudentData();
});

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
  let dateURL = `${localURI}/bs-date`;
  let responseDate = await fetch(dateURL);
  let datetimeStr = await responseDate.json();
  let datePart = datetimeStr.split(" ")[0];
  let parts = datePart.split("-");
  let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
  return formattedDate;
}

async function calculateDaysDifference() {
  try {
    let dateURL = `${localURI}/bs-date`;
    let responseDate = await fetch(dateURL);
    if (!responseDate.ok) throw new Error("Failed to fetch current date");
    let datetimeStr = await responseDate.json();

    if (!datetimeStr || typeof datetimeStr !== "string") {
      debitDate.textContent = "Date unavailable";
      return;
    }

    let datePart = datetimeStr.split(" ")[0];
    let parts = datePart.split("-");
    if (parts.length !== 3) {
      debitDate.textContent = "Date format error";
      return;
    }
    let formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;

    let dateBString = await getPreviousDebitDate();
    if (
      !dateBString ||
      typeof dateBString !== "string" ||
      dateBString.split("/").length !== 3
    ) {
      debitDate.textContent = "No previous debit";
      return;
    }

    let [yearA, monthA, dayA] = formattedDate.split("/").map(Number);
    let [yearB, monthB, dayB] = dateBString.split("/").map(Number);

    if (
      isNaN(yearA) ||
      isNaN(monthA) ||
      isNaN(dayA) ||
      isNaN(yearB) ||
      isNaN(monthB) ||
      isNaN(dayB)
    ) {
      debitDate.textContent = "Date parse error";
      return;
    }

    let daysA = yearA * 365 + monthA * 30 + dayA;
    let daysB = yearB * 365 + monthB * 30 + dayB;
    let daysPassed = daysA - daysB;
    debitDate.textContent = `${daysPassed} days ago`;
  } catch (error) {
    console.error("Error in calculateDaysDifference:", error);
    debitDate.textContent = "Error calculating days";
  }
}

async function getPreviousDebitDate() {
  const logURL = `${localURI}/debit-log`;
  try {
    let response = await fetch(logURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    // Check if data is an array and has at least one element with lastDebit
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      data[0] &&
      data[0].lastDebit
    ) {
      return data[0].lastDebit;
    } else {
      // Handle missing or malformed data
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
calculateDaysDifference();
//
//
// Backup logic
async function backupStudentData() {
  const backupURL = `${localURI}/backup`;
  try {
    const backupResponse = await fetch(backupURL);
    if (!backupResponse.ok) {
      throw new Error("Error backing up student data");
    }
    const backupData = await backupResponse.json();
    console.log(backupData);
    backupButton.style.backgroundColor = "rgb(37, 37, 170)";
    backupButton.style.color = "white";
    console.log("Backup successful");
  } catch (error) {
    console.error("Backup failed:", error.message);
    alert("Backup failed");
  }
}
//
//
//
async function debitFetchStudent() {
  let URL = `${localURI}/students`;
  let dateURL = `${localURI}/bs-date`;
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
  const patchURL = `${localURI}/debit`;
  const patchDebitDateURL = `${localURI}/debit-log`;
  let dateURL = `${localURI}/bs-date`;
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
      calculateDaysDifference();
      checkbox.checked = true;
      setTimeout(() => {
        checkbox.checked = false;
      }, 3000);
      setTimeout(() => {
        window.location.reload();
      }, 6000);
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
