import React from "react";
import { Text, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { STYLES } from "@/constants/style.constants";

const HomePage: React.FC = () => {
  const handleHintClick = () => {
    showNotification({
      title: "Hint",
      message: "There's nothing here yet. Or is there? 👀",
      autoClose: 3500,
      position: "top-right",
    });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 text-center ${STYLES.MAIN_CONTENT_HEIGHT_MIN}`}
    >
      <h1 className="text-5xl font-extrabold font-mono mb-4">404FoundMe</h1>
      <Text size="md" mb={30} style={{ maxWidth: 600 }}>
        A small dev building useful, weird, and sometimes chaotic things with
        code.
      </Text>

      <Text size="lg" c="dimmed" mb={20} style={{ maxWidth: 600 }}>
        You're not lost. You're just early.
      </Text>
      <Button
        size="md"
        variant="default"
        onClick={handleHintClick}
        className="uppercase font-semibold tracking-wide"
        radius="xl"
        style={{ minWidth: 180 }}
      >
        Psst... Click me
      </Button>
    </div>
  );
};

export default HomePage;
