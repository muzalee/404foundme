import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import MazeGame from "./pages/games/MazeGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/maze" element={<MazeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
