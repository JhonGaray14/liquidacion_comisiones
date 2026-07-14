import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}