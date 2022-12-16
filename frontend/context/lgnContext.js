import { createContext, useContext, useState } from "react";

const Context = createContext();

export function LgnProvider({ children }) {
  const [item, setItem] = useState("");
  return (
    <Context.Provider value={[item, setItem]}>{children}</Context.Provider>
  );
}

export function useLgnProvider() {
  return useContext(Context);
}
