import React, { useState } from 'react';
import { createBill } from '../../api/feeService';

const CreateBill = () => {
    const [form, setForm] = useState({ email: '', last_date: '', based: 'Diện tích' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Trường 'email' ở đây chính là tên khoản thu theo Postman body của bạn
            await createBill(form);
            alert("Tạo khoản thu thành công!");
        } catch (err) {
            alert("Lỗi tạo khoản thu");
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white rounded shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Tạo Khoản Thu Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Tên khoản thu (VD: Tiền điện T12)</label>
                    <input type="text" className="w-full border p-2 rounded" required
                        onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-gray-700">Hạn chót nộp</label>
                    <input type="date" className="w-full border p-2 rounded" required
                        onChange={e => setForm({...form, last_date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-gray-700">Loại phí</label>
                    <select className="w-full border p-2 rounded"
                        onChange={e => setForm({...form, based: e.target.value})}>
                        <option value="Diện tích">Theo diện tích</option>
                        <option value="Số điện">Theo số điện</option>
                        <option value="Tự nguyện">Tự nguyện</option>
                    </select>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                    Khởi tạo
                </button>
            </form>
        </div>
    );
};

export default CreateBill;