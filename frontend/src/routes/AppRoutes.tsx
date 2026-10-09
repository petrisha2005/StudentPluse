import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { TeamsPage } from '../pages/TeamsPage';
import { OpportunitiesPage } from '../pages/OpportunitiesPage';
import { NetworkPage } from '../pages/NetworkPage';
import { MessagesPage } from '../pages/MessagesPage';
import { NotificationsPage } from '../pages/NotificationsPage';

export const AppRoutes: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/discover" element={<DiscoverPage />} />

        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};
