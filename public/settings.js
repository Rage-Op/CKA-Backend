/**
 * Settings Management Module
 * Handles viewing and updating system settings for fees
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    API_BASE_URL: window.location.origin,
    NOTIFICATION_TIMEOUT: 2000,
  };

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Settings form elements
    monthlyPG: document.querySelector("#settings-PG"),
    monthlyKG: document.querySelector("#settings-KG"),
    monthlyNursery: document.querySelector("#settings-nursery"),
    monthly1: document.querySelector("#settings-class1"),
    monthly2: document.querySelector("#settings-class2"),
    monthly3: document.querySelector("#settings-class3"),
    monthly4: document.querySelector("#settings-class4"),
    monthly5: document.querySelector("#settings-class5"),
    monthly6: document.querySelector("#settings-class6"),
    transport: document.querySelector("#settings-transport"),
    diet: document.querySelector("#settings-diet"),
    exam: document.querySelector("#settings-exam"),

    // Action buttons
    saveButton: document.querySelector("#admit-button"),
    cancelButton: document.querySelector("#cancel-button"),

    // Notification
    notice: document.querySelector("#sucess-dialog"),
  };

  // State management
  let STATE = {
    settings: null,
    isLoading: false,
  };

  /**
   * Initialize the application
   */
  function init() {
    attachEventListeners();
    checkStoredTheme();
    handleResponsiveSidebar();
    fetchSettings();
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

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
   * Handle cancel button click
   * @param {Event} event - Click event
   */
  async function handleCancel(event) {
    event.preventDefault();

    // Reload settings from server
    await fetchSettings();
  }

  /**
   * Fetch settings from API
   */
  async function fetchSettings() {
    setLoading(true);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/settings`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch settings (Status: ${response.status})`
        );
      }

      const data = await response.json();
      STATE.settings = data[0];

      // Display settings
      displaySettings(STATE.settings);

      // Add save event handler
      DOM.saveButton.addEventListener("click", handleSave);
    } catch (error) {
      handleError("Error fetching settings", error);
      showErrorInForm();
    } finally {
      setLoading(false);
    }
  }

  /**
   * Display settings in the form
   * @param {Object} settings - Settings object
   */
  function displaySettings(settings) {
    DOM.monthlyPG.value = settings.monthlyPG;
    DOM.monthlyKG.value = settings.monthlyKG;
    DOM.monthlyNursery.value = settings.monthlyNursery;
    DOM.monthly1.value = settings.monthly1;
    DOM.monthly2.value = settings.monthly2;
    DOM.monthly3.value = settings.monthly3;
    DOM.monthly4.value = settings.monthly4;
    DOM.monthly5.value = settings.monthly5;
    DOM.monthly6.value = settings.monthly6;
    DOM.transport.value = settings.transport;
    DOM.diet.value = settings.diet;
    DOM.exam.value = settings.exam;
  }

  /**
   * Show error in form when settings can't be loaded
   */
  function showErrorInForm() {
    DOM.monthlyPG.value = "!";
    DOM.monthlyKG.value = "!";
    DOM.monthlyNursery.value = "!";
    DOM.monthly1.value = "!";
    DOM.monthly2.value = "!";
    DOM.monthly3.value = "!";
    DOM.monthly4.value = "!";
    DOM.monthly5.value = "!";
    DOM.monthly6.value = "!";
    DOM.transport.value = "!";
    DOM.diet.value = "!";
    DOM.exam.value = "!";
  }

  /**
   * Handle save button click
   * @param {Event} event - Click event
   */
  async function handleSave(event) {
    event.preventDefault();

    if (!validateForm()) {
      showNotification(
        "Failed!",
        "All settings must be valid numbers",
        "error"
      );
      return;
    }

    // Remove event listener to prevent multiple submissions
    DOM.saveButton.removeEventListener("click", handleSave);

    // Update settings
    await updateSettings();
  }

  /**
   * Validate form fields
   * @returns {boolean} - Whether form is valid
   */
  function validateForm() {
    const settingsFields = [
      DOM.monthlyPG,
      DOM.monthlyKG,
      DOM.monthlyNursery,
      DOM.monthly1,
      DOM.monthly2,
      DOM.monthly3,
      DOM.monthly4,
      DOM.monthly5,
      DOM.monthly6,
      DOM.transport,
      DOM.diet,
      DOM.exam,
    ];

    return settingsFields.every((field) => {
      const value = field.value.trim();
      return value !== "" && !isNaN(Number(value));
    });
  }

  /**
   * Update settings in the database
   */
  async function updateSettings() {
    setLoading(true);

    try {
      // Prepare updated settings data
      const updatedSettings = {
        monthlyPG: Number(DOM.monthlyPG.value),
        monthlyKG: Number(DOM.monthlyKG.value),
        monthlyNursery: Number(DOM.monthlyNursery.value),
        monthly1: Number(DOM.monthly1.value),
        monthly2: Number(DOM.monthly2.value),
        monthly3: Number(DOM.monthly3.value),
        monthly4: Number(DOM.monthly4.value),
        monthly5: Number(DOM.monthly5.value),
        monthly6: Number(DOM.monthly6.value),
        transport: Number(DOM.transport.value),
        exam: Number(DOM.exam.value),
        diet: Number(DOM.diet.value),
      };

      // Send update request
      const response = await fetch(`${CONFIG.API_BASE_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error(`Update failed (Status: ${response.status})`);
      }

      await response.json();

      // Show success notification
      showNotification("Success!", "Settings updated successfully", "success");

      // Reload settings
      await fetchSettings();
    } catch (error) {
      handleError("Error updating settings", error);
      showNotification("Failed!", "Update failed", "error");
    } finally {
      setLoading(false);
    }
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
          DOM.notice.innerHTML = "<h4>Success!</h4><p>Student updated</p>";
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
      DOM.monthlyPG,
      DOM.monthlyKG,
      DOM.monthlyNursery,
      DOM.monthly1,
      DOM.monthly2,
      DOM.monthly3,
      DOM.monthly4,
      DOM.monthly5,
      DOM.monthly6,
      DOM.transport,
      DOM.diet,
      DOM.exam,
      DOM.saveButton,
      DOM.cancelButton,
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
