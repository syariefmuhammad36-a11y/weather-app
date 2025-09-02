import { useState } from "react";

export default function useLocalStorage(key, initial) {
  const stored = localStorage.getItem(key);
  const [value, setValue] = useState(stored ? JSON.parse(stored) : initial);

  const setStoredValue = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, setStoredValue];
}