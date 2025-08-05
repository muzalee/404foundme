import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import MazeGame from "./pages/games/MazeGame";
import NotFoundPage from "./pages/NotFoundPage";
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/games/maze" element={<MazeGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
