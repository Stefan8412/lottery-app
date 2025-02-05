import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState(
    [...Array(30).keys()].map((n) => n + 1)
  ); // Numbers 1-30
  const [currentNumber, setCurrentNumber] = useState(null);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        setCurrentNumber(numbers[randomIndex]);
      }, 100); // Change number every 100ms while running

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [running, numbers]);

  const handleStart = () => {
    if (numbers.length > 0) {
      setRunning(true);
    }
  };

  const handleStop = () => {
    setRunning(false);
    if (numbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const selectedNumber = numbers[randomIndex];
      setCurrentNumber(selectedNumber);
      setSelectedNumbers([...selectedNumbers, selectedNumber]); // Store picked number
      setNumbers(numbers.filter((num) => num !== selectedNumber)); // Remove the selected number
    }
  };

  const resetGame = () => {
    setNumbers([...Array(30).keys()].map((n) => n + 1)); // Reset numbers 1-30
    setCurrentNumber(null);
    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900 ">
      <h1 className="text-5xl font-bold mb-4">🎰 PSK žrebovanie tomboly</h1>

      <div className="text-6xl font-bold bg-gray-800 px-8 py-4 rounded-lg">
        {currentNumber !== null ? currentNumber : "?"}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleStart}
          disabled={running || numbers.length === 0}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-lg text-white text-lg"
        >
          Štart
        </button>
        <button
          onClick={handleStop}
          disabled={!running}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 rounded-lg text-white text-lg"
        >
          Stop
        </button>
      </div>
      {/* Display selected numbers */}
      <div className="mt-6 text-lg text-center">
        <h2 className="text-xl font-bold mb-2">Vyžrebované čísla:</h2>
        {selectedNumbers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.map((num, index) => (
              <span
                key={index}
                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-lg font-bold"
              >
                {num}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">?????</p>
        )}
      </div>

      {numbers.length === 0 && (
        <div className="mt-4">
          <p className="text-yellow-400 text-lg">
            Všetky čísla boli vylosované!
          </p>
          <button
            onClick={resetGame}
            className="mt-3 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Reštar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
