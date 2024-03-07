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

const indexDate = document.querySelector("#index-date");
const indexStudents = document.querySelector("#index-students");
const indexDue = document.querySelector("#index-due");
const listItems = document.querySelectorAll(".autosave-items");
const itemsCheck = document.querySelectorAll(".task-complete");

itemsCheck.forEach((item) => {
  item.addEventListener("click", function () {
    const inputElement = this.parentNode.querySelector(".autosave-items");
    inputElement.value = "";
  });
});

let j = 0;
listItems.forEach((input) => {
  input.value = localStorage.getItem(`listValue${j}`);
  j++;
});
setInterval(() => {
  let i = 0;
  listItems.forEach((input) => {
    localStorage.setItem(`listValue${i}`, input.value);
    i++;
  });
}, 1000);

async function fetchData() {
  try {
    // Fetch student data
    let response = await fetch("https://cka-backend.onrender.com/students");
    if (!response.ok) {
      throw new Error("Failed to fetch student data");
    }
    let data = await response.json();

    // Update student count
    let studentCount = data.length;
    indexStudents.innerText = studentCount;

    // Find top 3 students with highest due
    findTop3StudentsWithHighestDue(data);

    // Fetch date data
    let dateURL = "https://cka-backend.onrender.com/bs-date";
    let responseDate = await fetch(dateURL);
    if (!responseDate.ok) {
      throw new Error("Failed to fetch date data");
    }
    let datetimeStr = await responseDate.json();

    // Update date display
    const datePart = datetimeStr.split(" ")[0];
    const parts = datePart.split("-");
    const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
    indexDate.innerText = formattedDate;

    // Calculate total due
    let totalDue = 0;
    data.forEach((student) => {
      let due = student.fees.debit - student.fees.credit;
      totalDue += due;
    });

    // Update total due display
    indexDue.innerText = `Rs. ${totalDue}`;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error gracefully (e.g., display error message to the user)
  }
}

// get top 3 highest due students
function findTop3StudentsWithHighestDue(students) {
  let top3Students = [];

  students.forEach((student) => {
    let due = student.fees.debit - student.fees.credit;
    if (top3Students.length < 3) {
      top3Students.push({ student, due });
      top3Students.sort((a, b) => b.due - a.due);
    } else {
      if (due > top3Students[2].due) {
        top3Students.pop();
        top3Students.push({ student, due });
        top3Students.sort((a, b) => b.due - a.due);
      }
    }
  });

  top3Students.forEach((student) => {
    let newRow = document.createElement("tr");
    newRow.innerHTML = `<td>
    <p><h5>${student.student.studentId}-${student.student.name}-${student.student.class}</h5></p>
  </td>
  <td>
    <p><h5>${student.student.contact}</h5></p>
  </td>
  <td>
    <p><h5>Rs. ${student.due}</h5></p>
  </td>`;
    document.querySelector("#index-due-fees-body").appendChild(newRow);
  });
}

// MAIN LOGIC
// MAIN LOGIC
// MAIN LOGIC

const sideLinks = document.querySelectorAll(
  ".sidebar .side-menu li a:not(.logout)"
);

window.addEventListener("load", () => {
  fetchData();
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }
});

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
