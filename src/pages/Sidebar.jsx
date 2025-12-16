import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
    const navigate = useNavigate();

    const menu = JSON.parse(localStorage.getItem("menu")) || [];

    // Auto-collapse on small screens

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1400) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [setOpen]);

    return (
        <>
            {/* Toggle Button always visible */}
            <button
                className="fixed top-4 left-4 z-50 bg-white text-blue-600 p-2 rounded shadow-md"
                onClick={() => setOpen(!open)}
            >
                <i className="fa-solid fa-bars text-xl"></i>
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-[#F1F5F9] text-blue-800 h-screen fixed top-0 left-0 z-40 transition-all duration-300
                    ${open ? "w-64" : "w-20"}
                `}
            >
                <div className="h-16" />

                <nav className="mt-4 space-y-1">
                    {menu?.map((item, index) => (
                        <SidebarItem
                            key={index}
                            label={item.menu_name}
                            icon={item.icon}
                            open={open}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </nav>
            </aside>
        </>
    );
}

function SidebarItem({ label, icon, open, onClick }) {
    return (
        <div onClick={onClick} className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 fw-semibold hover:bg-blue-700 hover:text-white">
            <div className="flex items-center gap-3">
                <i className={`${icon} text-lg transition-all duration-200`}></i>
                {open && <span className="transition-all duration-200">{label}</span>}
            </div>

            {open && (
                <i className="fa-solid fa-chevron-right text-xs transition-all duration-200"></i>
            )}
        </div>
    );
}

