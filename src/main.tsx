import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LoadingProvider } from "./hooks";
import { ModalsProvider } from "@mantine/modals";

createRoot(document.getElementById("root")!).render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications />
    <ModalsProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </ModalsProvider>
  </MantineProvider>
);
