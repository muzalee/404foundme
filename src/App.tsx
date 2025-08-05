import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import MazeGame from "./pages/projects/MazeGame";
import NotFoundPage from "./pages/NotFoundPage";
import { Layout } from "./components/Layout";
import { ROUTES } from "./constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NotFoundPage />} />
          <Route index element={<HomePage />} />
          <Route path={ROUTES.MAZE} element={<MazeGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
