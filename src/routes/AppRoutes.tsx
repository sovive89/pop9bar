import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { ClientMenuPage } from "@/pages/ClientMenuPage";
import { ClientStartPage } from "@/pages/ClientStartPage";
import { LoginPage } from "@/pages/LoginPage";
import { ManagerValidationPage } from "@/pages/ManagerValidationPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PwaAccessQrPage } from "@/pages/PwaAccessQrPage";
import { ProductsPage } from "@/pages/ProductsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cliente" element={<ClientStartPage />} />
      <Route path="/cliente/menu" element={<ClientMenuPage />} />
      <Route path="/pwa-qr" element={<PwaAccessQrPage />} />
      <Route path="/gestor/validacao" element={<ManagerValidationPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="qr-acesso" element={<PwaAccessQrPage />} />
        <Route path="validacao" element={<ManagerValidationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
