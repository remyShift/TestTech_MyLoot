import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TeamPage } from './pages/TeamPage';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/teams/:id" element={<TeamPage />} />
          <Route path="/" element={<Navigate to="/teams/1" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
