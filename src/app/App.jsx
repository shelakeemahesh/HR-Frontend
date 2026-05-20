import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from '../routes/index';
import useThemeStore from '../store/themeStore';

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
