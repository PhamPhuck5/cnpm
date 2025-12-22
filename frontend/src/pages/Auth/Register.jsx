import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phonenumber: '', apartmentId: 1
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (err) {
            alert("Lỗi đăng ký: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Đăng Ký Cư Dân</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" placeholder="Họ và tên" required className="w-full border p-2 rounded"
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    <input type="email" placeholder="Email" required className="w-full border p-2 rounded"
                        onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    <input type="text" placeholder="Số điện thoại" required className="w-full border p-2 rounded"
                        onChange={e => setFormData({...formData, phonenumber: e.target.value})} />

                    <input type="number" placeholder="ID Tòa nhà (Mặc định 1)" className="w-full border p-2 rounded"
                        onChange={e => setFormData({...formData, apartmentId: e.target.value})} />

                    <input type="password" placeholder="Mật khẩu" required className="w-full border p-2 rounded"
                        onChange={e => setFormData({...formData, password: e.target.value})} />

                    <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Đăng ký</button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <Link to="/login" className="text-blue-500">Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;