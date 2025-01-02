import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Admindash from './pages/adminDash/admindash';
import Residentdash from './pages/residentDash/residentdash';
import ListRooms from './pages/ListRooms/ListRooms';
import ListResident from './pages/ListResident/ListResident';
import Page404 from './pages/Page404/Page404';
import {jwtDecode} from "jwt-decode";
import ResidentProfile from './pages/residentDash/ResidentProfile';
import AdminPayment from './pages/AdminPayment/AdminPayment';
import ResidentRoom from './pages/ResidentRoom/ResidentRoom';

function App() {
    // Define the ProtectedRoute component
    const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
        const token = localStorage.getItem('authToken');
        const userRole = token ? jwtDecode(token).role : null;

        if (userRole === requiredRole) {
            return children;
        } else {
            return <Navigate to={redirectTo} replace />;
        }
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/404" element={<Page404 />} />
                <Route path="/resident-dash" element={<Residentdash />} />
                <Route path="/resident-dash/profil" element={<ResidentProfile />} />
                <Route path="/resident-dash/ListRooms" element={<ResidentRoom/>} />


                {/* Protected Routes */}
                <Route 
                    path="/admin-dash/*" 
                    element={
                        <ProtectedRoute requiredRole="ADMIN" redirectTo="/404">
                            <Routes>
                                <Route path="" element={<Admindash />} />
                                <Route path="ListRooms" element={<ListRooms />} />
                                <Route path="Resident" element={<ListResident />} />
                                <Route path="paiement" element={<AdminPayment />} />
                            </Routes>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
