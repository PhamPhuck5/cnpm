import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            // API trả về: { code: 200, accessToken: "..." }
            if (res.code === 200 || res.status === 200) { 
                localStorage.setItem('token', res.accessToken || res.data.accessToken);
                localStorage.setItem('user', JSON.stringify(res.data)); // Lưu thông tin user nếu cần
                alert("Đăng nhập thành công!");
                navigate('/households'); // Chuyển hướng vào trang chính
            } else {
                alert(res.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng Nhập BlueMoon</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" placeholder="Email" required
                        className="w-full border p-2 rounded"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Mật khẩu" required
                        className="w-full border p-2 rounded"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Đăng nhập
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;