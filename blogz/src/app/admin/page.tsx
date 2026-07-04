"use client";

import AuthGate from "./AuthGate";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  return (
    <AuthGate>
      <AdminDashboard />
    </AuthGate>
  );
}