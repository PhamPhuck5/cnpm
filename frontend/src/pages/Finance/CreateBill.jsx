import React, { useState } from 'react';
import { createBill } from '../../api/financeService';

const CreateBill = () => {
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!month) return alert("Vui lòng chọn tháng!");

        setLoading(true);
        try {
            // Logic: Gửi tháng năm lên backend để generate bill cho toàn bộ căn hộ
            // Ví dụ backend cần body: { month: 12, year: 2025 }
            const dateObj = new Date(month);
            const payload = {
                month: dateObj.getMonth() + 1,
                year: dateObj.getFullYear()
            };

            await createBill(payload);
            alert("Tạo đợt thu thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tạo đợt thu (Có thể đã tạo rồi).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Tạo Đợt Thu Phí Mới</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Chọn Tháng/Năm</label>
                    <input 
                        type="month" 
                        required
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        *Hệ thống sẽ tự động tính toán phí dịch vụ, gửi xe cho tất cả căn hộ trong tháng này.
                    </p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3 text-white font-bold rounded-lg transition
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Đang xử lý...' : 'Xác Nhận Tạo Hóa Đơn'}
                </button>
            </form>
        </div>
    );
};

export default CreateBill;