import { useState, useEffect } from "react";
import "./App.css";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const COLOR_SETTINGS = {
  green: { numbers: 69, probability: 0.4, confettiColor: "green" }, // 40%
  red: { numbers: 100, probability: 0.3, confettiColor: "red" }, // 30%
  blue: { numbers: 50, probability: 0.2, confettiColor: "blue" }, // 20%
  purple: { numbers: 30, probability: 0.1, confettiColor: "purple" }, // 10%
};

export default function LotteryApp() {
  const date = new Date();
  const year = date.getFullYear();
  const [colorPools, setColorPools] = useState({});
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [running, setRunning] = useState(false);
  const [pickedNumbers, setPickedNumbers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || "ArrowLeft" || "ArrowRight ") {
        e.preventDefault(); // Prevent page scroll when space is pressed
        if (!running) {
          handleStart();
        } else {
          handleStop();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running, currentColor, currentNumber, colorPools]);

  useEffect(() => {
    // Initialize pools on first load
    const initialPools = {};
    for (const color in COLOR_SETTINGS) {
      initialPools[color] = [
        ...Array(COLOR_SETTINGS[color].numbers).keys(),
      ].map((n) => n + 1);
    }
    setColorPools(initialPools);
  }, []);

  useEffect(() => {
    let intervalId;
    if (running) {
      intervalId = setInterval(() => {
        const { color, number } = getRandomPick();
        setCurrentColor(color);
        setCurrentNumber(number);
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [running, colorPools]);

  const getRandomPick = () => {
    const availableColors = Object.keys(colorPools).filter(
      (color) => colorPools[color].length > 0
    );

    if (availableColors.length === 0) return { color: null, number: null };

    // Weighted random pick based on probability
    const weightedColors = availableColors.flatMap((color) =>
      Array(Math.floor(COLOR_SETTINGS[color].probability * 100)).fill(color)
    );

    const randomColor =
      weightedColors[Math.floor(Math.random() * weightedColors.length)];
    const numbers = colorPools[randomColor];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

    return { color: randomColor, number: randomNumber };
  };

  const handleStart = () => {
    if (Object.values(colorPools).some((arr) => arr.length > 0)) {
      setRunning(true);
      setShowConfetti(false);
    }
  };

  const handleStop = () => {
    setRunning(false);
    if (currentNumber !== null && currentColor !== null) {
      setPickedNumbers((prev) => [
        ...prev,
        { number: currentNumber, color: currentColor },
      ]);
      setColorPools((prev) => ({
        ...prev,
        [currentColor]: prev[currentColor].filter(
          (num) => num !== currentNumber
        ),
      }));

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const resetGame = () => {
    const newPools = {};
    for (const color in COLOR_SETTINGS) {
      newPools[color] = [...Array(COLOR_SETTINGS[color].numbers).keys()].map(
        (n) => n + 1
      );
    }
    setColorPools(newPools);
    setCurrentNumber(null);
    setCurrentColor(null);
    setRunning(false);
    setPickedNumbers([]);
    setShowConfetti(false);
  };

  const colorClasses = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          colors={[COLOR_SETTINGS[currentColor]?.confettiColor || "white"]}
        />
      )}

      <h1 className="text-5xl font-bold mb-4">🎰 Deň PSK </h1>

      <div
        className={`text-[18rem] font-bold px-15 py-55 rounded-lg ${
          currentNumber === null
            ? "bg-gray-900"
            : colorClasses[currentColor] || "bg-gray-500"
        }`}
      >
        {currentNumber !== null ? currentNumber : "??"}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleStart}
          disabled={
            running ||
            Object.values(colorPools).every((arr) => arr.length === 0)
          }
          className="px-6 py-3 bg-blue-500 hover:bg-green-600 disabled:bg-gray-500 rounded-lg text-white text-lg"
        >
          Štart
        </button>
        <button
          onClick={handleStop}
          disabled={!running}
          className="px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-gray-500 rounded-lg text-white text-lg"
        >
          Zastaviť
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Vyžrebované čísla:</h2>
        <div className="mt-2 flex flex-wrap justify-center space-x-2">
          {pickedNumbers.map((item, index) => (
            <span
              key={`${item.number}-${item.color}-${index}`}
              className={`px-4 py-2 text-lg font-bold rounded-lg ${
                colorClasses[item.color] || "bg-gray-500"
              }`}
            >
              {item.number}
            </span>
          ))}
        </div>
      </div>

      {Object.values(colorPools).every((arr) => arr.length === 0) && (
        <div className="mt-4">
          <p className="text-yellow-400 text-lg">
            Všetky čísla boli vylosované!
          </p>
          <button
            onClick={resetGame}
            className="mt-3 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Reštart losovania
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4 mt-8">
        <p className="text-sm">
          &copy; Copyright {year} - Made with{" "}
          <span aria-label="love" role="img">
            💖
          </span>{" "}
          in Presov by PSK. All right reserved.{" "}
        </p>
      </div>
    </div>
  );
}
