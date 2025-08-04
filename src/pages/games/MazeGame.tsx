import Footer from "@/components/Footer";
import React, {
  useState,
  useEffect,
  useRef,
  useState as useReactState,
} from "react";
import { useNavigate } from "react-router";

type Cell = 0 | 1 | 2; // 0 = path, 1 = wall, 2 = goal

const ROWS = 21;
const COLS = 21;

interface Pos {
  row: number;
  col: number;
}

const startPos: Pos = { row: 1, col: 1 };

const directions = [
  { dr: -2, dc: 0 },
  { dr: 2, dc: 0 },
  { dr: 0, dc: -2 },
  { dr: 0, dc: 2 },
];

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMaze(rows: number, cols: number): Cell[][] {
  const maze: Cell[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(1)
  );

  function inBounds(r: number, c: number) {
    return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
  }

  function carvePassagesFrom(r: number, c: number) {
    maze[r][c] = 0;
    const dirs = shuffleArray(directions.slice());

    for (const { dr, dc } of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0;
        carvePassagesFrom(nr, nc);
      }
    }
  }

  carvePassagesFrom(startPos.row, startPos.col);

  // Place goal at bottom-right reachable path
  outer: for (let r = rows - 2; r >= 0; r--) {
    for (let c = cols - 2; c >= 0; c--) {
      if (maze[r][c] === 0) {
        maze[r][c] = 2;
        break outer;
      }
    }
  }

  return maze;
}

const MazeGame: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<Pos>(startPos);
  const [hasWon, setHasWon] = useState(false);
  const [isMobile, setIsMobile] = useReactState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    if (width >= 768) {
      const newMaze = generateMaze(ROWS, COLS);
      setMaze(newMaze);
      setPlayerPos(startPos);
      setHasWon(false);
      containerRef.current?.focus();
    }
  }, []);

  const movePlayer = (dRow: number, dCol: number) => {
    if (hasWon) return;
    const newRow = playerPos.row + dRow;
    const newCol = playerPos.col + dCol;

    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] !== 1
    ) {
      setPlayerPos({ row: newRow, col: newCol });
      if (maze[newRow][newCol] === 2) {
        setHasWon(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
        movePlayer(-1, 0);
        break;
      case "ArrowDown":
        movePlayer(1, 0);
        break;
      case "ArrowLeft":
        movePlayer(0, -1);
        break;
      case "ArrowRight":
        movePlayer(0, 1);
        break;
      case "r":
      case "R": {
        const newMaze = generateMaze(ROWS, COLS);
        setMaze(newMaze);
        setPlayerPos(startPos);
        setHasWon(false);
        break;
      }
    }
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-center px-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">🚫 Desktop Only</h1>
          <p className="text-lg">
            This game is only available on desktop devices.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-5 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            Back to Home
          </button>

          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col items-center justify-start min-h-screen px-4 py-6 text-white select-none outline-none"
    >
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-1.5 text-sm border border-white text-white rounded hover:bg-white hover:text-black hover:bg-opacity-20 transition-colors backdrop-blur cursor-pointer"
        >
          Home
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6">Random Maze Game</h1>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1.5rem)`,
          gridTemplateRows: `repeat(${ROWS}, 1.5rem)`,
          gap: "2px",
        }}
      >
        {maze.flatMap((row, r) =>
          row.map((cell, c) => {
            const isPlayer = playerPos.row === r && playerPos.col === c;
            let bgColor = "bg-gray-900";

            if (cell === 1) bgColor = "bg-gray-700";
            if (cell === 2) bgColor = "bg-emerald-500";
            if (isPlayer) bgColor = "bg-yellow-400";

            return (
              <div
                key={`${r}-${c}`}
                className={`${bgColor} w-6 h-6 rounded-sm border border-gray-800`}
              />
            );
          })
        )}
      </div>

      {hasWon && (
        <div className="mt-6 p-4 bg-green-600 rounded text-white text-lg font-semibold animate-fadeIn">
          🎉 You Win! Press R to Restart 🎉
        </div>
      )}

      {!hasWon && (
        <p className="mt-6 text-gray-400 max-w-xl text-center">
          Use arrow keys to move the yellow square through the maze to the green
          goal.
          <br />
          Press <b>R</b> to regenerate a new maze.
        </p>
      )}

      <Footer />
    </div>
  );
};

export default MazeGame;
