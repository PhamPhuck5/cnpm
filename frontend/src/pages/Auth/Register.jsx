import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authService';

const Register = () => {
    // Giá trị mặc định apartmentId = 1 để khớp với dữ liệu bạn vừa seed
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        phonenumber: '', 
        apartmentId: '1' 
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
            // Lưu ý: Backend dùng cột 'apartment_id', nên ta map lại cho chắc chắn
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phonenumber: formData.phonenumber,
                apartment_id: formData.apartmentId // Quan trọng: Mapping sang snake_case
            };

            console.log("Đang gửi đăng ký:", payload); // Log để debug nếu lỗi

            await register(payload);
            
            alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');

        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            const message = err.response?.data?.message || err.message || "Lỗi server";
            alert("❌ Lỗi: " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">BlueMoon</h1>
                    <p className="text-gray-500 text-sm mt-1">Đăng ký tài khoản admin</p>
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
                            placeholder="email@example.com" 
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Tòa nhà</label>
                        <input 
                            name="apartmentId"
                            type="number" 
                            placeholder="Nhập ID (VD: 1)" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                            onChange={handleChange}
                            value={formData.apartmentId}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">*Mặc định là 1 (Căn hộ mẫu)</p>
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
                        className={`w-full text-white p-2.5 rounded-lg font-bold transition duration-200 mt-2
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'}`}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng Ký"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;