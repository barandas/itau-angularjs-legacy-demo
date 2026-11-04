import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Cartoes } from './pages/Cartoes';
import { Home } from './pages/Home';
import { PendingMigration } from './pages/PendingMigration';
import { routeTitles } from './routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cartoes" element={<Cartoes />} />
        {Object.entries(routeTitles).map(
          ([path, title]) =>
            path !== '/' &&
            path !== '/cartoes' && (
              <Route key={path} path={path} element={<PendingMigration titulo={title} />} />
            )
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
