import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/auth/AuthProvider";
import { PrivateRoute } from "@/components/common/PrivateRoute";
import HomePage from "@/pages/HomePage";
import AddAdvertisementPage from "@/pages/AddAdvertisementPage";
import SingleAdPage from "@/pages/SingleAdPage";
import { AdvertisementProvider } from "@/feature/advertisement/AdvertisementContext";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { Navbar } from "@/pages/layout/Navbar";
import SearchPage from "@/pages/SearchPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdvertisementProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/advertisement/:id" element={<SingleAdPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/add-offer" element={<AddAdvertisementPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </AdvertisementProvider>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
