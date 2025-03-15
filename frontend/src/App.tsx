import React from 'react';
import AppRoutes from './routes/AppRoutes';
import AppLayout from './pages/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import "./styles/globle.css"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
