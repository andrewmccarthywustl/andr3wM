// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Photography from "./pages/Photography";
import MyWorks from "./pages/MyWorks";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import BlogPost from "./pages/BlogPost";
import BlogPostEditor from "./components/BlogPostEditor";
import GoogleAnalytics from "./components/GoogleAnalytics"; // Add this import

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading..." />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        {/* Blog routes in order of specificity */}
        <Route path="/blog/new" element={<BlogPostEditor />} />
        <Route path="/blog/edit/:id" element={<BlogPostEditor />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/blog" element={<Blog />} />
        {/* Other routes */}
        <Route path="/photography" element={<Photography />} />
        <Route path="/my-works/photography" element={<Photography />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  // Replace GA_MEASUREMENT_ID with your actual Google Analytics ID
  const googleAnalyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  return (
    <AuthProvider>
      <Router>
        <GoogleAnalytics measurementId={googleAnalyticsId} />
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
