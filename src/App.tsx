import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdmissionForm from "./pages/AdmissionForm";
import StudentsPortal from "./pages/StudentsPortal";
import Suffa from "./pages/Suffa";
import BookStore from "./pages/BookStore";
import NotFound from "./pages/NotFound";
import VisitorGate from "./components/VisitorGate";

const queryClient = new QueryClient();

function VisitorGateWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [identified, setIdentified] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('visitor_info');
    if (stored) setIdentified(true);
  }, []);

  // Skip gate for admin page
  if (location.pathname === '/admin') {
    return <>{children}</>;
  }

  if (!identified) {
    return (
      <VisitorGate
        onSubmit={(name, email) => {
          localStorage.setItem('visitor_info', JSON.stringify({ name, email }));
          setIdentified(true);
        }}
      />
    );
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VisitorGateWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/suffa" element={<Suffa />} />
            <Route path="/students-portal" element={<StudentsPortal />} />
            <Route path="/bookstore" element={<BookStore />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VisitorGateWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
