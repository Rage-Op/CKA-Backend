/**
 * Student Deletion Module
 * Handles searching and deleting students from the database
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    DEFAULT_PHOTO_URL: "./content/user-icon.jpg",
    NOT_FOUND_PHOTO_URL: "./content/user-not-found-icon.jpg",
    ADMIN_PASSWORD: "admin123", // In a real production app, this would not be hardcoded
  };

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Form elements
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

    // Action buttons
    cancelButton: document.querySelector("#admit-button"),
    deleteButton: document.querySelector("#cancel-button"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State keys
  const STATE_KEYS = {
    CURRENT_STUDENT: "delete_currentStudent",
  };

  /**
   * Initialize the application
   */
  function init() {
    // Initialize state
    initializeState();

    // Attach event listeners
    attachEventListeners();

    // Apply theme
    checkStoredTheme();

    // Handle responsive sidebar
    handleResponsiveSidebar();

    // Restore state if available
    restoreState();
  }

  /**
   * Initialize state with default values
   */
  function initializeState() {
    if (!StateManager.getState(STATE_KEYS.CURRENT_STUDENT)) {
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);
    }
  }

  /**
   * Restore state from StateManager
   */
  function restoreState() {
    const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);

    if (currentStudent) {
      // Display student data
      displayStudentData(currentStudent);

      // Add delete event handler
      DOM.deleteButton.addEventListener("click", handleDelete);
      DOM.deleteButton.hasEventListener = true;
    }
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

    // Search form
    DOM.searchButton.addEventListener("click", handleSearch);

    // Form buttons
    DOM.cancelButton.addEventListener("click", handleCancel);

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

    // Subscribe to state changes
    StateManager.subscribe(
      STATE_KEYS.CURRENT_STUDENT,
      handleStudentStateChange
    );
  }

  /**
   * Handle student state changes
   * @param {Object} student - Student data
   */
  function handleStudentStateChange(student) {
    if (student) {
      displayStudentData(student);

      // Add delete event handler if not already added
      if (!DOM.deleteButton.hasEventListener) {
        DOM.deleteButton.addEventListener("click", handleDelete);
        DOM.deleteButton.hasEventListener = true;
      }
    } else {
      resetForm();
    }
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
      UiManager.showNotification(
        "Failed!",
        "Please enter a valid student ID",
        "error"
      );
      return;
    }

    fetchStudent(DOM.searchInput.value.trim());
  }

  /**
   * Handle cancel button click
   */
  function handleCancel() {
    resetForm();
    StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);
  }

  /**
   * Fetch student data from API
   * @param {string} studentId - Student ID to search for
   */
  async function fetchStudent(studentId) {
    setLoading(true);

    try {
      // Fetch student data using API service
      const data = await ApiService.getStudent(studentId);

      // Update state
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, data);

      // Clear search input
      DOM.searchInput.value = "";

      // Show success notification
      UiManager.showNotification("Success!", "Student found", "success");
    } catch (error) {
      handleError("Error fetching student data", error);
      resetForm();
      DOM.photo.style.backgroundImage = `url('${CONFIG.NOT_FOUND_PHOTO_URL}')`;
      UiManager.showNotification("Failed!", "Student not found", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Display student data in the form
   * @param {Object} data - Student data object
   */
  function displayStudentData(data) {
    if (!data) return;

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
   * Handle delete button click
   * @param {Event} event - Click event
   */
  function handleDelete(event) {
    event.preventDefault();

    // Check if safe mode is disabled
    if (!window.CONFIG.isSafeMode()) {
      deleteStudent();
      return;
    }

    // Password confirmation (only in safe mode)
    const userInput = window.prompt("Please enter your password:");

    if (!userInput) {
      return; // User cancelled
    }

    const password = userInput.trim();

    if (password === CONFIG.ADMIN_PASSWORD) {
      deleteStudent();
    } else {
      UiManager.showNotification("Failed!", "Invalid password", "error");
    }
  }

  /**
   * Delete student from database
   */
  async function deleteStudent() {
    setLoading(true);

    // Remove the event listener to prevent multiple submissions
    if (DOM.deleteButton.hasEventListener) {
      DOM.deleteButton.removeEventListener("click", handleDelete);
      DOM.deleteButton.hasEventListener = false;
    }

    try {
      const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);

      if (!currentStudent) {
        throw new Error("No student selected");
      }

      // Send delete request using API service
      await ApiService.deleteStudent(currentStudent.studentId);

      // Show success notification
      UiManager.showNotification(
        "Success!",
        "Student deleted successfully",
        "success"
      );

      // Reset form and state
      resetForm();
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);

      // No page reload needed
    } catch (error) {
      handleError("Error deleting student", error);
      UiManager.showNotification("Failed!", "Delete failed", "error");
    } finally {
      setLoading(false);
    }
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
    DOM.class.textContent = "....................";
    DOM.admitDate.textContent = "....................";
    DOM.gender.textContent = "....................";
    DOM.studentId.textContent = "....................";
    DOM.credit.textContent = 0;
    DOM.debit.textContent = 0;
    DOM.due.textContent = 0;
    DOM.photo.style.backgroundImage = `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
    DOM.searchInput.value = "";

    // Remove delete event handler if exists
    if (DOM.deleteButton.hasEventListener) {
      DOM.deleteButton.removeEventListener("click", handleDelete);
      DOM.deleteButton.hasEventListener = false;
    }
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Whether app is in loading state
   */
  function setLoading(isLoading) {
    // Use UiManager to set loading state
    UiManager.setLoading(
      [
        "#formsearch input",
        "#formsearch button",
        "#admit-button",
        "#cancel-button",
      ],
      isLoading
    );
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
  }

  // Initialize the application
  init();
})();
