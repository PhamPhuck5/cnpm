import React, { useState } from 'react';
import { createBill } from '../../api/financeService';
import { useNavigate } from 'react-router-dom';

const CreateBill = () => {
    const navigate = useNavigate();

    // Cấu hình nghiệp vụ (Business Logic)
    const BILL_TYPES = [
        {
            id: 'service_fee',
            label: 'Phí Dịch Vụ',
            icon: '🏢',
            description: 'Tính theo đơn giá riêng của từng căn hộ.',
            apiBased: 'area', // Gửi xuống backend là 'area'
            defaultAmount: 0, // Gửi 0 để Backend tự lấy feePerMeter của hộ
            fixed: true, // Không cho Admin sửa giá
            color: 'border-blue-500 bg-blue-50 text-blue-700'
        },
        {
            id: 'management_fee',
            label: 'Phí Quản Lý',
            icon: '🛡️',
            description: 'Phí vận hành chung. Đồng giá cho mọi căn hộ (Min 7.000đ/m2).',
            apiBased: 'area',
            defaultAmount: 7000,
            fixed: false, // Admin được phép tăng giá
            min: 7000,
            color: 'border-indigo-500 bg-indigo-50 text-indigo-700'
        },
        {
            id: 'car',
            label: 'Gửi Ô Tô',
            icon: '🚗',
            description: 'Thu theo số lượng xe đăng ký. Giá cố định.',
            apiBased: 'car',
            defaultAmount: 1200000,
            fixed: true, // Cố định cứng
            color: 'border-orange-500 bg-orange-50 text-orange-700'
        },
        {
            id: 'motorcycle',
            label: 'Gửi Xe Máy',
            icon: '🛵',
            description: 'Thu theo số lượng xe đăng ký. Giá cố định.',
            apiBased: 'motorcycle',
            defaultAmount: 70000,
            fixed: true, // Cố định cứng
            color: 'border-green-500 bg-green-50 text-green-700'
        },
        {
            id: 'voluntary',
            label: 'Quyên Góp',
            icon: '❤️',
            description: 'Tạo đợt vận động. Nhập số tiền tùy tâm sau.',
            apiBased: 'voluntary',
            defaultAmount: 0,
            fixed: true,
            color: 'border-pink-500 bg-pink-50 text-pink-700'
        }
    ];

    const [selectedType, setSelectedType] = useState(BILL_TYPES[0]); // Mặc định chọn cái đầu
    const [formData, setFormData] = useState({
        name: '',
        amount: BILL_TYPES[0].defaultAmount,
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
    });

    // Xử lý khi chọn loại phí (Click vào Card)
    const handleSelectType = (type) => {
        setSelectedType(type);
        setFormData({
            ...formData,
            // Tự động điền tên gợi ý luôn cho tiện
            name: `${type.label} tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 
            amount: type.defaultAmount
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate Phí quản lý (nếu cần)
        if (selectedType.id === 'management_fee' && formData.amount < 7000) {
            alert("⚠️ Phí quản lý không được thấp hơn 7.000đ/m2");
            return;
        }

        if (!formData.name || !formData.end_date) {
            alert("Vui lòng nhập tên đợt thu và hạn nộp!");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                based: selectedType.apiBased, // Map sang key mà backend hiểu (area, car,...)
                amount: parseInt(formData.amount) || 0,
                start_date: formData.start_date,
                end_date: formData.end_date
            };

            console.log("Submitting:", payload);
            await createBill(payload);
            
            alert(`✅ Đã tạo đợt thu "${formData.name}" thành công!`);
            navigate('/finance/bills');
        } catch (error) {
            console.error(error);
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val);

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900">Tạo Đợt Thu Phí Mới</h1>
                <p className="text-gray-500 mt-2">Chọn loại phí để hệ thống tự động thiết lập công thức tính</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CỘT TRÁI: DANH SÁCH LOẠI PHÍ (App Style) */}
                <div className="md:col-span-1 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">1. Chọn loại phí</p>
                    {BILL_TYPES.map((type) => (
                        <div 
                            key={type.id}
                            onClick={() => handleSelectType(type)}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md
                                ${selectedType.id === type.id ? type.color : 'border-gray-100 bg-white hover:border-blue-200 text-gray-600'}`}
                        >
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                                <p className="font-bold text-sm">{type.label}</p>
                            </div>
                            {selectedType.id === type.id && <span className="ml-auto text-xl">✓</span>}
                        </div>
                    ))}
                </div>

                {/* CỘT PHẢI: FORM NHẬP LIỆU */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-between">
                        <div className="space-y-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">2. Thiết lập thông tin</p>
                            
                            {/* Hiển thị thông tin loại phí đang chọn */}
                            <div className={`p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm`}>
                                <span className="font-bold block mb-1">{selectedType.icon} {selectedType.label}</span>
                                <span className="text-gray-600">{selectedType.description}</span>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-1 text-sm">Tên Đợt Thu <span className="text-red-500">*</span></label>
                                <input type="text" required 
                                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-1 text-sm">Ngày bắt đầu</label>
                                    <input type="date" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-1 text-sm">Hạn nộp <span className="text-red-500">*</span></label>
                                    <input type="date" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Ô nhập tiền thông minh */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-1 text-sm">
                                    Đơn giá áp dụng (VNĐ)
                                    {selectedType.fixed && <span className="ml-2 text-xs font-normal text-gray-400">(Mặc định theo quy định)</span>}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        required 
                                        readOnly={selectedType.fixed} // Khóa nếu là loại phí cố định
                                        className={`w-full border-2 p-3 rounded-xl font-bold text-lg outline-none
                                            ${selectedType.fixed 
                                                ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                                                : 'bg-white text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-500'
                                            }`}
                                        value={formData.amount} 
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    />
                                    <div className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">VNĐ</div>
                                </div>
                                
                                {/* Dòng chú thích tính toán */}
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <span>💡 Cách tính:</span>
                                    <span className="font-bold text-gray-700">
                                        {selectedType.id === 'service_fee' && "Diện tích căn hộ (m²) × Đơn giá riêng của hộ"}
                                        {selectedType.id === 'management_fee' && `Diện tích căn hộ (m²) × ${formatMoney(formData.amount)}đ`}
                                        {selectedType.id === 'car' && `Số lượng ô tô × ${formatMoney(formData.amount)}đ`}
                                        {selectedType.id === 'motorcycle' && `Số lượng xe máy × ${formatMoney(formData.amount)}đ`}
                                        {selectedType.id === 'voluntary' && "Nhập tay số tiền đóng góp sau"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 mt-6">
                            Xác Nhận Tạo Đợt Thu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBill;