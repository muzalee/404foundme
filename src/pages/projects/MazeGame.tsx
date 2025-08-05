import React, { useState, useEffect, useRef } from "react";
import { Button, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { STYLES } from "@/constants";

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
      if (inBounds(nr, nc) && maze[nr][nc] === 1 && Math.random() > 0.2) {
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
  const [isMobile, setIsMobile] = useState(false);
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
      <div
        className={`flex items-center justify-center text-center ${STYLES.MAIN_CONTENT_HEIGHT}`}
      >
        <div>
          <h1 className="text-3xl font-bold mb-4">🚫 Desktop Only</h1>
          <p className="text-lg">
            This game is only available on desktop devices.
          </p>
          <Button
            size="md"
            variant="default"
            onClick={() => navigate("/")}
            radius="xl"
            mt={30}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex flex-col items-center justify-center select-none outline-none ${STYLES.MAIN_CONTENT_HEIGHT_MIN}`}
    >
      <h3 className="text-2xl font-bold mb-6">Maze Game</h3>

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

            let bgColor = "bg-gray-200 dark:bg-gray-900";

            if (cell === 1) bgColor = "bg-gray-500 dark:bg-gray-700";
            if (cell === 2) bgColor = "bg-green-600 dark:bg-green-500";
            if (isPlayer) bgColor = "bg-red-500";

            return (
              <div
                key={`${r}-${c}`}
                className={`${bgColor} w-6 h-6 rounded-sm border border-gray-300 dark:border-gray-700`}
              />
            );
          })
        )}
      </div>

      {hasWon && (
        <Text
          mt={30}
          fw={600}
          style={{
            backgroundColor: "var(--color-green-600)",
            color: "var(--color-white)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "1.125rem",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          🎉 You Win! Press R to Restart 🎉
        </Text>
      )}

      {!hasWon && (
        <Text
          size="md"
          mt={30}
          style={{
            color: "var(--color-gray-400)",
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Use arrow keys to move the yellow square through the maze to the green
          goal.
          <br />
          Press <b>R</b> to regenerate a new maze.
        </Text>
      )}
    </div>
  );
};

export default MazeGame;
