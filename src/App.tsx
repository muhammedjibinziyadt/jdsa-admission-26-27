import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdmissionForm from "./pages/AdmissionForm";
import StudentsPortal from "./pages/StudentsPortal";
import Suffa from "./pages/Suffa";
import BookStore from "./pages/BookStore";
import CommitteeHub from "./pages/CommitteeHub";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/hooks/useTheme";
import AIAssistant from "@/components/AIAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/suffa" element={<Suffa />} />
          <Route path="/students-portal" element={<StudentsPortal />} />
          <Route path="/bookstore" element={<BookStore />} />
          <Route path="/committee" element={<CommitteeHub />} />
          <Route path="/committee/:id" element={<CommitteeHub />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
