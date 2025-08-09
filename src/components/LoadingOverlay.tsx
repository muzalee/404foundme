import { Text, Transition, Overlay, Loader } from "@mantine/core";
import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({
  visible,
  message = "Loading",
}: Readonly<LoadingOverlayProps>) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Transition mounted={visible} transition="fade" duration={200}>
      {(styles) => (
        <Overlay
          style={{ ...styles }}
          color="#000"
          zIndex={1000}
          blur={3}
          opacity={1}
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader type="bars" />
              {message && (
                <Text c="white" className="tracking-wide text-center text-lg">
                  {message}
                  {dots}
                </Text>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </Transition>
  );
}
