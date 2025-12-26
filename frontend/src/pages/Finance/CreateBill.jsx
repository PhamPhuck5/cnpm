import React, { useState } from 'react';
import { createBill } from '../../api/financeService';
import { useNavigate } from 'react-router-dom';

const CreateBill = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',     // Tương ứng với tên đợt thu trong API của bạn
        based: 'Số điện', // Mặc định
        last_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBill(formData);
            alert("✅ Tạo hóa đơn thành công!");
            navigate('/finance/bills');
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Tạo Đợt Thu Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Tên Đợt Thu (Email/Tiêu đề)</label>
                    <input 
                        type="text" required
                        placeholder="VD: bill_dien_thang_12@gmail.com"
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Loại phí (Based on)</label>
                    <select 
                        className="w-full border p-3 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.based}
                        onChange={(e) => setFormData({...formData, based: e.target.value})}
                    >
                        <option value="Số điện">⚡ Tiền Điện</option>
                        <option value="Số nước">💧 Tiền Nước</option>
                        <option value="Dịch vụ">🛡️ Phí Dịch Vụ</option>
                        <option value="Gửi xe">🅿️ Phí Gửi Xe</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Hạn đóng tiền</label>
                    <input 
                        type="date" required
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.last_date}
                        onChange={(e) => setFormData({...formData, last_date: e.target.value})}
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition shadow-lg">
                    Xác nhận tạo
                </button>
            </form>
        </div>
    );
};

export default CreateBill;