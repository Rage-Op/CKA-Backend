/**
 * Student Debit Management Module
 * Handles adding debit entries to all students and backing up student data
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    SUCCESS_CHECKBOX_TIMEOUT: 3000,
    ADMIN_PASSWORD: "admin123", // In a real production app, this would not be hardcoded
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
    // UI elements
    debitSuccessCheckbox: document.querySelector(".debit-sucess-checkbox"),
    debitDate: document.querySelector("#debit-date"),
    debitButton: document.querySelector("#debit-button"),
    examCheckbox: document.querySelector("#exam-checkbox"),
    backupButton: document.querySelector("#backup-button"),
    notice: document.querySelector("#sucess-dialog"),
  };

  // State keys
  const STATE_KEYS = {
    LAST_DEBIT_DATE: "debit_lastDebitDate",
    DEBIT_SETTINGS: "debit_settings",
  };

  /**
   * Initialize the application
   */
  function init() {
    // Initialize state
    initializeState();

    // Attach event listeners
    attachEventListeners();

    // Restore state if available
    restoreState();

    // Calculate days difference
    calculateDaysDifference();
  }

  /**
   * Initialize state with default values
   */
  function initializeState() {
    if (!StateManager.getState(STATE_KEYS.LAST_DEBIT_DATE)) {
      StateManager.setState(STATE_KEYS.LAST_DEBIT_DATE, null);
    }
  }

  /**
   * Restore state from StateManager
   */
  function restoreState() {
    const lastDebitDate = StateManager.getState(STATE_KEYS.LAST_DEBIT_DATE);
    if (lastDebitDate) {
      // State is already available, will be used in calculateDaysDifference
    }
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    DOM.debitButton.addEventListener("click", handleDebitClick);
    DOM.backupButton.addEventListener("click", handleBackupClick);
  }

  /**
   * Handle debit button click
   * @param {Event} event - Click event
   */
  function handleDebitClick(event) {
    event.preventDefault();

    // Check if safe mode is disabled
    if (!window.CONFIG.isSafeMode()) {
      fetchStudentsForDebit();
      return;
    }

    // Password confirmation (only in safe mode)
    const userInput = window.prompt("Please enter your password:");

    if (!userInput) {
      return; // User cancelled
    }

    const password = userInput.trim();

    if (password === CONFIG.ADMIN_PASSWORD) {
      fetchStudentsForDebit();
    } else {
      window.prompt("Invalid password!");
    }
  }

  /**
   * Handle backup button click
   * @param {Event} event - Click event
   */
  function handleBackupClick(event) {
    event.preventDefault();
    backupStudentData();
  }

  /**
   * Get current date in BS format
   * @returns {Promise<string>} - Formatted BS date
   */
  async function getBsDate() {
    try {
      return await ApiService.getCurrentDate();
    } catch (error) {
      handleError("Error fetching BS date", error);
      return null;
    }
  }

  /**
   * Calculate days since last debit
   */
  async function calculateDaysDifference() {
    try {
      // Get previous debit date from state or API
      let previousDebitDate = StateManager.getState(STATE_KEYS.LAST_DEBIT_DATE);

      if (!previousDebitDate) {
        previousDebitDate = await getPreviousDebitDate();
        if (previousDebitDate) {
          StateManager.setState(STATE_KEYS.LAST_DEBIT_DATE, previousDebitDate);
        }
      }

      if (!previousDebitDate) {
        DOM.debitDate.textContent = "No previous debit";
        return;
      }

      // Get current date
      const currentDate = await ApiService.getCurrentDate();
      if (!currentDate) return;

      // Parse dates
      const [yearA, monthA, dayA] = currentDate.split("/").map(Number);
      const [yearB, monthB, dayB] = previousDebitDate.split("/").map(Number);

      // Validate date parts
      if (
        isNaN(yearA) ||
        isNaN(monthA) ||
        isNaN(dayA) ||
        isNaN(yearB) ||
        isNaN(monthB) ||
        isNaN(dayB)
      ) {
        DOM.debitDate.textContent = "Date parse error";
        return;
      }

      // Calculate days difference (approximate)
      const daysA = yearA * 365 + monthA * 30 + dayA;
      const daysB = yearB * 365 + monthB * 30 + dayB;
      const daysPassed = daysA - daysB;

      DOM.debitDate.textContent = `${daysPassed} days ago`;
    } catch (error) {
      handleError("Error calculating days difference", error);
      DOM.debitDate.textContent = "Error calculating days";
    }
  }

  /**
   * Get previous debit date from database
   * @returns {Promise<string|null>} - Previous debit date
   */
  async function getPreviousDebitDate() {
    try {
      const data = await ApiService.getDebitLog();

      // Check if data is valid
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0] &&
        data[0].lastDebit
      ) {
        return data[0].lastDebit;
      }

      return null;
    } catch (error) {
      handleError("Error fetching previous debit date", error);
      return null;
    }
  }

  /**
   * Backup student data
   */
  async function backupStudentData() {
    setLoading(true);

    try {
      await ApiService.backupData();

      // Update UI to show success
      DOM.backupButton.style.backgroundColor = "rgb(37, 37, 170)";
      DOM.backupButton.style.color = "white";

      UiManager.showNotification(
        "Success!",
        "Backup completed successfully",
        "success"
      );
    } catch (error) {
      handleError("Error backing up student data", error);
      UiManager.showNotification("Failed!", "Backup failed", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch all students for debit processing
   */
  async function fetchStudentsForDebit() {
    setLoading(true);

    try {
      // Get current date
      const currentDate = await ApiService.getCurrentDate();
      if (!currentDate) throw new Error("Failed to get current date");

      // Format date for display
      const [year, month, day] = currentDate.split("/");
      const bsFormattedMonthDate = ApiService.formatBSDate(currentDate);

      // Fetch all students
      const students = await ApiService.getStudents();

      // Prepare update requests
      const updateRequests = prepareDebitUpdates(
        students,
        bsFormattedMonthDate
      );

      // Process updates
      await updateDebit(updateRequests, currentDate);
    } catch (error) {
      handleError("Error processing debit", error);
      UiManager.showNotification("Failed!", "Debit processing failed", "error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Prepare debit update requests for all students
   * @param {Array} students - List of students
   * @param {string} debitDate - Formatted debit date
   * @returns {Array} - Array of update requests
   */
  function prepareDebitUpdates(students, debitDate) {
    const updateRequests = [];

    students.forEach((student) => {
      // Reset checkbox
      DOM.debitSuccessCheckbox.checked = false;

      // Create new debit entry
      const newDebitEntry = {
        date: debitDate,
        amount: calculateDebitAmount(student),
        remark: generateDebitRemark(student),
      };

      // Update debit amount array
      const newDebitAmountArray = [...student.debitAmount, newDebitEntry];

      // Calculate total debit
      let totalDebitAmount = 0;
      newDebitAmountArray.forEach((debitItem) => {
        totalDebitAmount += debitItem.amount;
      });

      // Create update request
      const updateRequest = {
        studentId: student.studentId,
        debitAmount: newDebitAmountArray,
        fees: {
          debit: totalDebitAmount,
          credit: student.fees.credit,
        },
      };

      updateRequests.push(updateRequest);
    });

    return updateRequests;
  }

  /**
   * Calculate debit amount for a student
   * @param {Object} student - Student object
   * @returns {number} - Calculated debit amount
   */
  function calculateDebitAmount(student) {
    let debitAmount = 0;

    // Add monthly fees
    debitAmount += student.monthlyFees;

    // Add transport fees if applicable
    if (student.transport) {
      debitAmount += student.transportFees;
    }

    // Add diet fees if applicable
    if (student.diet) {
      debitAmount += student.dietFees;
    }

    // Add exam fees if applicable
    if (DOM.examCheckbox.checked) {
      debitAmount += student.examFees;
    }

    return debitAmount;
  }

  /**
   * Generate debit remark based on student services
   * @param {Object} student - Student object
   * @returns {string} - Debit remark
   */
  function generateDebitRemark(student) {
    const services = ["Monthly Fees"];

    if (student.transport) {
      services.push("Transport");
    }

    if (student.diet) {
      services.push("Diet");
    }

    if (DOM.examCheckbox.checked) {
      services.push("Exam");
    }

    return services.join(", ");
  }

  /**
   * Update debit information in the database
   * @param {Array} updateRequests - Array of update requests
   * @param {string} currentDate - Current date
   */
  async function updateDebit(updateRequests, currentDate) {
    setLoading(true);

    try {
      // Update debit log with new date
      await ApiService.updateDebitLog({ lastDebit: currentDate });

      // Reset exam checkbox
      DOM.examCheckbox.checked = false;

      // Update all students
      await ApiService.processDebit(updateRequests);

      // Update UI to show success
      DOM.debitSuccessCheckbox.checked = true;

      // Store the new debit date in state
      StateManager.setState(STATE_KEYS.LAST_DEBIT_DATE, currentDate);

      setTimeout(() => {
        DOM.debitSuccessCheckbox.checked = false;
      }, CONFIG.SUCCESS_CHECKBOX_TIMEOUT);

      // Show success notification
      UiManager.showNotification(
        "Success!",
        "Debit processed successfully",
        "success"
      );

      // Update days difference display
      calculateDaysDifference();

      // No page reload needed
    } catch (error) {
      handleError("Error updating debit", error);
      UiManager.showNotification("Failed!", "Debit update failed", "error");
      document.querySelector("#chx").style.backgroundColor = "red";
    } finally {
      setLoading(false);
    }
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Whether app is in loading state
   */
  function setLoading(isLoading) {
    UiManager.setLoading(
      ["#debit-button", "#backup-button", "#exam-checkbox"],
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
