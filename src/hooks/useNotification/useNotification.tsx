import { STRINGS } from "@/constants";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";

type ShowOptions = {
  title?: string;
  message?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

export function useNotification() {
  const showSuccess = ({
    title = "Success",
    message,
    position = "top-right",
  }: ShowOptions) => {
    notifications.show({
      title,
      message,
      position,
      color: "green",
      icon: <IconCheck size={18} />,
      autoClose: 3000,
      withCloseButton: false,
      withBorder: true,
    });
  };

  const showWarning = ({
    title = "Warning",
    message,
    position = "top-right",
  }: ShowOptions) => {
    notifications.show({
      title,
      message,
      position,
      color: "orange",
      icon: <IconExclamationMark size={18} />,
      autoClose: 3000,
      withCloseButton: false,
      withBorder: true,
    });
  };

  const showError = ({
    title = "Error",
    message = STRINGS.ERROR_MESSAGES.AN_ERROR_OCCURRED,
    position = "top-right",
  }: ShowOptions) => {
    notifications.show({
      title,
      message,
      position,
      color: "red",
      icon: <IconX size={18} />,
      autoClose: false,
      withCloseButton: true,
      withBorder: true,
    });
  };

  const showNotification = ({
    title,
    message,
    position = "top-right",
  }: ShowOptions) => {
    notifications.show({
      title,
      message,
      position,
      autoClose: 3000,
      withBorder: true,
    });
  };

  return { showSuccess, showWarning, showError, showNotification };
}
