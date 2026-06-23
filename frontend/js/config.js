// Centralized configuration for the API Base URL
// Detects if running locally (localhost, 127.0.0.1, or via local file protocol)
// to fall back to localhost, otherwise points to the Render backend URL.
const API_BASE = (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.protocol === 'file:'
) 
    ? 'http://localhost:5000' 
    : 'https://feedback-collection-backend.onrender.com'; // Change this string to your deployed Render service URL
