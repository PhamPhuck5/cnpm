import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if(confirm("Đăng xuất khỏi hệ thống?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path) 
            ? "bg-blue-800 text-white shadow-lg border-l-4 border-yellow-400" 
            : "text-blue-100 hover:bg-blue-700 hover:text-white";
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-2xl z-30">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-950 font-bold text-xl tracking-wider shadow-sm">
                    🏢 BLUEMOON
                </div>

                {/* Menu List */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    
                    {/* 1. THỐNG KÊ (Dashboard) */}
                    <Link to="/dashboard" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/dashboard')}`}>
                        <span className="mr-3 text-xl">📊</span> Tổng quan
                    </Link>

                    {/* 2. TRA CỨU (Search Center - Bạn đã làm) */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Tra cứu
                    </div>
                    <Link to="/search" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/search')}`}>
                        <span className="mr-3 text-xl">🔍</span> Tra cứu thông tin
                    </Link>

                    {/* 3. QUẢN LÝ (Management) */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Quản lý
                    </div>
                    <Link to="/households" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/management')}`}>
                        <span className="mr-3 text-xl">🏢</span> Căn hộ & Cư dân
                    </Link>

                    {/* 4. TÀI CHÍNH (Finance) */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Tài chính
                    </div>
                    <Link to="/finance/bills" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/finance')}`}>
                        <span className="mr-3 text-xl">💰</span> Thu phí & Hóa đơn
                    </Link>
                    
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-blue-800 bg-blue-950">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
                    <h2 className="text-gray-600 font-semibold">Hệ thống quản lý chung cư BlueMoon</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">Admin</p>
                            <p className="text-xs text-gray-500">Quản trị viên</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;