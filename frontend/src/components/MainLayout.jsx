import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Admin');

    // Lấy thông tin user từ localStorage (nếu có lưu lúc login)
    useEffect(() => {
        const storedUser = localStorage.getItem('user'); // Hoặc key mà bạn lưu
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserName(parsed.name || parsed.email || 'Admin');
            } catch (e) {
                // Nếu lưu dạng string thường
                setUserName(storedUser);
            }
        }
    }, []);

    const handleLogout = () => {
        if(window.confirm("Đăng xuất khỏi hệ thống?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const isActive = (path) => {
        // Logic: Nếu đường dẫn hiện tại bắt đầu bằng path thì active
        return location.pathname.startsWith(path) 
            ? "bg-blue-800 text-white shadow-lg border-l-4 border-yellow-400" 
            : "text-blue-100 hover:bg-blue-700 hover:text-white";
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-2xl z-30 transition-all duration-300">
                {/* Logo */}
                <Link to="/dashboard" className="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-950 font-bold text-xl tracking-wider shadow-sm hover:text-yellow-400 transition">
                    🏢 BLUEMOON
                </Link>

                {/* Menu List */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    
                    {/* 1. THỐNG KÊ */}
                    <Link to="/dashboard" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/dashboard')}`}>
                        <span className="mr-3 text-xl">📊</span> Tổng quan
                    </Link>

                    {/* 2. TRA CỨU */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Tra cứu
                    </div>
                    <Link to="/search" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/search')}`}>
                        <span className="mr-3 text-xl">🔍</span> Tra cứu thông tin
                    </Link>

                    {/* 3. QUẢN LÝ - SỬA LẠI isActive('/households') */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Quản lý
                    </div>
                    <Link to="/households" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/households')}`}>
                        <span className="mr-3 text-xl">🏢</span> Căn hộ & Cư dân
                    </Link>

                    {/* 4. TÀI CHÍNH */}
                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                        Tài chính
                    </div>
                    {/* isActive('/finance') sẽ bắt cả /finance/bills và /finance/create */}
                    <Link to="/finance/bills" className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${isActive('/finance')}`}>
                        <span className="mr-3 text-xl">💰</span> Thu phí & Hóa đơn
                    </Link>
                    
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-blue-800 bg-blue-950">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md group"
                    >
                        <span className="group-hover:hidden">Đăng xuất</span>
                        <span className="hidden group-hover:inline">👋 Bye bye!</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
                    <h2 className="text-gray-600 font-semibold tracking-wide">Hệ thống quản lý chung cư BlueMoon</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-500">Quản trị viên</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                            {userName.charAt(0).toUpperCase()}
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