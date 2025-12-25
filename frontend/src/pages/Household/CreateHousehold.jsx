import React, { useState } from 'react';
import { createHousehold } from '../../api/managementService'; 
import { useNavigate } from 'react-router-dom';

const CreateHousehold = () => {
    const navigate = useNavigate();

    const [apartmentId, setApartmentId] = useState('');
    const [countMotobike, setCountMotobike] = useState(0);
    const [countCar, setCountCar] = useState(0);

    const [type, setType] = useState('Chung cư'); // Mặc định
    const [feePerMeter, setFeePerMeter] = useState(7000); // Mặc định 7000 cho Chung cư

    // Hàm này xử lý 2 việc: Đổi loại căn hộ VÀ Cập nhật giá tiền
    const handleChangeType = (e) => {
        const selectedType = e.target.value;
        setType(selectedType); // 1. Cập nhật state loại căn hộ

        // 2. Cập nhật state giá tiền theo đề bài
        if (selectedType === 'Chung cư') setFeePerMeter(7000);      
        else if (selectedType === 'Penthouse') setFeePerMeter(16500); 
        else if (selectedType === 'Kiot') setFeePerMeter(10000);      
        else if (selectedType === 'Văn phòng') setFeePerMeter(12000); 
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!apartmentId) {
            alert("Vui lòng nhập Mã Căn Hộ (ID) hợp lệ.");
            return;
        }
        try {
            const payload = {
                room: parseInt(apartmentId), 
                number_motobike: parseInt(countMotobike),
                number_car: parseInt(countCar),
                start_date: new Date(),
                type: type,                  
                feePerMeter: parseInt(feePerMeter) 
            };

            console.log("Dữ liệu gửi đi:", payload); 
            await createHousehold(payload);
            
            alert("Tạo hộ khẩu thành công!");
            navigate('/households'); 
        } catch (error) {
            console.error(error);
            // Sửa lại thông báo lỗi cho dễ đọc hơn
            alert("Lỗi khi tạo: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10">
            <h2 ctlassName="text-2xl font-bold mb-4 text-blue-600">Thêm Hộ Khẩu Mới</h2>
            <form onSubmit={handleSubmit}>
                
                {/* Ô nhập Số phòng (Apartment ID) */}
                <div className="mb-4">
                    <label className="block text-gray-700">Mã Căn Hộ (ID):</label>
                    <input 
                        type="number" required
                        className="w-full border p-2 rounded"
                        value={apartmentId}
                        onChange={(e) => setApartmentId(e.target.value)}
                        placeholder="Nhập ID căn hộ (VD: 1)"
                    />
                </div>

                {/* --- SỬA LẠI ĐOẠN NÀY --- */}
                <div className="mb-4">
                    <label className="block text-gray-700">Loại căn hộ:</label>
                    <select 
                        className="w-full border p-2 rounded bg-white"
                        value={type}
                        onChange={handleChangeType} // <--- QUAN TRỌNG: Phải gọi hàm này logic mới chạy
                    >
                        {/* Cập nhật Option khớp với đề bài */}
                        <option value="Chung cư">Chung cư (Tầng 6-29)</option>
                        <option value="Penthouse">Penthouse (Tầng thượng)</option>
                        <option value="Kiot">Kiot (Tầng 1)</option>
                        <option value="Văn phòng">Văn phòng (Tầng 2-5)</option>
                    </select>
                </div>
                {/* ------------------------- */}

                {/* Ô nhập Phí quản lý */}
                <div className="mb-4">
                    <label className="block text-gray-700">Phí quản lý (VNĐ/m2):</label>
                    <input 
                        type="number" required
                        className="w-full border p-2 rounded bg-gray-50" // Thêm màu nền nhạt để biết là auto
                        value={feePerMeter}
                        onChange={(e) => setFeePerMeter(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1 italic">
                        *Hệ thống tự động gợi ý giá, bạn có thể sửa nếu cần.
                    </p>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Số xe máy:</label>
                        <input 
                            type="number"
                            className="w-full border p-2 rounded"
                            value={countMotobike}
                            onChange={(e) => setCountMotobike(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Số ô tô:</label>
                        <input 
                            type="number"
                            className="w-full border p-2 rounded"
                            value={countCar}
                            onChange={(e) => setCountCar(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Xác nhận tạo
                </button>
            </form>
        </div>
    );
};

export default CreateHousehold;