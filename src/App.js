import { useState, useEffect } from "react";
import "./App.css";

export default function LotteryApp() {
  const [yellowNumbers, setYellowNumbers] = useState(
    [...Array(100).keys()].map((n) => n + 1)
  ); // Green numbers 1-30
  const [redNumbers, setRedNumbers] = useState(
    [...Array(100).keys()].map((n) => n + 1)
  ); // Blue numbers 1-30
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentColor, setCurrentColor] = useState(null); // Tracks if number is from green or blue
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [pickedNumbers, setPickedNumbers] = useState([]); // Stores picked numbers

  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        const pickYellow = Math.random() < 0.5; // 50% chance for green or blue
        const availableNumbers = pickYellow ? yellowNumbers : redNumbers;

        if (availableNumbers.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableNumbers.length
          );
          setCurrentNumber(availableNumbers[randomIndex]);
          setCurrentColor(pickYellow ? "yellow" : "red");
        }
      }, 100); // Change number every 100ms while running

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [running, yellowNumbers, redNumbers]);

  const handleStart = () => {
    if (yellowNumbers.length > 0 || redNumbers.length > 0) {
      setRunning(true);
    }
  };

  const handleStop = () => {
    setRunning(false);
    if (yellowNumbers.length > 0 || redNumbers.length > 0) {
      const pickYellow = Math.random() < 0.5; // 50% chance for green or blue
      const availableNumbers = pickYellow ? yellowNumbers : redNumbers;

      if (availableNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers[randomIndex];

        setCurrentNumber(selectedNumber);
        setCurrentColor(pickYellow ? "yellow" : "red");
        setPickedNumbers([
          ...pickedNumbers,
          { number: selectedNumber, color: pickYellow ? "yellow" : "red" },
        ]);

        if (pickYellow) {
          setYellowNumbers(
            yellowNumbers.filter((num) => num !== selectedNumber)
          );
        } else {
          setRedNumbers(redNumbers.filter((num) => num !== selectedNumber));
        }
      }
    }
  };

  const resetGame = () => {
    setYellowNumbers([...Array(100).keys()].map((n) => n + 1));
    setRedNumbers([...Array(100).keys()].map((n) => n + 1));
    setCurrentNumber(null);
    setCurrentColor(null);
    setRunning(false);
    setPickedNumbers([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">🎰 PSK Tombola</h1>

      <div
        className={`text-[18rem] font-bold px-15 py-55 rounded-lg ${
          currentNumber === null
            ? "bg-gray-900"
            : currentColor === "yellow"
            ? "bg-yellow-300"
            : "bg-red-500"
        }`}
      >
        {currentNumber !== null ? currentNumber : "??"}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleStart}
          disabled={
            running || (yellowNumbers.length === 0 && redNumbers.length === 0)
          }
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-lg text-white text-lg"
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
              key={index}
              className={`px-4 py-2 text-lg font-bold rounded-lg ${
                item.color === "yellow" ? "bg-yellow-300" : "bg-red-500"
              }`}
            >
              {item.number}
            </span>
          ))}
        </div>
      </div>

      {yellowNumbers.length === 0 && redNumbers.length === 0 && (
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
    </div>
  );
}
