import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Hàm kiểm tra link nào đang active để tô màu
    const isActive = (path) => location.pathname.startsWith(path) 
        ? "bg-blue-700 text-white" 
        : "text-blue-100 hover:bg-blue-600";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="p-6 text-center border-b border-blue-800">
                    <h1 className="text-2xl font-bold">BlueMoon BQT</h1>
                    <p className="text-xs text-blue-300 mt-1">Quản lý chung cư</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <p className="px-4 text-xs font-semibold text-blue-400 uppercase">Hộ khẩu & Cư dân</p>
                    <Link to="/households" className={`block px-4 py-2 rounded transition ${isActive('/households')}`}>
                        🏢 Quản lý Hộ khẩu
                    </Link>

                    <p className="px-4 text-xs font-semibold text-blue-400 uppercase mt-4">Tài chính</p>
                    <Link to="/fees/create-bill" className={`block px-4 py-2 rounded transition ${isActive('/fees/create-bill')}`}>
                        📝 Tạo Khoản thu
                    </Link>
                    <Link to="/fees/payment" className={`block px-4 py-2 rounded transition ${isActive('/fees/payment')}`}>
                        💰 Thu phí cư dân
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                            {user.name ? user.name.charAt(0) : 'A'}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium truncate w-32">{user.name || 'Admin'}</p>
                            <p className="text-xs text-blue-300">Ban quản trị</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 overflow-y-auto">
                <Outlet /> {/* Đây là nơi nội dung các trang con sẽ hiện ra */}
            </main>
        </div>
    );
};

export default MainLayout;