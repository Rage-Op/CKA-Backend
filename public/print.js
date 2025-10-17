/**
 * Print Management Module
 * Handles printing fee notices and admission forms
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    API_BASE_URL: window.location.origin,
    NOTIFICATION_TIMEOUT: 2000,
    DEFAULT_PHOTO_URL: "./content/user-icon.jpg",
    NOT_FOUND_PHOTO_URL: "./content/user-not-found-icon.jpg",
    BATCH_SIZE: 12, // Number of students to process in each batch
  };

  // Nepali BS months
  const BS_MONTHS = [
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

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Print elements
    printButton: document.getElementById("printButton"),
    admissionFormPrintButton: document.getElementById(
      "admission-form-print-button"
    ),
    nextButton: document.querySelector("#print-next-button"),
    feesTableBody: document.querySelector("#fee-due-table-body"),
    printStudentId: document.querySelector("#print-studentId"),
    printDate: document.querySelector("#print-date"),

    // Search form
    searchForm: document.querySelector("#formsearch"),
    searchButton: document.querySelector("#formsearch button"),
    searchInput: document.querySelector("#formsearch input"),

    // Admission form elements
    formDate: document.querySelector("#form-date"),
    formName: document.querySelector("#form-name"),
    formClass: document.querySelector("#form-class"),
    formDOB: document.querySelector("#form-DOB"),
    formStudentId: document.querySelector("#form-student-id"),
    formGenderMale: document.querySelector("#form-gender-male"),
    formGenderFemale: document.querySelector("#form-gender-female"),
    formFname: document.querySelector("#form-fname"),
    formMname: document.querySelector("#form-mname"),
    formNationality: document.querySelector("#form-nationality"),
    formZipCode: document.querySelector("#form-zip-code"),
    formTransport: document.querySelector("#form-transport"),
    formDiet: document.querySelector("#form-diet"),
    formMobile: document.querySelector("#form-mobile"),
    formWhatsapp: document.querySelector("#form-whatsapp"),
    formFacebook: document.querySelector("#form-facebook"),
    formPrevSchoolName: document.querySelector("#form-prev-shool-name"),
    formPrevSchoolClass: document.querySelector("#form-prev-shool-class"),
    formAddress: document.querySelector("#form-address"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State management
  let STATE = {
    students: [],
    batchIndex: 0,
    currentDate: null,
    isLoading: false,
  };

  /**
   * Initialize the application
   */
  function init() {
    attachEventListeners();
    checkStoredTheme();
    handleResponsiveSidebar();
    loadStudentData();
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

    // Print buttons
    if (DOM.printButton) {
      DOM.printButton.addEventListener("click", handlePrintClick);
    }

    if (DOM.admissionFormPrintButton) {
      DOM.admissionFormPrintButton.addEventListener(
        "click",
        handleAdmissionFormPrintClick
      );
    }

    if (DOM.nextButton) {
      DOM.nextButton.addEventListener("click", handleNextButtonClick);
    }

    // Search form
    if (DOM.searchButton) {
      DOM.searchButton.addEventListener("click", handleSearch);
    }

    // Sidebar toggle
    const menuBar = document.querySelector(".content nav .bx.bx-menu");
    if (menuBar) {
      menuBar.addEventListener("click", toggleSidebar);
    }

    // Sidebar links
    const sideLinks = document.querySelectorAll(
      ".sidebar .side-menu li a:not(.logout)"
    );
    sideLinks.forEach(attachSidebarLinkHandler);

    // Window resize
    window.addEventListener("resize", handleResponsiveSidebar);
    window.addEventListener("load", handleResponsiveSidebar);
  }

  /**
   * Check and apply stored theme preference
   */
  function checkStoredTheme() {
    const darkTheme = localStorage.getItem("darkTheme") === "true";
    DOM.themeToggle.checked = darkTheme;
    document.body.classList.toggle("dark", darkTheme);
  }

  /**
   * Handle theme toggle changes
   */
  function handleThemeToggle() {
    const isDarkTheme = this.checked;
    document.body.classList.toggle("dark", isDarkTheme);
    localStorage.setItem("darkTheme", isDarkTheme);
  }

  /**
   * Handle responsive sidebar behavior
   */
  function handleResponsiveSidebar() {
    if (window.innerWidth < 768) {
      DOM.sideBar.classList.add("close");
    } else {
      DOM.sideBar.classList.remove("close");
    }
  }

  /**
   * Toggle sidebar open/close
   */
  function toggleSidebar() {
    DOM.sideBar.classList.toggle("close");
  }

  /**
   * Attach click handler to sidebar links
   * @param {HTMLElement} item - Sidebar link element
   */
  function attachSidebarLinkHandler(item) {
    const li = item.parentElement;
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".sidebar .side-menu li a:not(.logout)")
        .forEach((i) => i.parentElement.classList.remove("active"));
      li.classList.add("active");
    });
  }

  /**
   * Handle print button click
   */
  function handlePrintClick() {
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
  }

  /**
   * Handle admission form print button click
   */
  function handleAdmissionFormPrintClick() {
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
  }

  /**
   * Handle next button click
   */
  function handleNextButtonClick() {
    if (STATE.batchIndex < STATE.students.length) {
      DOM.feesTableBody.innerHTML = "";
      updateStudentIdRange();
      generateTable();
      STATE.batchIndex += CONFIG.BATCH_SIZE;
    } else {
      showNotification("Info", "No more students to display", "info");
    }
  }

  /**
   * Handle search form submission
   * @param {Event} event - Form submission event
   */
  function handleSearch(event) {
    event.preventDefault();

    if (!DOM.searchInput.value.trim()) {
      showNotification("Failed!", "Please enter a valid student ID", "error");
      return;
    }

    fetchStudentForForm(DOM.searchInput.value.trim());
  }

  /**
   * Load student data for printing
   */
  async function loadStudentData() {
    setLoading(true);

    try {
      // Fetch students in ascending order
      const response = await fetch(`${CONFIG.API_BASE_URL}/ascending-students`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch students (Status: ${response.status})`
        );
      }

      STATE.students = await response.json();

      // Fetch current date
      await fetchCurrentDate();

      // Update student ID range
      updateStudentIdRange();

      // Generate fee notice table
      generateTable();

      // Update batch index
      STATE.batchIndex = CONFIG.BATCH_SIZE;
    } catch (error) {
      handleError("Error loading student data", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch current date in BS format
   */
  async function fetchCurrentDate() {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/bs-date`);

      if (!response.ok) {
        throw new Error(`Failed to fetch date (Status: ${response.status})`);
      }

      const datetimeStr = await response.json();
      const datePart = datetimeStr.split(" ")[0];
      const parts = datePart.split("-");
      const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;

      STATE.currentDate = formattedDate;

      if (DOM.printDate) {
        DOM.printDate.textContent = formattedDate;
      }
    } catch (error) {
      handleError("Error fetching current date", error);
    }
  }

  /**
   * Update student ID range display
   */
  function updateStudentIdRange() {
    if (!DOM.printStudentId) return;

    if (STATE.batchIndex < STATE.students.length) {
      let endIndex = STATE.batchIndex + CONFIG.BATCH_SIZE;

      if (endIndex > STATE.students.length) {
        endIndex = STATE.students.length;
      }

      DOM.printStudentId.textContent = `${STATE.batchIndex + 1} - ${endIndex}`;
    }
  }

  /**
   * Generate fee notice table
   */
  function generateTable() {
    if (!DOM.feesTableBody || !STATE.currentDate) return;

    // Parse date parts
    const [year, month, day] = STATE.currentDate.split("/");
    const currentMonth = BS_MONTHS[parseInt(month) - 1];

    // Process students in current batch
    for (
      let i = STATE.batchIndex;
      i < STATE.batchIndex + CONFIG.BATCH_SIZE;
      i += 2
    ) {
      // Check if we have enough students
      if (!STATE.students[i] && !STATE.students[i + 1]) {
        break;
      } else if (STATE.students[i] && !STATE.students[i + 1]) {
        // Only one student left
        createSingleStudentRow(STATE.students[i], currentMonth);
      } else {
        // Two students available
        createDoubleStudentRow(
          STATE.students[i],
          STATE.students[i + 1],
          currentMonth
        );
      }
    }
  }

  /**
   * Create table row with a single student
   * @param {Object} student - Student object
   * @param {string} currentMonth - Current month name
   */
  function createSingleStudentRow(student, currentMonth) {
    const pronoun = student.gender === "male" ? "son" : "daughter";
    const due = student.fees.debit - student.fees.credit;

    const row = document.createElement("tr");

    row.innerHTML = `
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
            <p style="text-align: center">Student Id: <b>${student.studentId}</b></p>
            <p>
              Dear Parents, your ${pronoun}
              <b>${student.name}</b> who studies in class
              <b>${student.class}</b> has pending due up to the month of
              <b>${currentMonth}</b> of Rs. <b>${due}</b>.So, please pay the fee
              within 5 days.
            </p>
          </div>
          <div class="box-bottom">
            <p>Date: <b>${STATE.currentDate}</b></p>
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
      </td>
    `;

    DOM.feesTableBody.appendChild(row);
  }

  /**
   * Create table row with two students
   * @param {Object} student1 - First student object
   * @param {Object} student2 - Second student object
   * @param {string} currentMonth - Current month name
   */
  function createDoubleStudentRow(student1, student2, currentMonth) {
    const pronoun1 = student1.gender === "male" ? "son" : "daughter";
    const pronoun2 = student2.gender === "male" ? "son" : "daughter";

    const due1 = student1.fees.debit - student1.fees.credit;
    const due2 = student2.fees.debit - student2.fees.credit;

    const row = document.createElement("tr");

    row.innerHTML = `
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
            <p style="text-align: center">Student Id: <b>${student1.studentId}</b></p>
            <p>
              Dear Parents, your ${pronoun1}
              <b>${student1.name}</b> who studies in class
              <b>${student1.class}</b> has pending due up to the month of
              <b>${currentMonth}</b> of Rs. <b>${due1}</b>.So, please pay the fee
              within 5 days.
            </p>
          </div>
          <div class="box-bottom">
            <p>Date: <b>${STATE.currentDate}</b></p>
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
            <p style="text-align: center">Student Id: <b>${student2.studentId}</b></p>
            <p>
              Dear Parents, your ${pronoun2}
              <b>${student2.name}</b> who studies in class
              <b>${student2.class}</b> has pending due up to the month of
              <b>${currentMonth}</b> of Rs. <b>${due2}</b>.So, please pay the fee
              within 5 days.
            </p>
          </div>
          <div class="box-bottom">
            <p>Date: <b>${STATE.currentDate}</b></p>
            <p>Accountant</p>
          </div>
        </div>
      </td>
    `;

    DOM.feesTableBody.appendChild(row);
  }

  /**
   * Fetch student data for admission form
   * @param {string} studentId - Student ID to search for
   */
  async function fetchStudentForForm(studentId) {
    setLoading(true);

    try {
      // Convert to number if possible
      const numericId = Number(studentId);
      const searchId = isNaN(numericId) ? studentId : numericId;

      // Fetch student data
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/students/search/${searchId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch student (Status: ${response.status})`);
      }

      const data = await response.json();

      // Clear search input
      DOM.searchInput.value = "";

      // Populate admission form
      populateAdmissionForm(data);

      // Show success notification
      showNotification("Success!", "Student found", "success");
    } catch (error) {
      handleError("Error fetching student data", error);
      showNotification("Failed!", "Student not found", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Populate admission form with student data
   * @param {Object} data - Student data object
   */
  function populateAdmissionForm(data) {
    if (!DOM.formDate) return;

    DOM.formDate.value = data.admitDate;
    DOM.formName.value = data.name;
    DOM.formClass.value = data.class;
    DOM.formDOB.value = data.DOB;
    DOM.formStudentId.value = data.studentId;

    // Set gender
    if (data.gender === "male") {
      DOM.formGenderMale.checked = true;
      DOM.formGenderFemale.checked = false;
    } else {
      DOM.formGenderMale.checked = false;
      DOM.formGenderFemale.checked = true;
    }

    DOM.formFname.value = data.fatherName;
    DOM.formMname.value = data.motherName;
    DOM.formNationality.value = "";
    DOM.formZipCode.value = "";

    // Set transport and diet
    DOM.formTransport.checked = data.transport === true;
    DOM.formDiet.checked = data.diet === true;

    DOM.formMobile.value = data.contact;
    DOM.formWhatsapp.value = "";
    DOM.formFacebook.value = "";
  }

  /**
   * Show notification to user
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success', 'error', or 'info')
   */
  function showNotification(title, message, type = "success") {
    if (!DOM.notice) return;

    DOM.notice.innerHTML = `<h4>${title}</h4><p>${message}</p>`;

    if (type === "error") {
      DOM.notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
      DOM.notice.style.border = "1px solid #D32F2F";
    } else {
      DOM.notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
      DOM.notice.style.border = "1px solid #50c156";
    }

    DOM.notice.style.opacity = "100";

    setTimeout(() => {
      DOM.notice.style.opacity = "0";

      // Reset to default success style after hiding
      if (type === "error") {
        setTimeout(() => {
          DOM.notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
          DOM.notice.style.border = "1px solid #50c156";
          DOM.notice.innerHTML = "<h4>Success!</h4><p>Student found</p>";
        }, 300);
      }
    }, CONFIG.NOTIFICATION_TIMEOUT);
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Whether app is in loading state
   */
  function setLoading(isLoading) {
    STATE.isLoading = isLoading;

    // Disable/enable form elements based on loading state
    const formElements = [
      DOM.searchInput,
      DOM.searchButton,
      DOM.printButton,
      DOM.admissionFormPrintButton,
      DOM.nextButton,
    ];

    formElements.forEach((element) => {
      if (element) element.disabled = isLoading;
    });

    // Add loading indicator if needed
    // This could be a spinner or other visual indicator
  }

  /**
   * Handle errors
   * @param {string} context - Error context
   * @param {Error} error - Error object
   */
  function handleError(context, error) {
    // In production, you might want to log to a service instead of console
    if (process.env.NODE_ENV !== "production") {
      console.error(`${context}: ${error.message}`);
    }

    // Additional error handling could go here
    // e.g., sending errors to a monitoring service
  }

  // Initialize the application
  init();
})();
