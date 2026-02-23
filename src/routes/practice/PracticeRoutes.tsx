import { Route, Routes } from 'react-router-dom';
import { PracticeAuthProvider } from '../../hooks/usePracticeAuth';
import { PracticeUserProvider } from '../../context/PracticeUserContext';
import PracticeSignIn from '../../pages/practice/PracticeSignIn';
import PracticeSignUp from '../../pages/practice/PracticeSignUp';
import PracticeProtectedRoute from '../../components/practice/PracticeProtectedRoute';
import PracticeDashboard from '../../pages/practice/PracticeDashboard';
import PracticeNavbar from '../../components/practice/PracticeNavbar';

function PracticeRoutes() {
  return (
    <PracticeAuthProvider>
      <PracticeUserProvider>
        <Routes>
          <Route path="/signin" element={<PracticeSignIn />} />
          <Route path="/signup" element={<PracticeSignUp />} />
          <Route path="/dashboard" element={
            <>
              <PracticeNavbar />
              <PracticeProtectedRoute>
                <PracticeDashboard />
              </PracticeProtectedRoute>
            </>
          } />
          <Route path="/forgot-password" element={<div>Forgot Password - Coming Soon</div>} />
        </Routes>
      </PracticeUserProvider>
    </PracticeAuthProvider>
  );
}

export default PracticeRoutes;