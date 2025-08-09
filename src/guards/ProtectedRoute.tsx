import { Navigate, useLocation, Outlet } from "react-router";
import { TokenUtil } from "@/utils/token.util";
import { ROUTES } from "@/constants";

export const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = TokenUtil.hasToken();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
