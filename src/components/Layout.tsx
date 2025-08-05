import whiteLogo from "@/assets/logo-white.svg";
import blackLogo from "@/assets/logo-black.svg";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Link, Outlet } from "react-router";
import { IconExternalLink, IconMoon, IconSun } from "@tabler/icons-react";

export function Layout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <AppShell header={{ height: 60 }} footer={{ height: 30 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to="/">
              <img
                src={isDark ? whiteLogo : blackLogo}
                alt="Logo"
                className="h-6 sm:h-7 cursor-pointer"
              />
            </Link>
            <Group ml="xl" gap={0}>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {isDark ? (
                  <IconSun size="1.1rem" />
                ) : (
                  <IconMoon size="1.1rem" />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer
        withBorder={false}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px 4px 16px",
        }}
      >
        <Text size="sm">&copy; {new Date().getFullYear()} muza</Text>

        <Anchor
          href="https://github.com/muzalee/404foundme"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          c="var(--mantine-color-text)"
        >
          <span className="inline-flex items-center gap-2">
            GitHub Repo
            <IconExternalLink size={16} />
          </span>
        </Anchor>
      </AppShell.Footer>
    </AppShell>
  );
}
