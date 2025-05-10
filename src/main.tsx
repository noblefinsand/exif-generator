import { Provider, defaultTheme, ToastContainer } from "@adobe/react-spectrum";
import { createRoot } from "react-dom/client";
import "./index.css";
import UploadFile from "./components/UploadFile";
import { ExifProvider } from "./context/context";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <Provider theme={defaultTheme} colorScheme="light">
      <ExifProvider>
        <ToastContainer />
        <UploadFile />
      </ExifProvider>
    </Provider>
  );
} else {
  throw new Error("Root element not found");
}
