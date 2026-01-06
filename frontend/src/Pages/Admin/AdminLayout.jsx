import React from "react";
import AdminSidebar from "../Admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full sm:w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4 sm:p-6 min-h-screen overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
