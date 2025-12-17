import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { Toaster } from "@/components/ui/sonner"
import DashboardPage from "@/pages/DashBoard";
import { AuthProvider } from "@/context/AuthProvider";

function App() {
    return (
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
            <Toaster position="top-right" richColors />
        </BrowserRouter>
            </AuthProvider>
    );
}

export default App;