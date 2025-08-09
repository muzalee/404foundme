import { Navigate, Outlet } from "react-router";
import { TokenUtil } from "@/utils/token.util";
import { ROUTES } from "@/constants";

export const PublicRoute = () => {
  const isAuthenticated = TokenUtil.hasToken();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
