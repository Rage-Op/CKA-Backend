// Frontend Configuration Utility
// This file provides a centralized way to manage API URLs and configuration

let apiBaseUrl = null;
let configLoaded = false;

// Global CONFIG object
window.CONFIG = {
  // Safe mode configuration (requires password prompts)
  SAFE_MODE: true, // Default to true for security

  // Function to check if safe mode is enabled
  isSafeMode: function () {
    return this.SAFE_MODE !== false;
  },
};

// Check for environment variables
(function loadEnvVariables() {
  fetch("/env-config")
    .then((response) => response.json())
    .then((data) => {
      if (data && typeof data.SAFE_MODE !== "undefined") {
        window.CONFIG.SAFE_MODE = data.SAFE_MODE === "true";
        console.log(
          "Safe mode:",
          window.CONFIG.SAFE_MODE ? "enabled" : "disabled"
        );
      }
    })
    .catch((error) => {
      console.error("Error loading environment variables:", error);
    });
})();

// Function to get the API base URL
async function getApiBaseUrl() {
  if (configLoaded && apiBaseUrl) {
    return apiBaseUrl;
  }

  try {
    const response = await fetch("/config");
    const config = await response.json();
    apiBaseUrl = config.apiBaseUrl;
    configLoaded = true;
    console.log("API Configuration loaded:", config);
    return apiBaseUrl;
  } catch (error) {
    console.error("Failed to load API configuration:", error);
    // Fallback to localhost for development
    apiBaseUrl = `${window.location.origin}`;
    configLoaded = true;
    return apiBaseUrl;
  }
}

// Function to make API calls with automatic URL resolution and JWT token
async function apiCall(endpoint, options = {}) {
  const baseUrl = await getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
}

// Function to logout and clear token
function logout() {
  localStorage.removeItem("token");
  fetch("/logout", {
    method: "POST",
    credentials: "include",
  }).then(() => {
    window.location.href = "/";
  });
}

// Export for use in other files
window.getApiBaseUrl = getApiBaseUrl;
window.apiCall = apiCall;
window.logout = logout;
