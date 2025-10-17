/**
 * Student Addition Module
 * Handles adding new students with proper fee structure management
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    DEFAULT_CLASS: "P.G.",
    DEFAULT_GENDER: "male",
    DEFAULT_PHOTO_URL: "./content/user-icon.jpg",
    NOT_FOUND_PHOTO_URL: "./content/user-not-found-icon.jpg",
  };

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Form elements
    name: document.querySelector("#add-name"),
    dob: document.querySelector("#add-DOB"),
    fatherName: document.querySelector("#add-fname"),
    motherName: document.querySelector("#add-mname"),
    contact: document.querySelector("#add-contact"),
    address: document.querySelector("#add-address"),
    studentId: document.querySelector("#add-studentId"),
    admitDate: document.querySelector("#add-admitdate"),
    due: document.querySelector("#result-due"),
    transport: document.querySelector("#add-transport"),
    diet: document.querySelector("#add-diet"),
    class: document.querySelector("#add-class"),
    gender: document.querySelector("#add-gender"),
    photo: document.querySelector(".photo"),

    // Action buttons
    admitButton: document.querySelector("#admit-button"),
    cancelButton: document.querySelector("#cancel-button"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State keys
  const STATE_KEYS = {
    NEXT_STUDENT_ID: "add_nextStudentId",
    SETTINGS: "add_settings",
    CURRENT_DATE: "add_currentDate",
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

    // Get student ID and date
    getStudentId();

    // Restore state if available
    restoreState();
  }

  /**
   * Initialize state with default values
   */
  function initializeState() {
    if (!StateManager.getState(STATE_KEYS.NEXT_STUDENT_ID)) {
      StateManager.setState(STATE_KEYS.NEXT_STUDENT_ID, null);
    }

    if (!StateManager.getState(STATE_KEYS.SETTINGS)) {
      StateManager.setState(STATE_KEYS.SETTINGS, null);
    }

    if (!StateManager.getState(STATE_KEYS.CURRENT_DATE)) {
      StateManager.setState(STATE_KEYS.CURRENT_DATE, null);
    }
  }

  /**
   * Restore state from StateManager
   */
  function restoreState() {
    const nextStudentId = StateManager.getState(STATE_KEYS.NEXT_STUDENT_ID);
    const currentDate = StateManager.getState(STATE_KEYS.CURRENT_DATE);

    if (nextStudentId) {
      DOM.studentId.textContent = nextStudentId;
    }

    if (currentDate) {
      DOM.admitDate.textContent = currentDate;
    }
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

    // Form buttons
    DOM.admitButton.addEventListener("click", handleAdmit);
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
      STATE_KEYS.NEXT_STUDENT_ID,
      handleStudentIdStateChange
    );
    StateManager.subscribe(STATE_KEYS.CURRENT_DATE, handleDateStateChange);
  }

  /**
   * Handle student ID state changes
   * @param {number} studentId - Next student ID
   */
  function handleStudentIdStateChange(studentId) {
    if (studentId) {
      DOM.studentId.textContent = studentId;
    }
  }

  /**
   * Handle date state changes
   * @param {string} date - Current date
   */
  function handleDateStateChange(date) {
    if (date) {
      DOM.admitDate.textContent = date;
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
   * Get next available student ID
   */
  async function getStudentId() {
    setLoading(true);

    try {
      // Get next student ID using API service
      const students = await ApiService.getStudents();

      // Set next student ID
      let nextStudentId;
      if (students.length === 0) {
        nextStudentId = 1;
      } else {
        nextStudentId = Number(students[0].studentId) + 1;
      }

      // Update state
      StateManager.setState(STATE_KEYS.NEXT_STUDENT_ID, nextStudentId);

      // Get current date
      await fetchCurrentDate();
    } catch (error) {
      handleError("Error fetching student ID", error);
      UiManager.showNotification(
        "Failed!",
        "Could not fetch student ID",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch current date in BS format
   */
  async function fetchCurrentDate() {
    try {
      // Get current date using API service
      const dateStr = await ApiService.getCurrentDate();

      // Update state
      StateManager.setState(STATE_KEYS.CURRENT_DATE, dateStr);
    } catch (error) {
      handleError("Error fetching current date", error);
      UiManager.showNotification(
        "Failed!",
        "Could not fetch current date",
        "error"
      );
    }
  }

  /**
   * Handle admit button click
   * @param {Event} event - Click event
   */
  function handleAdmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      UiManager.showNotification(
        "Failed!",
        "Please fill all required fields",
        "error"
      );
      return;
    }

    fetchSettings();
  }

  /**
   * Handle cancel button click
   * @param {Event} event - Click event
   */
  function handleCancel(event) {
    event.preventDefault();
    resetForm();
  }

  /**
   * Fetch settings data for fee structure
   */
  async function fetchSettings() {
    setLoading(true);

    try {
      // Ensure we have the latest student ID
      const students = await ApiService.getStudents();

      // Update next student ID
      let nextStudentId;
      if (students.length === 0) {
        nextStudentId = 1;
      } else {
        nextStudentId = Number(students[0].studentId) + 1;
      }

      // Update state
      StateManager.setState(STATE_KEYS.NEXT_STUDENT_ID, nextStudentId);

      // Fetch settings using API service
      const settings = await ApiService.getSettings();

      // Update state
      StateManager.setState(STATE_KEYS.SETTINGS, settings[0]);

      // Add student with fetched settings
      addStudent(nextStudentId, StateManager.getState(STATE_KEYS.CURRENT_DATE));
    } catch (error) {
      handleError("Error fetching settings", error);
      UiManager.showNotification(
        "Failed!",
        "Student admission failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Add a new student to the database
   * @param {number} studentId - Student ID
   * @param {string} admitDate - Admission date
   */
  async function addStudent(studentId, admitDate) {
    setLoading(true);

    try {
      const settings = StateManager.getState(STATE_KEYS.SETTINGS);

      if (!settings) {
        throw new Error("Settings not available");
      }

      // Determine monthly fees based on class
      let monthlyFees = determineMonthlyFees(DOM.class.value, settings);

      // Prepare student data
      const studentData = {
        name: DOM.name.value,
        gender: DOM.gender.value,
        class: DOM.class.value,
        studentId: studentId,
        DOB: DOM.dob.value,
        admitDate: admitDate,
        fatherName: DOM.fatherName.value,
        motherName: DOM.motherName.value,
        contact: DOM.contact.value,
        address: DOM.address.value,
        transport: DOM.transport.checked,
        diet: DOM.diet.checked,
        monthlyFees: monthlyFees,
        transportFees: settings.transport,
        dietFees: settings.diet,
        examFees: settings.exam,
        debitAmount: [
          {
            date: "previous year",
            amount: 0,
            remark: "OLD DUE!",
          },
        ],
        creditAmount: [
          {
            date: "starting year",
            amount: 0,
            bill: "DISCOUNT!",
          },
        ],
        fees: {
          debit: 0,
          credit: 0,
        },
        photo: `https://raw.githubusercontent.com/Rage-Op/imageResource/main/${studentId}.jpg`,
      };

      // Send request to add student using API service
      await ApiService.addStudent(studentData);

      // Show success notification
      UiManager.showNotification(
        "Success!",
        "Student added successfully",
        "success"
      );

      // Reset form and get new student ID
      resetForm();
      getStudentId();

      // No page reload needed
    } catch (error) {
      handleError("Error adding student", error);
      UiManager.showNotification(
        "Failed!",
        "Student admission failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Determine monthly fees based on class
   * @param {string} classValue - Selected class
   * @param {Object} settings - Settings object
   * @returns {number} - Monthly fees amount
   */
  function determineMonthlyFees(classValue, settings) {
    switch (classValue) {
      case "P.G.":
        return settings.monthlyPG;
      case "K.G.":
        return settings.monthlyKG;
      case "nursery":
        return settings.monthlyNursery;
      case "1":
        return settings.monthly1;
      case "2":
        return settings.monthly2;
      case "3":
        return settings.monthly3;
      case "4":
        return settings.monthly4;
      case "5":
        return settings.monthly5;
      case "6":
        return settings.monthly6;
      default:
        return settings.monthlyPG;
    }
  }

  /**
   * Reset form to default values
   */
  function resetForm() {
    DOM.name.value = "";
    DOM.dob.value = "";
    DOM.fatherName.value = "";
    DOM.motherName.value = "";
    DOM.contact.value = "";
    DOM.address.value = "";
    DOM.transport.checked = false;
    DOM.diet.checked = false;
    DOM.class.value = CONFIG.DEFAULT_CLASS;
    DOM.gender.value = CONFIG.DEFAULT_GENDER;
  }

  /**
   * Validate form fields
   * @returns {boolean} - Whether form is valid
   */
  function validateForm() {
    return (
      DOM.name.value.trim() !== "" &&
      DOM.dob.value.trim() !== "" &&
      DOM.fatherName.value.trim() !== "" &&
      DOM.motherName.value.trim() !== "" &&
      DOM.contact.value.trim() !== "" &&
      DOM.address.value.trim() !== ""
    );
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Whether app is in loading state
   */
  function setLoading(isLoading) {
    // Use UiManager to set loading state
    UiManager.setLoading(
      [
        "#add-name",
        "#add-DOB",
        "#add-fname",
        "#add-mname",
        "#add-contact",
        "#add-address",
        "#add-transport",
        "#add-diet",
        "#add-class",
        "#add-gender",
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
