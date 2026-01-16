import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const COLOR_SETTINGS = {
  green: { numbers: 68, probability: 0.4, confettiColor: "green" }, // 40%
  /* greenT: { numbers: 50, probability: 0.4, confettiColor: "green" }, // 40% */
  red: { numbers: 50, probability: 0.4, confettiColor: "red" }, // 30%
  // rose: { numbers: 100, probability: 0.3, confettiColor: "red" }, // 30%
  /*  purpleT: { numbers: 100, probability: 0.5, confettiColor: "purple" }, */
  blue: { numbers: 51, probability: 0.4, confettiColor: "blue" }, // 20%
  // blueL: { numbers: 100, probability: 0.4, confettiColor: "blue" }, // 20%
  orange: { numbers: 49, probability: 0.4, confettiColor: "orange" }, // 20%
  /* orangeT: { numbers: 50, probability: 0.2, confettiColor: "orange" }, // 20% */
  purple: { numbers: 44, probability: 0.4, confettiColor: "purple" }, // 10%
  /*   yellow: { numbers: 100, probability: 0.1, confettiColor: "yellow" }, // 10%
  yellowT: { numbers: 100, probability: 0.3, confettiColor: "yellow" }, // 10% */
  brown: { numbers: 36, probability: 0.4, confettiColor: "brown" }, // 10%
  // brownT: { numbers: 100, probability: 0.4, confettiColor: "brown" }, // 10%
  stone: { numbers: 34, probability: 0.4, confettiColor: "stone" },
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
    // Initialize pools on first load
    const initialPools = {};
    for (const color in COLOR_SETTINGS) {
      if (color === "purpleT") {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => `${n + 1}T`);
      } else if (color === "brownT") {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => `${n + 1}T`);
      } else if (color === "yellowT") {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => `${n + 1}T`);
      } else if (color === "orangeT") {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => `${n + 1}T`);
      } else if (color === "greenT") {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => `${n + 1}T`);
      } else {
        initialPools[color] = [
          ...Array(COLOR_SETTINGS[color].numbers).keys(),
        ].map((n) => n + 1);
      }
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

  const handleStart = useCallback(() => {
    if (Object.values(colorPools).some((arr) => arr.length > 0)) {
      setRunning(true);
      setShowConfetti(false);
    }
  }, [colorPools]); // Only changes if colorPools changes

  const handleStop = useCallback(() => {
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
  }, [currentNumber, currentColor]); // Changes if the current selection changes

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || "ArrowLeft" || "ArrowRight") {
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
  }, [
    running,
    currentColor,
    currentNumber,
    colorPools,
    handleStart,
    handleStop,
  ]);

  /* const resetGame = () => {
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
  }; */

  const colorClasses = {
    green: "bg-green-500",
    // greenT: "bg-green-500",
    red: "bg-red-600",
    // rose: "bg-rose-950",
    // purpleT: "bg-purple-500", // use same color
    blue: "bg-blue-500",
    // blueL: "bg-cyan-300",
    purple: "bg-purple-300",
    orange: "bg-orange-500",
    // orangeT: "bg-orange-500",
    // yellow: "bg-yellow-300",
    // yellowT: "bg-yellow-300",
    brown: "bg-orange-200",
    // brownT: "bg-yellow-700",
    stone: "bg-stone-300",
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#0f172a] text-white p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse" />
      </div>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={400}
          recycle={false}
          colors={[COLOR_SETTINGS[currentColor]?.confettiColor || "white"]}
        />
      )}

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
          Tombola <span className="text-blue-500">PSK</span>
        </h1>
        <div className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>

      {/* Main Display Area */}
      <div className="relative z-10 group">
        {/* Glow effect behind the number */}
        <div
          className={`absolute inset-0 blur-[60px] opacity-30 transition-colors duration-500 rounded-full ${
            currentNumber === null ? "bg-blue-900" : colorClasses[currentColor]
          }`}
        />

        <div
          className={`relative flex items-center justify-center w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-[4rem] transition-all duration-300 border-t border-white/10 shadow-2xl ${
            currentNumber === null
              ? "bg-white/5 backdrop-blur-xl border border-white/5"
              : `${colorClasses[currentColor]} shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]`
          }`}
        >
          <span
            className={`text-[12rem] md:text-[20rem] font-black tabular-nums tracking-tighter drop-shadow-lg ${
              currentColor === "brown" || currentColor === "stone"
                ? "text-gray-900"
                : "text-white"
            }`}
          >
            {currentNumber !== null ? currentNumber : "??"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-12 flex space-x-6">
        <button
          onClick={handleStart}
          disabled={
            running ||
            Object.values(colorPools).every((arr) => arr.length === 0)
          }
          className="group relative px-10 py-4 bg-white text-gray-900 font-bold text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="relative z-10">SPUSTIŤ</span>
          <div className="absolute inset-0 bg-white rounded-2xl blur-md group-hover:blur-lg opacity-30 transition-all"></div>
        </button>

        <button
          onClick={handleStop}
          disabled={!running}
          className="px-10 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 font-bold text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 border border-red-500/30"
        >
          ZASTAVIŤ
        </button>
      </div>

      {/* Picked Numbers Section */}
      <div className="relative z-10 mt-16 w-full max-w-5xl">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
          <h2 className="text-gray-400 font-medium uppercase tracking-widest text-sm">
            História losovania
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 px-4">
          {pickedNumbers
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className={`w-14 h-14 flex items-center justify-center text-lg font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all ${
                  colorClasses[item.color]
                } ${
                  item.color === "brown" || item.color === "stone"
                    ? "text-gray-900"
                    : "text-white"
                }`}
              >
                {item.number}
              </div>
            ))}
        </div>
      </div>

      <footer className="relative z-10 mt-auto py-8 text-gray-600 text-xs tracking-widest uppercase">
        &copy; {year} &bull; Prešovský Samosprávny Kraj &bull; Odbor IT
      </footer>
    </div>
  );
}
