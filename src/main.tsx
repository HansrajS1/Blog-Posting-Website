import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />); 
// The exclamation mark (!) is a TypeScript non-null assertion operator
