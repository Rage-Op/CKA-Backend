/**
 * Student Search Module
 * Handles searching for students and displaying their information
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
  };

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Search form
    searchForm: document.querySelector("#formsearch"),
    searchButton: document.querySelector("#formsearch button"),
    searchInput: document.querySelector("#formsearch input"),

    // Student data display elements
    name: document.querySelector("#result-name"),
    dob: document.querySelector("#result-DOB"),
    fatherName: document.querySelector("#result-fname"),
    motherName: document.querySelector("#result-mname"),
    contact: document.querySelector("#result-contact"),
    address: document.querySelector("#result-address"),
    class: document.querySelector("#result-class"),
    admitDate: document.querySelector("#result-admit-date"),
    transport: document.querySelector("#result-transport"),
    diet: document.querySelector("#result-diet"),
    gender: document.querySelector("#result-gender"),
    studentId: document.querySelector("#result-student-id"),
    credit: document.querySelector("#result-credit"),
    debit: document.querySelector("#result-debit"),
    due: document.querySelector("#result-due"),
    photo: document.querySelector(".photo"),

    // Students table
    studentsTableBody: document.querySelector("#students-table-body"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State management
  let STATE = {
    students: [],
    currentStudent: null,
    isLoading: false,
  };

  /**
   * Initialize the application
   */
  function init() {
    attachEventListeners();
    checkStoredTheme();
    handleResponsiveSidebar();
    fetchAllStudents();
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

    // Search form
    DOM.searchButton.addEventListener("click", handleSearch);

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
   * Handle search form submission
   * @param {Event} event - Form submission event
   */
  function handleSearch(event) {
    event.preventDefault();

    if (!DOM.searchInput.value.trim()) {
      showNotification("Failed!", "Please enter a valid student ID", "error");
      return;
    }

    fetchStudent(DOM.searchInput.value.trim());
  }

  /**
   * Fetch all students from API
   */
  async function fetchAllStudents() {
    setLoading(true);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/ascending-students`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch students (Status: ${response.status})`
        );
      }

      STATE.students = await response.json();

      // Display students in table
      displayStudentsTable(STATE.students);
    } catch (error) {
      handleError("Error fetching all students", error);
      showNotification("Failed!", "Could not load students", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Display students in the table
   * @param {Array} students - List of students
   */
  function displayStudentsTable(students) {
    // Clear existing table content
    DOM.studentsTableBody.innerHTML = "";

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

      DOM.studentsTableBody.appendChild(row);
    });
  }

  /**
   * Display student details in the top section
   * @param {Object} student - Student data object
   */
  function displayStudentDetails(student) {
    // Update state
    STATE.currentStudent = student;

    // Display student data
    DOM.name.textContent = student.name;
    DOM.dob.textContent = student.DOB;
    DOM.fatherName.textContent = student.fatherName;
    DOM.motherName.textContent = student.motherName;
    DOM.contact.textContent = student.contact;
    DOM.address.textContent = student.address;
    DOM.class.textContent = student.class;
    DOM.admitDate.textContent = student.admitDate;
    DOM.transport.textContent = student.transport;
    DOM.diet.textContent = student.diet;
    DOM.gender.textContent = student.gender;
    DOM.studentId.textContent = student.studentId;
    DOM.credit.textContent = student.fees.credit;
    DOM.debit.textContent = student.fees.debit;
    DOM.due.textContent = student.fees.debit - student.fees.credit;

    // Set photo
    DOM.photo.style.backgroundImage = student.photo
      ? `url(${student.photo})`
      : `url('${CONFIG.DEFAULT_PHOTO_URL}')`;

    // Show success notification
    showNotification("Success!", "Student found", "success");

    // Scroll to the top to see the student details
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Fetch student data from API by ID
   * @param {string} studentId - Student ID to search for
   */
  async function fetchStudent(studentId) {
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

      // Display student data
      displayStudentData(data);

      // Clear search input
      DOM.searchInput.value = "";

      // Show success notification
      showNotification("Success!", "Student found", "success");
    } catch (error) {
      handleError("Error fetching student data", error);
      resetForm();
      DOM.photo.style.backgroundImage = `url('${CONFIG.NOT_FOUND_PHOTO_URL}')`;
      showNotification("Failed!", "Student not found", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Display student data in the form
   * @param {Object} data - Student data object
   */
  function displayStudentData(data) {
    // Update state
    STATE.currentStudent = data;

    // Display student data
    DOM.name.textContent = data.name;
    DOM.dob.textContent = data.DOB;
    DOM.fatherName.textContent = data.fatherName;
    DOM.motherName.textContent = data.motherName;
    DOM.contact.textContent = data.contact;
    DOM.address.textContent = data.address;
    DOM.class.textContent = data.class;
    DOM.admitDate.textContent = data.admitDate;
    DOM.transport.textContent = data.transport;
    DOM.diet.textContent = data.diet;
    DOM.gender.textContent = data.gender;
    DOM.studentId.textContent = data.studentId;
    DOM.credit.textContent = data.fees.credit;
    DOM.debit.textContent = data.fees.debit;
    DOM.due.textContent = data.fees.debit - data.fees.credit;

    // Set photo
    DOM.photo.style.backgroundImage = data.photo
      ? `url(${data.photo})`
      : `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
  }

  /**
   * Reset form to default values
   */
  function resetForm() {
    DOM.name.textContent = "....................";
    DOM.dob.textContent = "....................";
    DOM.fatherName.textContent = "....................";
    DOM.motherName.textContent = "....................";
    DOM.contact.textContent = "....................";
    DOM.address.textContent = "....................";
    DOM.transport.textContent = "....................";
    DOM.diet.textContent = "....................";
    DOM.gender.textContent = "....................";
    DOM.studentId.textContent = "....................";
    DOM.credit.textContent = 0;
    DOM.debit.textContent = 0;
    DOM.due.textContent = 0;
    DOM.photo.style.backgroundImage = `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
    DOM.searchInput.value = "";

    // Reset state
    STATE.currentStudent = null;
  }

  /**
   * Show notification to user
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success' or 'error')
   */
  function showNotification(title, message, type = "success") {
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
    const formElements = [DOM.searchInput, DOM.searchButton];

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
