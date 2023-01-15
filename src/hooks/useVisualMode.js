import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      setHistory(prev => {
        const newHistory = [...prev]
        newHistory.pop()
        newHistory.push(newMode)
        return newHistory
      });
      setMode(newMode);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev, newMode]);
    }
  }


  const back = function () {
    if (history.length === 1) return;
    setMode(history[history.length - 2]);
    setHistory(prev => {
      const newHistory = [...prev]
      newHistory.pop();
      return newHistory;
    });
  }

  return { mode, transition, back };
}