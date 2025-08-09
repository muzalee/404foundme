import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import MazeGame from "./pages/projects/MazeGame";
import NotFoundPage from "./pages/NotFoundPage";
import { Layout } from "./components/Layout";
import { ROUTES } from "./constants";
import LoginPage from "./pages/LoginPage";
import SalaryPage from "./pages/projects/salary/SalaryPage";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { PublicRoute } from "./guards/PublicRoute";
import EditSalaryPage from "./pages/projects/salary/EditSalaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NotFoundPage />} />
          <Route index element={<HomePage />} />
          <Route path={ROUTES.MAZE} element={<MazeGame />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.SALARY} element={<SalaryPage />} />
            <Route
              path={ROUTES.SALARY_EDIT(":id")}
              element={<EditSalaryPage />}
            />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
