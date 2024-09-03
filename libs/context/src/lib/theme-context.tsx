import { createContext, PropsWithChildren, useState } from 'react';

export const ThemeContext = createContext({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => {
    // Default implementation for toggleTheme
  },
});

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  document.documentElement.setAttribute('data-bs-theme', theme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
