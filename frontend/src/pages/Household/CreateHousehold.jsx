import React, { useState, useEffect } from 'react';
import { createHousehold, getAllRooms, getEmptyRooms } from '../../api/managementService'; 
import { useNavigate } from 'react-router-dom';

const CreateHousehold = () => {
    const navigate = useNavigate();

    // State lưu danh sách các phòng trống lấy từ API
    const [emptyRooms, setEmptyRooms] = useState([]);

    // State form
    const [selectedRoomName, setSelectedRoomName] = useState(''); 
    const [countMotobike, setCountMotobike] = useState(0);
    const [countCar, setCountCar] = useState(0);
    const [roomDetails, setRoomDetails] = useState({
        type: '',
        area: '',
        feePerMeter: ''
    });

    // 1. Load danh sách phòng trống khi vào trang
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getEmptyRooms();
                console.log("Danh sách phòng lấy từ API:", res);
                if (res && res.data && res.data.data) {
                    setEmptyRooms(res.data.data); 
                } else if (res && Array.isArray(res.data)) {
                    setEmptyRooms(res.data);
                } else if (res && res.data) {
                    setEmptyRooms(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách phòng:", error);
            }
        };
        fetchRooms();
    }, []);

    // 2. Xử lý khi chọn phòng từ Dropdown
    const handleRoomChange = (e) => {
        const roomName = e.target.value;
        setSelectedRoomName(roomName);

        // Tìm object phòng tương ứng trong mảng emptyRooms để lấy chi tiết
        const roomObj = emptyRooms.find(r => r.room === roomName);
        
        if (roomObj) {
            setRoomDetails({
                type: roomObj.type,
                area: roomObj.area,
                feePerMeter: roomObj.feePerMeter
            });
        } else {
            // Reset nếu chọn option mặc định
            setRoomDetails({ type: '', area: '', feePerMeter: '' });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!selectedRoomName) {
            alert("Vui lòng chọn phòng.");
            return;
        }

        try {
            const payload = {
                room: selectedRoomName, 
                number_motorbike: parseInt(countMotobike), 
                number_car: parseInt(countCar),
                start_date: new Date().toISOString().split('T')[0], 
            };

            console.log("Dữ liệu gửi đi:", payload); 
            await createHousehold(payload);
            
            alert("✅ Tạo hộ khẩu và gán phòng thành công!");
            navigate('/households'); 
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tạo: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Thêm Hộ Khẩu Mới</h2>
            <form onSubmit={handleSubmit}>
                
                {/* --- THAY ĐỔI: DROPDOWN CHỌN PHÒNG --- */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Chọn Phòng (Danh sach toan bo)</label>
                    <select 
                        required
                        className="w-full border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedRoomName}
                        onChange={handleRoomChange}
                    >
                        <option value="">-- Vui lòng chọn phòng --</option>
                        {emptyRooms.length > 0 ? (
                            emptyRooms.map((room, index) => (
                                <option key={index} value={room.name || room.room}>
                                    {/* Hiển thị: P101 - Chung cư (75m2) */}
                                    {room.name || room.room} - {room.type} ({room.area}m²)
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Không còn phòng trống nào</option>
                        )}
                    </select>
                </div>

                {/* Các ô dưới đây chỉ để hiển thị thông tin phòng đã chọn (Read-only) */}
                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium mb-1">Loại căn hộ:</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                            value={roomDetails.type} 
                            readOnly 
                            placeholder="..."
                        />
                    </div>
                    <div className="w-1/2">
                         <label className="block text-gray-700 font-medium mb-1">Diện tích (m²):</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                            value={roomDetails.area} 
                            readOnly 
                            placeholder="..."
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Phí quản lý (VNĐ/m²):</label>
                    <input 
                        type="number"
                        className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                        value={roomDetails.feePerMeter}
                        readOnly 
                        placeholder="..."
                    />
                </div>

                {/* Phần nhập xe giữ nguyên */}
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium mb-1">Số xe máy:</label>
                        <input 
                            type="number" min="0"
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={countMotobike}
                            onChange={(e) => setCountMotobike(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium mb-1">Số ô tô:</label>
                        <input 
                            type="number" min="0"
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={countCar}
                            onChange={(e) => setCountCar(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition duration-200">
                    Xác nhận tạo
                </button>
            </form>
        </div>
    );
};

export default CreateHousehold;