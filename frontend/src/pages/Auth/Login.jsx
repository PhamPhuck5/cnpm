import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu load

        try {
            const res = await login({ email, password });
            
            // --- QUAN TRỌNG: Mở Console (F12) để xem Backend trả về cái gì ---
            console.log("Response từ Backend:", res); 

            // Logic lấy token an toàn: Kiểm tra nhiều cấp độ dữ liệu
            // Backend có thể trả về: res.data.token HOẶC res.data.data.token HOẶC res.data.accessToken
            const token = res.data?.accessToken || res.data?.token || res.data?.data?.token || res.data?.data?.accessToken;
            
            // Lấy thông tin user (nếu có)
            const userData = res.data?.user || res.data?.data?.user || res.data?.data;

            if (token) {
                // 1. Lưu vào LocalStorage
                localStorage.setItem('token', token);
                
                // 2. Lưu thông tin user (để hiển thị tên trên Header)
                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                }

                // 3. Thông báo & Chuyển trang
                alert("Đăng nhập thành công! Đang chuyển hướng...");
                
                // Chuyển về Dashboard (Trang chủ mới)
                // Dùng window.location.href để đảm bảo App load lại trạng thái login mới
                window.location.href = '/dashboard'; 
                
            } else {
                alert("Đăng nhập thất bại: Không tìm thấy Token trong phản hồi!");
                console.error("Cấu trúc trả về không khớp logic lấy token. Hãy kiểm tra console log.");
            }

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            const message = err.response?.data?.message || err.message || "Lỗi kết nối Server";
            alert("Lỗi: " + message);
        } finally {
            setLoading(false); // Kết thúc load dù thành công hay thất bại
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">BlueMoon</h1>
                    <p className="text-gray-500 text-sm mt-1">Hệ thống quản lý chung cư</p>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Đăng Nhập</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="admin@example.com" 
                            required
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit"
                        className={`w-full text-white p-2.5 rounded-lg font-bold transition duration-200 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;