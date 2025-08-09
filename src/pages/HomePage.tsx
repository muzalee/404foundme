import React from "react";
import { Text, Button, Group } from "@mantine/core";
import { STYLES } from "@/constants";
import { useNotification } from "@/hooks";

const HomePage: React.FC = () => {
  const { showNotification } = useNotification();

  const handleHintClick = () => {
    showNotification({
      title: "Hint",
      message: "There's nothing here yet. Or is there? 👀",
    });
  };

  const handleContactClick = () => {
    window.open("mailto:contact@404foundme.xyz");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${STYLES.MAIN_CONTENT_HEIGHT_MIN}`}
    >
      <h1 className="text-5xl font-extrabold font-mono mb-4">404FoundMe</h1>
      <Text size="md" mb={30} style={{ maxWidth: 600 }}>
        A small dev building useful, weird, and sometimes chaotic things with
        code.
      </Text>

      <Text size="lg" c="dimmed" mb={30} style={{ maxWidth: 600 }}>
        You're not lost. You're just early.
      </Text>

      <Group gap="md" align="center" justify="center">
        <Button
          size="md"
          variant="default"
          onClick={handleHintClick}
          radius="xl"
          style={{ minWidth: 180 }}
        >
          Psst... Click me
        </Button>

        <Button
          size="md"
          variant="default"
          onClick={handleContactClick}
          radius="xl"
          style={{ minWidth: 180 }}
        >
          Say Hello
        </Button>
      </Group>
    </div>
  );
};

export default HomePage;
