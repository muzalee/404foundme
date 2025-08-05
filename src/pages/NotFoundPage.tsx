import React from "react";
import { Button, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { STYLES } from "@/constants";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${STYLES.MAIN_CONTENT_HEIGHT_MIN}`}
    >
      <h1 className="text-6xl font-extrabold font-mono mb-4">404</h1>

      <Text size="lg" c="dimmed" mb={30} style={{ maxWidth: 600 }}>
        Oops, the page you're looking for doesn't exist.
      </Text>

      <Button
        size="md"
        variant="default"
        onClick={() => navigate("/")}
        radius="xl"
        style={{ minWidth: 180 }}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
