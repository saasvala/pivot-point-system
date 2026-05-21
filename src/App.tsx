import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import POSTerminal from "./pages/POSTerminal";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffManagement from "./pages/StaffManagement";
import AuditLog from "./pages/AuditLog";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Branches from "./pages/Branches";
import BranchesOverview from "./pages/BranchesOverview";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="nexuspos-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POSTerminal /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute allowedRoles={['super_admin', 'owner']}><StaffManagement /></ProtectedRoute>} />
              <Route path="/audit-log" element={<ProtectedRoute allowedRoles={['super_admin', 'owner', 'manager']}><AuditLog /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute allowedRoles={['super_admin', 'owner', 'manager']}><Inventory /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute allowedRoles={['super_admin', 'owner', 'manager']}><Reports /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/branches" element={<ProtectedRoute allowedRoles={['super_admin', 'owner']}><Branches /></ProtectedRoute>} />
              <Route path="/branches/overview" element={<ProtectedRoute allowedRoles={['super_admin', 'owner']}><BranchesOverview /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
