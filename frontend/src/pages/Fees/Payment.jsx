import React, { useState } from 'react';
import { createPayment } from '../../api/feeService';

const Payment = () => {
    const [form, setForm] = useState({ household_id: '', bill_id: '', amount: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPayment(form);
            alert("Thanh toán thành công!");
            setForm({ household_id: '', bill_id: '', amount: '' }); // Reset form
        } catch (err) {
            alert("Lỗi thanh toán: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white rounded shadow mt-10 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Thu Phí Cư Dân</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">ID Hộ khẩu</label>
                    <input type="number" className="w-full border p-2 rounded" required
                        value={form.household_id}
                        onChange={e => setForm({...form, household_id: e.target.value})} />
                </div>
                <div>
                    <label className="block text-gray-700">ID Khoản thu (Bill)</label>
                    <input type="number" className="w-full border p-2 rounded" required
                        value={form.bill_id}
                        onChange={e => setForm({...form, bill_id: e.target.value})} />
                </div>
                <div>
                    <label className="block text-gray-700">Số tiền thu (VNĐ)</label>
                    <input type="number" className="w-full border p-2 rounded" required
                        value={form.amount}
                        onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                    Xác nhận thu tiền
                </button>
            </form>
        </div>
    );
};

export default Payment;