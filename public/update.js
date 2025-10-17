/**
 * Student Update Module
 * Handles updating student information with improved fee structure management
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    NOTIFICATION_TIMEOUT: 2000,
    DEFAULT_CLASS: "P.G.",
    DEFAULT_PHOTO_URL: "./content/user-icon.jpg",
    NOT_FOUND_PHOTO_URL: "./content/user-not-found-icon.jpg",
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

    // Student data fields
    name: document.querySelector("#update-name"),
    dob: document.querySelector("#update-DOB"),
    fatherName: document.querySelector("#update-fname"),
    motherName: document.querySelector("#update-mname"),
    contact: document.querySelector("#update-contact"),
    address: document.querySelector("#update-address"),
    oldDue: document.querySelector("#update-old-due"),
    discount: document.querySelector("#update-discount"),
    transport: document.querySelector("#update-transport"),
    diet: document.querySelector("#update-diet"),
    class: document.querySelector("#add-class"),
    studentId: document.querySelector("#add-studentId"),
    admitDate: document.querySelector("#add-admitdate"),
    photo: document.querySelector(".update-photo"),

    // Action buttons
    saveButton: document.querySelector("#admit-button"),
    cancelButton: document.querySelector("#cancel-button"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State keys
  const STATE_KEYS = {
    CURRENT_STUDENT: "update_currentStudent",
    SETTINGS: "update_settings",
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

    if (!StateManager.getState(STATE_KEYS.SETTINGS)) {
      StateManager.setState(STATE_KEYS.SETTINGS, null);
    }
  }

  /**
   * Restore state from StateManager
   */
  function restoreState() {
    const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);
    const settings = StateManager.getState(STATE_KEYS.SETTINGS);

    if (settings) {
      // Settings are available in state
    }

    if (currentStudent) {
      // Populate form with student data
      populateStudentForm(currentStudent);

      // Add save event handler
      DOM.saveButton.addEventListener("click", handleSave);
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

    // Class, transport, and diet change listeners for fee updates
    DOM.class.addEventListener("change", updateFeesBasedOnSelection);
    DOM.transport.addEventListener("change", updateFeesBasedOnSelection);
    DOM.diet.addEventListener("change", updateFeesBasedOnSelection);

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
    StateManager.subscribe(STATE_KEYS.SETTINGS, handleSettingsStateChange);
  }

  /**
   * Handle student state changes
   * @param {Object} student - Student data
   */
  function handleStudentStateChange(student) {
    if (student) {
      populateStudentForm(student);

      // Add save event handler if not already added
      if (!DOM.saveButton.hasEventListener) {
        DOM.saveButton.addEventListener("click", handleSave);
        DOM.saveButton.hasEventListener = true;
      }
    } else {
      resetForm();
    }
  }

  /**
   * Handle settings state changes
   * @param {Object} settings - Settings data
   */
  function handleSettingsStateChange(settings) {
    // Update UI or logic based on settings changes if needed
    if (settings && StateManager.getState(STATE_KEYS.CURRENT_STUDENT)) {
      updateFeesBasedOnSelection();
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
   * Fetch student data from API
   * @param {string} studentId - Student ID to search for
   */
  async function fetchStudent(studentId) {
    setLoading(true);

    try {
      // Fetch student data using API service
      const studentData = await ApiService.getStudent(studentId);

      // Update state
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, studentData);

      // Fetch settings for fee structure
      await fetchSettings();

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
   * Fetch settings data for fee structure
   */
  async function fetchSettings() {
    try {
      // Fetch settings using API service
      const settingsData = await ApiService.getSettings();

      // Update state
      StateManager.setState(STATE_KEYS.SETTINGS, settingsData[0]);
    } catch (error) {
      handleError("Error fetching settings data", error);
      UiManager.showNotification(
        "Failed!",
        "Could not fetch settings",
        "error"
      );
    }
  }

  /**
   * Populate form with student data
   * @param {Object} data - Student data object
   */
  function populateStudentForm(data) {
    if (!data) return;

    DOM.name.value = data.name || "";
    DOM.dob.value = data.DOB || "";
    DOM.fatherName.value = data.fatherName || "";
    DOM.motherName.value = data.motherName || "";
    DOM.contact.value = data.contact || "";
    DOM.address.value = data.address || "";
    DOM.oldDue.value = data.debitAmount?.[0]?.amount || 0;
    DOM.discount.value = data.creditAmount?.[0]?.amount || 0;
    DOM.studentId.textContent = data.studentId || "";
    DOM.admitDate.textContent = data.admitDate || "";
    DOM.transport.checked = data.transport || false;
    DOM.diet.checked = data.diet || false;
    DOM.class.value = data.class || CONFIG.DEFAULT_CLASS;

    // Set photo
    DOM.photo.style.backgroundImage = data.photo
      ? `url(${data.photo})`
      : `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
  }

  /**
   * Update fees based on class, transport, and diet selection
   */
  function updateFeesBasedOnSelection() {
    const settings = StateManager.getState(STATE_KEYS.SETTINGS);
    const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);

    if (!settings || !currentStudent) return;

    // Update based on class selection
    const selectedClass = DOM.class.value;
    let monthlyFees = 0;

    switch (selectedClass) {
      case "P.G.":
        monthlyFees = settings.monthlyPG;
        break;
      case "K.G.":
        monthlyFees = settings.monthlyKG;
        break;
      case "nursery":
        monthlyFees = settings.monthlyNursery;
        break;
      case "1":
        monthlyFees = settings.monthly1;
        break;
      case "2":
        monthlyFees = settings.monthly2;
        break;
      case "3":
        monthlyFees = settings.monthly3;
        break;
      case "4":
        monthlyFees = settings.monthly4;
        break;
      case "5":
        monthlyFees = settings.monthly5;
        break;
      case "6":
        monthlyFees = settings.monthly6;
        break;
      default:
        monthlyFees = settings.monthlyPG;
    }

    // Update student state with new fee values
    const updatedStudent = {
      ...currentStudent,
      monthlyFees: monthlyFees,
      transportFees: DOM.transport.checked ? settings.transport : 0,
      dietFees: DOM.diet.checked ? settings.diet : 0,
    };

    // Update state
    StateManager.setState(STATE_KEYS.CURRENT_STUDENT, updatedStudent);
  }

  /**
   * Handle save button click
   * @param {Event} event - Click event
   */
  async function handleSave(event) {
    event.preventDefault();

    if (!validateForm()) {
      UiManager.showNotification(
        "Failed!",
        "Please fill all required fields",
        "error"
      );
      return;
    }

    setLoading(true);

    // Remove the event listener to prevent multiple submissions
    DOM.saveButton.removeEventListener("click", handleSave);
    DOM.saveButton.hasEventListener = false;

    try {
      const currentStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);

      if (!currentStudent) {
        throw new Error("No student selected");
      }

      // Calculate new fees values
      const newDebitAmount = [...currentStudent.debitAmount];
      newDebitAmount[0].amount = Number(DOM.oldDue.value);

      const newCreditAmount = [...currentStudent.creditAmount];
      newCreditAmount[0].amount = Number(DOM.discount.value);

      const newFeesDebit =
        currentStudent.fees.debit -
        currentStudent.debitAmount[0].amount +
        Number(DOM.oldDue.value);

      const newFeesCredit =
        currentStudent.fees.credit -
        currentStudent.creditAmount[0].amount +
        Number(DOM.discount.value);

      // Update fees based on selection
      updateFeesBasedOnSelection();

      // Get updated student with new fees
      const updatedStudent = StateManager.getState(STATE_KEYS.CURRENT_STUDENT);

      // Prepare data for update
      const updatedData = {
        name: DOM.name.value,
        DOB: DOM.dob.value,
        class: DOM.class.value,
        fatherName: DOM.fatherName.value,
        motherName: DOM.motherName.value,
        contact: DOM.contact.value,
        address: DOM.address.value,
        debitAmount: newDebitAmount,
        creditAmount: newCreditAmount,
        fees: {
          debit: newFeesDebit,
          credit: newFeesCredit,
        },
        transport: DOM.transport.checked,
        diet: DOM.diet.checked,
        monthlyFees: updatedStudent.monthlyFees,
        transportFees: updatedStudent.transportFees,
        dietFees: updatedStudent.dietFees,
      };

      // Send update request using API service
      await ApiService.updateStudent(currentStudent.studentId, updatedData);

      // Show success notification
      UiManager.showNotification(
        "Success!",
        "Student updated successfully",
        "success"
      );

      // Reset form and state
      resetForm();
      StateManager.setState(STATE_KEYS.CURRENT_STUDENT, null);

      // No page reload needed
    } catch (error) {
      handleError("Error updating student", error);
      UiManager.showNotification("Failed!", "Update failed", "error");
    } finally {
      setLoading(false);
    }
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
   * Reset form to default values
   */
  function resetForm() {
    DOM.name.value = "";
    DOM.dob.value = "";
    DOM.fatherName.value = "";
    DOM.motherName.value = "";
    DOM.contact.value = "";
    DOM.address.value = "";
    DOM.oldDue.value = "";
    DOM.discount.value = "";
    DOM.transport.checked = false;
    DOM.diet.checked = false;
    DOM.class.value = CONFIG.DEFAULT_CLASS;
    DOM.photo.style.backgroundImage = `url('${CONFIG.DEFAULT_PHOTO_URL}')`;
    DOM.searchInput.value = "";

    // Remove save event handler if exists
    if (DOM.saveButton.hasEventListener) {
      DOM.saveButton.removeEventListener("click", handleSave);
      DOM.saveButton.hasEventListener = false;
    }
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
        "#formsearch input",
        "#formsearch button",
        "#update-name",
        "#update-DOB",
        "#update-fname",
        "#update-mname",
        "#update-contact",
        "#update-address",
        "#update-old-due",
        "#update-discount",
        "#update-transport",
        "#update-diet",
        "#add-class",
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
