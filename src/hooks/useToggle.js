import { useState } from "react";

export default function useToggle(initial = true) {
  const [state, setState] = useState(initial);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle];
}