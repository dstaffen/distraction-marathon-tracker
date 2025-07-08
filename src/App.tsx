
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import Categories from "./pages/Categories";
import Blog from "./pages/Blog";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CreatePost from "./pages/CreatePost";
import Analytics from "./pages/Analytics";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-entry" element={<AddEntry />} />
              <Route path="categories" element={<Categories />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/posts" element={<BlogList />} />
              <Route path="blog/post/:id" element={<BlogPost />} />
              <Route path="blog/create" element={<CreatePost />} />
              <Route path="blog/edit/:id" element={<CreatePost />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
