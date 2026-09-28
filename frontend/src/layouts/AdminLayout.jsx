import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminSidebar from "../pages/Admin/AdminSidebar";
import AdminTopbar from "../pages/Admin/AdminTopbar";

import "./AdminLayout.css";

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div
            className={`admin-layout ${
                sidebarOpen
                    ? "sidebar-open"
                    : "sidebar-closed"
            }`}
        >

            {/* =========================
                ADMIN SIDEBAR
            ========================= */}

            <AdminSidebar
                sidebarOpen={sidebarOpen}
            />


            {/* =========================
                MAIN AREA
            ========================= */}

            <div className="main">

                {/* TOPBAR */}

                <AdminTopbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />


                {/* PAGE CONTENT */}

                <div className="content">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default AdminLayout;