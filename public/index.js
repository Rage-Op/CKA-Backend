/**
 * Dashboard Module
 * Handles the main dashboard functionality and data display
 */

// Immediately Invoked Function Expression (IIFE) for module pattern
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    API_BASE_URL: window.location.origin,
    AUTO_SAVE_INTERVAL: 1000, // Interval for auto-saving task list in milliseconds
  };

  // DOM Elements Cache
  const DOM = {
    // Theme elements
    themeToggle: document.getElementById("theme-toggle"),
    sideBar: document.querySelector(".sidebar"),

    // Dashboard elements
    indexDate: document.querySelector("#index-date"),
    indexStudents: document.querySelector("#index-students"),
    indexDue: document.querySelector("#index-due"),
    dueFeesTable: document.querySelector("#index-due-fees-body"),

    // Task list elements
    listItems: document.querySelectorAll(".autosave-items"),
    itemsCheck: document.querySelectorAll(".task-complete"),
  };

  // State management
  let STATE = {
    isLoading: false,
    students: [],
  };

  /**
   * Initialize the application
   */
  function init() {
    attachEventListeners();
    checkStoredTheme();
    handleResponsiveSidebar();
    loadTaskList();
    setupAutoSave();
    fetchDashboardData();
  }

  /**
   * Attach event listeners to DOM elements
   */
  function attachEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener("change", handleThemeToggle);

    // Task completion checkboxes
    DOM.itemsCheck.forEach(attachTaskCompleteHandler);

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

    // Logout link
    const logoutLink = document.querySelector(
      ".sidebar .side-menu li a.logout"
    );
    if (logoutLink) {
      logoutLink.addEventListener("click", handleLogout);
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
   * Attach click handler to task completion checkboxes
   * @param {HTMLElement} item - Checkbox element
   */
  function attachTaskCompleteHandler(item) {
    item.addEventListener("click", function () {
      const inputElement = this.parentNode.querySelector(".autosave-items");
      if (inputElement) {
        inputElement.value = "";
      }
    });
  }

  /**
   * Load task list from local storage
   */
  function loadTaskList() {
    let index = 0;
    DOM.listItems.forEach((input) => {
      input.value = localStorage.getItem(`listValue${index}`) || "";
      index++;
    });
  }

  /**
   * Setup auto-save functionality for task list
   */
  function setupAutoSave() {
    setInterval(() => {
      let index = 0;
      DOM.listItems.forEach((input) => {
        localStorage.setItem(`listValue${index}`, input.value);
        index++;
      });
    }, CONFIG.AUTO_SAVE_INTERVAL);
  }

  /**
   * Fetch dashboard data from API
   */
  async function fetchDashboardData() {
    setLoading(true);

    try {
      // Fetch student data
      const response = await fetch(`${CONFIG.API_BASE_URL}/students`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch students (Status: ${response.status})`
        );
      }

      STATE.students = await response.json();

      // Update student count
      DOM.indexStudents.innerText = STATE.students.length;

      // Find top 3 students with highest due
      findTopStudentsWithHighestDue(STATE.students);

      // Fetch current date
      await fetchCurrentDate();

      // Calculate total due
      calculateTotalDue(STATE.students);
    } catch (error) {
      handleError("Error fetching dashboard data", error);
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

      DOM.indexDate.innerText = formattedDate;
    } catch (error) {
      handleError("Error fetching current date", error);
      DOM.indexDate.innerText = "Date unavailable";
    }
  }

  /**
   * Calculate total due amount from all students
   * @param {Array} students - List of students
   */
  function calculateTotalDue(students) {
    let totalDue = 0;

    students.forEach((student) => {
      const due = student.fees.debit - student.fees.credit;
      totalDue += due;
    });

    DOM.indexDue.innerText = `Rs. ${totalDue}`;
  }

  /**
   * Find top 3 students with highest due amount
   * @param {Array} students - List of students
   */
  function findTopStudentsWithHighestDue(students) {
    // Clear previous entries
    DOM.dueFeesTable.innerHTML = "";

    // Create array of students with due amounts
    const studentsWithDue = students.map((student) => {
      const due = student.fees.debit - student.fees.credit;
      return { student, due };
    });

    // Sort by due amount (descending)
    studentsWithDue.sort((a, b) => b.due - a.due);

    // Take top 3 students
    const top3Students = studentsWithDue.slice(0, 3);

    // Display top 3 students
    top3Students.forEach((item) => {
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
        <td>
          <p><h5>${item.student.studentId}-${item.student.name}-${item.student.class}</h5></p>
        </td>
        <td>
          <p><h5>${item.student.contact}</h5></p>
        </td>
        <td>
          <p><h5>Rs. ${item.due}</h5></p>
        </td>
      `;

      DOM.dueFeesTable.appendChild(newRow);
    });
  }

  /**
   * Handle logout
   */
  async function handleLogout() {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Logout failed (Status: ${response.status})`);
      }

      window.location.href = "/";
    } catch (error) {
      handleError("Error logging out", error);
      alert("Failed to logout. Please try again.");
    }
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Whether app is in loading state
   */
  function setLoading(isLoading) {
    STATE.isLoading = isLoading;

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
