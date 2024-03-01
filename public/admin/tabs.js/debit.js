// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC
let checkbox = document.querySelector(".debit-sucess-checkbox");
let debitDate = document.querySelector("#debit-date");
let debitButton = document.querySelector("#debit-button");
let examCbx = document.querySelector("#exam-checkbox");

debitButton.addEventListener("click", (event) => {
  event.preventDefault();
  debitFetchStudent();
});
//
//
// previous debit logic
async function calculateDaysDifference() {
  const currentDebitDate = new Date();
  const currentDateString = currentDebitDate
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "/");
  const dateBString = await getPreviousDebitDate(); // Example Date B
  const dateB = new Date(dateBString);
  const timeDifference = currentDebitDate - dateB;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  debitDate.textContent = `${daysDifference} days ago`;
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
      let newDebitDate = formattedDate;
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
