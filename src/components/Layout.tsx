import whiteLogo from "@/assets/logo-white.svg";
import blackLogo from "@/assets/logo-black.svg";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Group,
  Menu,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Link, Outlet, useNavigate } from "react-router";
import {
  IconExternalLink,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { ROUTES } from "@/constants";
import { TokenUtil } from "@/utils/token.util";

export function Layout() {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const projects = [
    { name: "Maze Game", path: ROUTES.MAZE },
    { name: "Salary Calculator", path: ROUTES.SALARY },
    { name: "More Coming..." },
  ];

  const handleLogout = () => {
    TokenUtil.removeToken();
    navigate(ROUTES.HOME);
  };

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
            <Group ml="xl" gap="sm">
              <Menu shadow="md" width={200} withArrow position="bottom-end">
                <Menu.Target>
                  <button
                    className="px-1 sm:px-3 py-1 rounded hover:bg-gray-100 hover:text-black dark:hover:bg-zinc-700 dark:hover:text-gray-300 text-gray-900 dark:text-gray-200 cursor-pointer"
                    style={{ fontWeight: 500, fontSize: "14px" }}
                  >
                    Projects
                  </button>
                </Menu.Target>

                <Menu.Dropdown>
                  {projects.map((project) => (
                    <Menu.Item
                      key={project.path}
                      component={Link}
                      disabled={!project.path}
                      to={project.path || "#"}
                    >
                      {project.name}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
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
              {TokenUtil.hasToken() && (
                <ActionIcon
                  variant="default"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <IconLogout size="1.1rem" />
                </ActionIcon>
              )}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div className="px-4 pt-4 sm:px-12 sm:pt-6 pb-4">
          <Outlet />
        </div>
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
