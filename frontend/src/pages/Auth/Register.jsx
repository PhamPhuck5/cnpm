import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        phonenumber: '', 
        // 👇 LƯU Ý: Đặt mặc định là 3 (theo ảnh Postman bạn gửi). 
        // Nếu bạn xóa DB làm lại từ đầu thì hãy đổi về 1.
        apartmentId: '3' 
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Chuẩn bị dữ liệu gửi đi
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phonenumber: formData.phonenumber,
                apartmentId: parseInt(formData.apartmentId) 
            };

            console.log("Đang gửi đăng ký:", payload);

            await register(payload);
            
            alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');

        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            // Lấy thông báo lỗi chi tiết từ Backend trả về
            const message = err.response?.data?.message || err.message || "Lỗi server";
            alert("❌ Đăng ký thất bại: " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200 animate-fade-in-up">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">BlueMoon</h1>
                    <p className="text-gray-500 text-sm mt-1">Đăng ký Quản trị viên</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                        <input 
                            name="name"
                            type="text" 
                            placeholder="Nguyễn Văn A" 
                            required 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="admin@bluemoon.com" 
                            required 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input 
                            name="phonenumber"
                            type="text" 
                            placeholder="0912..." 
                            required 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={handleChange}
                            value={formData.phonenumber}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Tòa nhà (Apartment ID)</label>
                        <input 
                            name="apartmentId"
                            type="number" 
                            placeholder="Nhập ID chung cư" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-yellow-50 font-bold text-blue-800"
                            onChange={handleChange}
                            value={formData.apartmentId}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1 italic">
                            *Nhập đúng ID tòa nhà bạn đã tạo (Ví dụ: 3)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full text-white p-2.5 rounded-lg font-bold transition duration-200 mt-4 shadow-lg
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:-translate-y-1'}`}
                    >
                        {loading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;