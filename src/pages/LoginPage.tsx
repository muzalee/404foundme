import React from "react";
import { Text, Button, Paper, TextInput, PasswordInput } from "@mantine/core";
import { STYLES } from "@/constants";
import { useLoading, useNotification } from "@/hooks";
import { authService } from "@/services/auth.service";
import { TokenUtil } from "@/utils/token.util";
import { useLocation, useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const { startLoading, stopLoading } = useLoading();
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    authService
      .login({ username: formData.username, password: formData.password })
      .then((response) => {
        showSuccess({ message: "Login successful" });
        TokenUtil.setToken(response.data?.token ?? "");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        showError({
          message: error.message,
        });
      })
      .finally(() => {
        stopLoading();
      });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${STYLES.MAIN_CONTENT_HEIGHT_MIN}`}
    >
      <Text size="lg" fw={500} ta="center">
        Sign In to Access the Page
      </Text>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
          <TextInput
            label="Email/Username"
            placeholder="you@email.com"
            required
            radius="md"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            mt="md"
            radius="md"
          />
          <Button type="submit" variant="outline" fullWidth mt="xl" radius="xl">
            Sign in
          </Button>
        </Paper>
      </form>
    </div>
  );
};

export default LoginPage;
