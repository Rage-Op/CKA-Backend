/**
 * API Service
 * Provides centralized API communication for all modules
 */

const ApiService = (function () {
  "use strict";

  // Base URL for all API calls
  const API_BASE_URL = window.location.origin;

  /**
   * Generic fetch function with error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - Response data
   */
  async function fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get current date in BS format
   * @returns {Promise<string>} - BS date
   */
  async function getCurrentDate() {
    const data = await fetchData("bs-date");
    const datePart = data.split(" ")[0];
    const parts = datePart.split("-");
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }

  /**
   * Format BS date with month name
   * @param {string} dateStr - Date string in format YYYY/MM/DD
   * @returns {string} - Formatted date with month name
   */
  function formatBSDate(dateStr) {
    const bsMonths = [
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

    const [year, month, day] = dateStr.split("/");
    const bsMonth = bsMonths[parseInt(month) - 1];
    return `${day} ${bsMonth} ${year}`;
  }

  // Public API
  return {
    // Student operations
    getStudents: () => fetchData("students"),
    getAscendingStudents: () => fetchData("ascending-students"),
    getStudent: (id) => fetchData(`students/search/${id}`),
    addStudent: (data) =>
      fetchData("students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    updateStudent: (id, data) =>
      fetchData(`students/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    deleteStudent: (id) =>
      fetchData(`students/delete/${id}`, {
        method: "DELETE",
      }),

    // Settings operations
    getSettings: () => fetchData("settings"),
    updateSettings: (data) =>
      fetchData("settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),

    // Debit operations
    processDebit: (data) =>
      fetchData("debit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    getDebitLog: () => fetchData("debit-log"),
    updateDebitLog: (data) =>
      fetchData("debit-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),

    // Date operations
    getCurrentDate,
    formatBSDate,

    // Backup operations
    backupData: () => fetchData("backup"),
  };
})();

// Export for use in other modules
window.ApiService = ApiService;
