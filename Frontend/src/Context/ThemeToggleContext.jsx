import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  themeMode: "light",
  darkTheme: () => {},
  lightTheme: () => {},
});

export default function useTheme() {
  return useContext(ThemeContext);
}

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeMode");
    if (savedTheme) {
      setThemeMode(savedTheme);
      updateHtmlClass(savedTheme);
    }
  }, []);

  const updateHtmlClass = (mode) => {
    const html = document.documentElement; // important: must target <html>
    if (mode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  };

  const darkTheme = () => {
    setThemeMode("dark");
    localStorage.setItem("themeMode", "dark");
    updateHtmlClass("dark");
  };

  const lightTheme = () => {
    setThemeMode("light");
    localStorage.setItem("themeMode", "light");
    updateHtmlClass("light");
  };

  return (
    <ThemeContext.Provider value={{ themeMode, darkTheme, lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
