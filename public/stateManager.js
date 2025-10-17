/**
 * State Management System
 * Provides centralized state management with localStorage persistence and subscription capabilities
 */

const StateManager = (function () {
  "use strict";

  // Private state store
  const store = {};

  // Subscribers for state changes
  const subscribers = {};

  /**
   * Initialize state from localStorage
   */
  function init() {
    try {
      const savedState = localStorage.getItem("appState");
      if (savedState) {
        Object.assign(store, JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Error loading state:", error);
    }
  }

  /**
   * Save state to localStorage
   */
  function saveState() {
    try {
      localStorage.setItem("appState", JSON.stringify(store));
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }

  /**
   * Get state by key or entire state
   * @param {string} key - Optional key to get specific state
   * @returns {*} - State value or entire state object
   */
  function getState(key) {
    return key ? store[key] : { ...store };
  }

  /**
   * Set state by key
   * @param {string} key - Key to set
   * @param {*} value - Value to set
   */
  function setState(key, value) {
    store[key] = value;
    notifySubscribers(key);
    saveState();
  }

  /**
   * Update part of state by key
   * @param {string} key - Key to update
   * @param {*} value - Value to merge with existing state
   */
  function updateState(key, value) {
    if (
      typeof store[key] === "object" &&
      store[key] !== null &&
      typeof value === "object" &&
      value !== null
    ) {
      store[key] = { ...store[key], ...value };
    } else {
      store[key] = value;
    }
    notifySubscribers(key);
    saveState();
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to subscribe to
   * @param {function} callback - Callback function
   * @returns {function} - Unsubscribe function
   */
  function subscribe(key, callback) {
    if (!subscribers[key]) {
      subscribers[key] = [];
    }
    subscribers[key].push(callback);

    // Return unsubscribe function
    return () => {
      subscribers[key] = subscribers[key].filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify subscribers of state changes
   * @param {string} key - State key that changed
   */
  function notifySubscribers(key) {
    if (subscribers[key]) {
      subscribers[key].forEach((callback) => callback(store[key]));
    }
  }

  /**
   * Clear specific state by key
   * @param {string} key - Key to clear
   */
  function clearState(key) {
    if (key in store) {
      delete store[key];
      notifySubscribers(key);
      saveState();
    }
  }

  /**
   * Clear all state
   */
  function clearAllState() {
    Object.keys(store).forEach((key) => {
      delete store[key];
      notifySubscribers(key);
    });
    saveState();
  }

  // Initialize on load
  init();

  // Public API
  return {
    getState,
    setState,
    updateState,
    subscribe,
    clearState,
    clearAllState,
  };
})();

// Export for use in other modules
window.StateManager = StateManager;
