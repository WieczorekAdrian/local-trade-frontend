import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/auth/AuthProvider";
import { PrivateRoute } from "@/components/common/PrivateRoute";
import HomePage from "@/pages/HomePage";
import AddAdvertisementPage from "@/pages/AddAdvertisementPage";
import SingleAdPage from "@/pages/SingleAdPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/advertisement/:id" element={<SingleAdPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/add-offer" element={<AddAdvertisementPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
