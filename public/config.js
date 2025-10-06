// // Frontend Configuration Utility
// // This file provides a centralized way to manage API URLs and configuration

// let apiBaseUrl = null;
// let configLoaded = false;

// // Function to get the API base URL
// async function getApiBaseUrl() {
//   if (configLoaded && apiBaseUrl) {
//     return apiBaseUrl;
//   }

//   try {
//     const response = await fetch("/config");
//     const config = await response.json();
//     apiBaseUrl = config.apiBaseUrl;
//     configLoaded = true;
//     console.log("API Configuration loaded:", config);
//     return apiBaseUrl;
//   } catch (error) {
//     console.error("Failed to load API configuration:", error);
//     // Fallback to localhost for development
//     apiBaseUrl = "http://localhost:3001";
//     configLoaded = true;
//     return apiBaseUrl;
//   }
// }

// // Function to make API calls with automatic URL resolution
// async function apiCall(endpoint, options = {}) {
//   const baseUrl = await getApiBaseUrl();
//   const url = `${baseUrl}${endpoint}`;

//   // Add credentials to all requests
//   const defaultOptions = {
//     credentials: "include",
//     ...options,
//   };

//   return fetch(url, defaultOptions);
// }

// // Export for use in other files
// window.getApiBaseUrl = getApiBaseUrl;
// window.apiCall = apiCall;
