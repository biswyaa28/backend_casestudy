// Import React's DOM renderer to mount our app into the page.
import { createRoot } from "react-dom/client";
// Import BrowserRouter so our app can use page routing.
import { BrowserRouter } from "react-router-dom";
// Import our main App component.
import App from "./App.jsx";
// Import our plain CSS file (applies to the whole app).
import "./index.css";

// Render the App, wrapped in BrowserRouter, into the #root div in index.html.
// (No StrictMode wrapper, as requested.)
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
