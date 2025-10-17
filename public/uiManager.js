/**
 * UI Manager
 * Provides centralized UI update utilities for all modules
 */

const UiManager = (function () {
  "use strict";

  // Default notification timeout
  const NOTIFICATION_TIMEOUT = 2000;

  /**
   * Update a single element's property
   * @param {string} selector - CSS selector
   * @param {*} value - Value to set
   * @param {string} property - Property to set (default: 'textContent')
   */
  function updateElement(selector, value, property = "textContent") {
    const element = document.querySelector(selector);
    if (element) {
      if (property === "html") {
        element.innerHTML = value;
      } else if (property === "style") {
        Object.assign(element.style, value);
      } else if (property === "class") {
        if (typeof value === "string") {
          element.className = value;
        } else if (Array.isArray(value)) {
          element.className = value.join(" ");
        }
      } else if (property === "classList" && typeof value === "object") {
        if (value.add) element.classList.add(value.add);
        if (value.remove) element.classList.remove(value.remove);
        if (value.toggle) element.classList.toggle(value.toggle);
      } else if (property === "backgroundImage") {
        element.style.backgroundImage = value;
      } else {
        element[property] = value;
      }
    }
  }

  /**
   * Update multiple elements at once
   * @param {Array} updates - Array of update objects
   */
  function updateElements(updates) {
    updates.forEach(({ selector, value, property = "textContent" }) => {
      updateElement(selector, value, property);
    });
  }

  /**
   * Clear form fields
   * @param {Array} selectors - Array of input selectors
   */
  function clearFormFields(selectors) {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        if (element.type === "checkbox" || element.type === "radio") {
          element.checked = false;
        } else {
          element.value = "";
        }
      }
    });
  }

  /**
   * Set form values
   * @param {Object} values - Object with selector-value pairs
   */
  function setFormValues(values) {
    Object.entries(values).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) {
        if (element.type === "checkbox" || element.type === "radio") {
          element.checked = Boolean(value);
        } else {
          element.value = value;
        }
      }
    });
  }

  /**
   * Show notification to user
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success', 'error', or 'info')
   * @param {number} timeout - Timeout in milliseconds
   */
  function showNotification(
    title,
    message,
    type = "success",
    timeout = NOTIFICATION_TIMEOUT
  ) {
    const notice = document.querySelector("#sucess-dialog");
    if (!notice) return;

    notice.innerHTML = `<h4>${title}</h4><p>${message}</p>`;

    if (type === "error") {
      notice.style.backgroundColor = "rgba(254, 205, 211, 0.7)";
      notice.style.border = "1px solid #D32F2F";
    } else if (type === "info") {
      notice.style.backgroundColor = "rgba(191, 219, 254, 0.7)";
      notice.style.border = "1px solid #1E88E5";
    } else {
      notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
      notice.style.border = "1px solid #50c156";
    }

    notice.style.opacity = "100";

    setTimeout(() => {
      notice.style.opacity = "0";

      // Reset to default success style after hiding
      if (type === "error" || type === "info") {
        setTimeout(() => {
          notice.style.backgroundColor = "rgba(187, 247, 208, 0.7)";
          notice.style.border = "1px solid #50c156";
          notice.innerHTML = "<h4>Success!</h4><p>Operation completed</p>";
        }, 300);
      }
    }, timeout);
  }

  /**
   * Create and append HTML element
   * @param {string} tag - HTML tag
   * @param {Object} attributes - Element attributes
   * @param {string|Node} content - Element content
   * @param {Element} parent - Parent element
   * @returns {Element} - Created element
   */
  function createElement(tag, attributes = {}, content = "", parent = null) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key === "classList" && Array.isArray(value)) {
        element.classList.add(...value);
      } else if (key === "dataset" && typeof value === "object") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key === "events" && typeof value === "object") {
        Object.entries(value).forEach(([event, handler]) => {
          element.addEventListener(event, handler);
        });
      } else {
        element[key] = value;
      }
    });

    // Set content
    if (content) {
      if (typeof content === "string") {
        element.innerHTML = content;
      } else {
        element.appendChild(content);
      }
    }

    // Append to parent
    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }

  /**
   * Clear element content
   * @param {string} selector - CSS selector
   */
  function clearElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = "";
    }
  }

  /**
   * Set loading state for elements
   * @param {Array} selectors - Array of element selectors
   * @param {boolean} isLoading - Loading state
   */
  function setLoading(selectors, isLoading) {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.disabled = isLoading;
      }
    });
  }

  /**
   * Create a table row with cells
   * @param {Array} cellContents - Array of cell contents
   * @param {Object} rowAttributes - Row attributes
   * @returns {HTMLTableRowElement} - Table row element
   */
  function createTableRow(cellContents, rowAttributes = {}) {
    const row = document.createElement("tr");

    // Set row attributes
    Object.entries(rowAttributes).forEach(([key, value]) => {
      if (key === "events") {
        Object.entries(value).forEach(([event, handler]) => {
          row.addEventListener(event, handler);
        });
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          row.dataset[dataKey] = dataValue;
        });
      } else {
        row[key] = value;
      }
    });

    // Create cells
    cellContents.forEach((content) => {
      const cell = document.createElement("td");
      if (typeof content === "string" || typeof content === "number") {
        cell.textContent = content;
      } else if (typeof content === "object" && content !== null) {
        if (content.html) {
          cell.innerHTML = content.html;
        } else if (content.element) {
          cell.appendChild(content.element);
        } else if (content.text) {
          cell.textContent = content.text;
        }

        if (content.attributes) {
          Object.entries(content.attributes).forEach(([key, value]) => {
            cell[key] = value;
          });
        }
      }
      row.appendChild(cell);
    });

    return row;
  }

  // Public API
  return {
    updateElement,
    updateElements,
    clearFormFields,
    setFormValues,
    showNotification,
    createElement,
    clearElement,
    setLoading,
    createTableRow,
  };
})();

// Export for use in other modules
window.UiManager = UiManager;
