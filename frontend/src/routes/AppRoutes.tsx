import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LazyComponentType } from "../types/routes";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";
import Loading from "../components/common/Loading";

const Home: LazyComponentType = lazy(() => import("../pages/Home"));
const Login: LazyComponentType = lazy(() => import("../pages/Login"));
const Register: LazyComponentType = lazy(() => import("../pages/Register"));
const Explore: LazyComponentType = lazy(() => import("../pages/Explore"));
const Dashboard: LazyComponentType = lazy(() => import("../pages/Dashboard"));
const Profile: LazyComponentType = lazy(() => import("../pages/Profile"));
const MyPlaylists: LazyComponentType = lazy(() => import("../pages/MyPlaylists"));
const Tweet: LazyComponentType = lazy(() => import("../pages/Tweet"))
const PlaylistDetail: LazyComponentType = lazy(() => import("../pages/PlaylistDetail"));
const WatchVideo: LazyComponentType = lazy(() => import("../pages/WatchVideo"));
const AdminDashboard: LazyComponentType = lazy(() => import("../pages/admin/AdminDashboard"));
const NotFound: LazyComponentType = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/explore" element={<Explore />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/my-playlists" element={<ProtectedRoute><MyPlaylists /></ProtectedRoute>} />
                <Route path="/playlist/:id" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
                <Route path="/tweet" element={<ProtectedRoute><Tweet /></ProtectedRoute>} />
                <Route path="/watch/:id" element={<ProtectedRoute><WatchVideo /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* Error Pages */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
