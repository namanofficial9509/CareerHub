import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OnboardingLayout from './pages/onboarding/OnboardingLayout';
import Step1Identity from './pages/onboarding/Step1Identity';
import Step2Interests from './pages/onboarding/Step2Interests';
import Step3Skills from './pages/onboarding/Step3Skills';
import Step4Goals from './pages/onboarding/Step4Goals';
import Step5Community from './pages/onboarding/Step5Community';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import Portfolio from './pages/dashboard/Portfolio';
import CareerNavigator from './pages/dashboard/CareerNavigator';
import Community from './pages/dashboard/Community';
import Roadmap from './pages/dashboard/Roadmap';
import Insights from './pages/dashboard/Insights';
import AiHelper from './pages/dashboard/AiHelper';
import Challenges from './pages/dashboard/Challenges';
import ResumeAnalyzer from './pages/dashboard/ResumeAnalyzer';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route path="step-1" element={<Step1Identity />} />
            <Route path="step-2" element={<Step2Interests />} />
            <Route path="step-3" element={<Step3Skills />} />
            <Route path="step-4" element={<Step4Goals />} />
            <Route path="step-5" element={<Step5Community />} />
            <Route index element={<Step1Identity />} /> {/* Default to step 1 */}
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="career-navigator" element={<CareerNavigator />} />
            <Route path="community" element={<Community />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="ai-helper" element={<AiHelper />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="insights" element={<Insights />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
