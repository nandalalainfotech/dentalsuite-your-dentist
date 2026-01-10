import { Route, Routes } from 'react-router-dom';
import { PracticeAuthProvider } from '../../hooks/usePracticeAuth';
import PracticeSignIn from '../../pages/practice/PracticeSignIn';
import PracticeSignUp from '../../pages/practice/PracticeSignUp';
import PracticeProtectedRoute from '../../components/practice/PracticeProtectedRoute';
import PracticeDashboard from '../../pages/practice/PracticeDashboard';

function PracticeRoutes() {
  return (
    <PracticeAuthProvider>
      <Routes>
        <Route path="/signin" element={<PracticeSignIn />} />
        <Route path="/signup" element={<PracticeSignUp />} />
        <Route path="/dashboard" element={
          <PracticeProtectedRoute>
            <PracticeDashboard />
          </PracticeProtectedRoute>
        } />
        <Route path="/forgot-password" element={<div>Forgot Password - Coming Soon</div>} />
      </Routes>
    </PracticeAuthProvider>
  );
}

export default PracticeRoutes;