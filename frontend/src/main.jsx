import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../context/AuthContext.jsx"; // rename to AuthProvider for clarity
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
      <AuthContext>
        <App />
      </AuthContext>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
