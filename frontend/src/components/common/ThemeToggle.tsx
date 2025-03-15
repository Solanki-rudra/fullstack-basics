import React from "react";
import { Switch } from "antd";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Switch checked={darkMode} onChange={toggleTheme} checkedChildren="🌙" unCheckedChildren="☀️" />
  );
};

export default ThemeToggle;
