"use client";

import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BrowseOpportunities from "@/components/opportunities/BrowseOpportunities";

export default function CollaboratorBrowsePage() {
  return (
    <ProtectedRoute allowedRoles={["collaborator"]}>
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500">Loading...</div>
        }
      >
        <BrowseOpportunities />
      </Suspense>
    </ProtectedRoute>
  );
}
