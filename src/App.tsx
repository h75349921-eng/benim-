/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { ChatProvider } from './context/ChatContext';
// import { verifyFirestoreConnectivity } from './lib/verifyConnectivity';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Blogs from './pages/Blogs';
import Help from './pages/Help';
import Sitemap from './pages/Sitemap';
import LegalInfo from './pages/LegalInfo';
import ContactUs from './pages/ContactUs';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetail from './pages/VehicleDetail';
import CreateListing from './pages/CreateListing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import MyListings from './pages/MyListings';
import SellerProfile from './pages/SellerProfile';
import EditListing from './pages/EditListing';
import BoostListing from './pages/BoostListing';
import SavedVehicles from './pages/SavedVehicles';
import PaymentHistory from './pages/PaymentHistory';
import RentalMarketplace from './pages/RentalMarketplace';
import RentalDetail from './pages/RentalDetail';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import DealerDashboard from './pages/dashboard/DealerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

export default function App() {
  useEffect(() => {
    // verifyFirestoreConnectivity();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <CarProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/sell" element={<CreateListing />} />
              <Route path="/rentals" element={<RentalMarketplace />} />
              <Route path="/rentals/:id" element={<RentalDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/listings" element={<MyListings />} />
              <Route path="/profile/edit/:id" element={<EditListing />} />
              <Route path="/profile/boost/:id" element={<BoostListing />} />
              <Route path="/profile/saved" element={<SavedVehicles />} />
              <Route path="/profile/payments" element={<PaymentHistory />} />
              <Route path="/seller/:id" element={<SellerProfile />} />
              <Route path="/inbox" element={<Inbox />} />
              
              {/* Information & Support Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/help" element={<Help />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/legal" element={<LegalInfo />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* Dashboards */}
            <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard/dealer" element={<DealerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
   </CarProvider>
  </ChatProvider>
 </AuthProvider>
);
}
