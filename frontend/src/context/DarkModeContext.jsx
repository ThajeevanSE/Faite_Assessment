import React, { createContext, useState, useEffect } from "react";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
