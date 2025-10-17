/**
 * Student Fees Management Module
 * Handles viewing and managing student fees, credits and debits
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    NOTIFICATION_TIMEOUT: 2000,
    DEFAULT_PHOTO_URL: "./content/user-icon.jpg",
    NOT_FOUND_PHOTO_URL: "./content/user-not-found-icon.jpg",
    ADMIN_PASSWORD: "admin123", // In a real production app, this would not be hardcoded
    SUCCESS_CHECKBOX_TIMEOUT: 3000,
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
    name: document.querySelector("#fees-name"),
    class: document.querySelector("#fees-class"),
    studentId: document.querySelector("#fees-studentId"),
    date: document.querySelector("#fees-date"),
    debit: document.querySelector("#result-debit"),
    credit: document.querySelector("#result-credit"),
    due: document.querySelector("#result-due"),
    creditAmount: document.querySelector("#credit-amount"),
    creditBill: document.querySelector("#credit-bill"),
    photo: document.querySelector("#fees-photo"),

    // Tables
    debitColumn: document.querySelector("#debit-column"),
    creditColumn: document.querySelector("#credit-column"),

    // Action buttons
    creditButton: document.querySelector("#admit-button"),
    cancelButton: document.querySelector("#cancel-button"),
    creditCheckbox: document.querySelector(".credit-sucess-checkbox"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State keys
  const STATE_KEYS = {
    CURRENT_STUDENT: "fees_currentStudent",
    CURRENT_DATE: "fees_currentDate",
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

    // Get current date
    getBsDate();

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

    if (!StateManager.getState(STATE_KEYS.CURRENT_DATE)) {
      StateManager.setState(STATE_KEYS.CURRENT_DATE, null);
    }
  }

  /**
   * Restore state from StateManager
   */
  function restoreState() {
    const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);
    const currentDate = StateManager.getState(STATE_KEYS.CURRENT_DATE);

    // Restore current date if available
    if (currentDate) {
      DOM.date.textContent = currentDate;
    }

    // Restore student data if available
    if (currentStudent) {
      displayStudentData(currentStudent);

      // Add credit event handler
      DOM.creditButton.addEventListener("click", handleCreditClick);
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
    StateManager.subscribe(STATE_KEYS.CURRENT_DATE, handleDateStateChange);
  }

  /**
   * Handle student state changes
   * @param {Object} student - Student data
   */
  function handleStudentStateChange(student) {
    if (student) {
      displayStudentData(student);
    } else {
      resetForm();
    }
  }

  /**
   * Handle date state changes
   * @param {string} date - Current date
   */
  function handleDateStateChange(date) {
    if (date) {
      DOM.date.textContent = date;
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

    // Clear previous data
    const studentId = DOM.searchInput.value.trim();
    StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);
    UiManager.clearElement("#debit-column");
    UiManager.clearElement("#credit-column");

    fetchStudent(studentId);

    // Clear search input
    DOM.searchInput.value = "";
  }

  /**
   * Handle cancel button click
   * @param {Event} event - Click event
   */
  function handleCancel(event) {
    event.preventDefault();
    resetForm();
    StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);
  }

  /**
   * Get current date in BS format and display it
   */
  async function getBsDate() {
    try {
      const dateStr = await ApiService.getCurrentDate();
      const formattedDate = ApiService.formatBSDate(dateStr);

      // Update state
      StateManager.setState(STATE_KEYS.CURRENT_DATE, formattedDate);

      // Update UI
      DOM.date.textContent = formattedDate;
    } catch (error) {
      handleError("Error fetching current date", error);
      DOM.date.textContent = "Date unavailable";
    }
  }

  /**
   * Fetch student data from API
   * @param {string} studentId - Student ID to fetch
   */
  async function fetchStudent(studentId) {
    if (!studentId) {
      UiManager.showNotification("Failed!", "No student ID provided", "error");
      return;
    }

    // Clear previous data
    UiManager.clearElement("#debit-column");
    UiManager.clearElement("#credit-column");

    // Set loading state
    setLoading(true);

    try {
      // Fetch student data using API service
      const data = await ApiService.getStudent(studentId);

      // Update state
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, data);

      // Display student data
      displayStudentData(data);

      // Add credit event handler
      DOM.creditButton.addEventListener("click", handleCreditClick);

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

    // Display basic student info
    DOM.name.textContent = data.name;
    DOM.studentId.textContent = data.studentId;
    DOM.class.textContent = data.class;
    DOM.credit.textContent = data.fees.credit;
    DOM.debit.textContent = data.fees.debit;
    DOM.due.textContent = data.fees.debit - data.fees.credit;

    // Set photo
    DOM.photo.style.backgroundImage = data.photo
      ? `url(${data.photo})`
      : `url('${CONFIG.DEFAULT_PHOTO_URL}')`;

    // Display debit entries
    displayDebitEntries(data.debitAmount);

    // Display credit entries
    displayCreditEntries(data.creditAmount);
  }

  /**
   * Display debit entries in the table
   * @param {Array} debitEntries - Array of debit entries
   */
  function displayDebitEntries(debitEntries) {
    UiManager.clearElement("#debit-column");

    debitEntries.forEach((entry) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.innerHTML = `
        <div class="box">
          <h5>${entry.date}</h5>
          <p>Nrs. ${entry.amount}</p>
          <p>${entry.remark}</p>
        </div>
      `;

      row.appendChild(cell);
      DOM.debitColumn.appendChild(row);
    });
  }

  /**
   * Display credit entries in the table
   * @param {Array} creditEntries - Array of credit entries
   */
  function displayCreditEntries(creditEntries) {
    UiManager.clearElement("#credit-column");

    creditEntries.forEach((entry) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.innerHTML = `
        <div class="box">
          <h5>${entry.date}</h5>
          <p>Nrs. ${entry.amount}</p>
          <p>Bill No. ${entry.bill}</p>
        </div>
      `;

      row.appendChild(cell);
      DOM.creditColumn.appendChild(row);
    });
  }

  /**
   * Handle credit button click
   * @param {Event} event - Click event
   */
  function handleCreditClick(event) {
    event.preventDefault();

    // Check if safe mode is disabled
    if (!window.CONFIG.isSafeMode()) {
      processCreditEntry();
      return;
    }

    // Password confirmation (only in safe mode)
    const userInput = window.prompt("Please enter your password:");

    if (!userInput) {
      return; // User cancelled
    }

    const password = userInput.trim();

    if (password === CONFIG.ADMIN_PASSWORD) {
      processCreditEntry();
    } else {
      window.prompt("Invalid password!");
    }
  }

  /**
   * Process credit entry
   */
  function processCreditEntry() {
    document.querySelector("#credit-chx").style.backgroundColor = "";

    // Validate credit amount and bill number
    if (!DOM.creditAmount.value || !DOM.creditBill.value) {
      UiManager.showNotification(
        "Failed!",
        "Please enter credit amount and bill number",
        "error"
      );
      return;
    }

    if (isNaN(DOM.creditAmount.value) || isNaN(DOM.creditBill.value)) {
      UiManager.showNotification(
        "Failed!",
        "Credit amount and bill number must be numeric",
        "error"
      );
      return;
    }

    // Remove event listener to prevent multiple submissions
    DOM.creditButton.removeEventListener("click", handleCreditClick);

    // Process credit
    addCreditEntry();
  }

  /**
   * Add credit entry to student record
   */
  async function addCreditEntry() {
    setLoading(true);

    try {
      const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);
      if (!currentStudent) {
        throw new Error("No student selected");
      }

      // Create new credit entry
      const newCreditEntry = {
        date: DOM.date.textContent,
        amount: Number(DOM.creditAmount.value),
        bill: DOM.creditBill.value,
      };

      // Update credit amount array
      const newCreditArray = [...currentStudent.creditAmount, newCreditEntry];

      // Calculate total credit
      let totalCreditAmount = 0;
      newCreditArray.forEach((credit) => {
        totalCreditAmount += credit.amount;
      });

      // Prepare data for update
      const updatedData = {
        creditAmount: newCreditArray,
        fees: {
          debit: currentStudent.fees.debit,
          credit: totalCreditAmount,
        },
      };

      // Send update request using API service
      await ApiService.updateStudent(currentStudent.studentId, updatedData);

      // Clear form fields
      DOM.creditAmount.value = "";
      DOM.creditBill.value = "";

      // Show success checkbox
      DOM.creditCheckbox.checked = true;
      setTimeout(() => {
        DOM.creditCheckbox.checked = false;
      }, CONFIG.SUCCESS_CHECKBOX_TIMEOUT);

      // Show success notification
      UiManager.showNotification(
        "Success!",
        "Credit added successfully",
        "success"
      );

      // Refresh student data
      const updatedStudent = await ApiService.getStudent(
        currentStudent.studentId
      );

      // Update state with new student data
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, updatedStudent);

      // No page reload needed
    } catch (error) {
      handleError("Error adding credit", error);
      UiManager.showNotification("Failed!", "Credit update failed", "error");
      document.querySelector("#credit-chx").style.backgroundColor = "red";
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reset form to default values
   */
  function resetForm() {
    DOM.name.textContent = "....................";
    DOM.class.textContent = "....................";
    DOM.studentId.textContent = "...";
    DOM.debit.textContent = 0;
    DOM.credit.textContent = 0;
    DOM.due.textContent = 0;
    UiManager.clearElement("#debit-column");
    UiManager.clearElement("#credit-column");
    DOM.photo.style.backgroundImage = `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
    DOM.searchInput.value = "";
    DOM.creditAmount.value = "";
    DOM.creditBill.value = "";

    // Remove credit event handler if exists
    DOM.creditButton.removeEventListener("click", handleCreditClick);
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
        "#credit-amount",
        "#credit-bill",
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
