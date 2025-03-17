
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlashcardProvider } from "./context/FlashcardContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet";

const queryClient = new QueryClient();

// JSON-LD structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Locnix.ai",
  "description": "AI-powered flashcard platform for faster learning and better retention",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "AI-Generated Flashcards",
    "Spaced Repetition",
    "Performance Analytics",
    "Collaborative Learning"
  ]
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FlashcardProvider>
          <Toaster />
          <Sonner />
          {/* Add Helmet for dynamic metadata and structured data */}
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(structuredData)}
            </script>
          </Helmet>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study" element={<Study />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FlashcardProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
