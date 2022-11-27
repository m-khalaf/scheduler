import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      // history[history.length - 1] = newMode;//needs to be replaced
      setHistory(prev => {
        const newHistory = [...prev]
        newHistory.pop()
        newHistory.push(mode)
        console.log("replacing:", history)
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
    history.pop(); //needs to be replaced
    // setHistory((current) => {
    //   current.splice(current.length - 1, 1)
    //   return current;
    // });
    setMode(history[history.length - 1]);
  }

  return { mode, transition, back };
}