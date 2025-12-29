import React, { useState } from 'react';
import { getHumansByHousehold } from '../../../api/searchService';

const RoomResults = ({ data, residents, mode }) => {
    // data: Mảng các household
    // residents: Dữ liệu cư dân (chỉ có sẵn nếu là mode 'room_current')
    // mode: 'room_current' | 'room_history'

    // State nội bộ để xem chi tiết cư dân trong chế độ History
    const [historyResidents, setHistoryResidents] = useState([]);
    const [expandedHistoryId, setExpandedHistoryId] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Hàm load dân khi bấm vào 1 dòng lịch sử
    const handleExpandHistory = async (householdId) => {
        if (expandedHistoryId === householdId) {
            setExpandedHistoryId(null); // Đóng lại
            return;
        }
        setLoadingHistory(true);
        try {
            const res = await getHumansByHousehold(householdId);
            setHistoryResidents(res.data?.data || res.data || []);
            setExpandedHistoryId(householdId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-2">🏚️</div>
                <p className="text-gray-500 italic">Không tìm thấy dữ liệu phòng phù hợp.</p>
            </div>
        );
    }

    // === GIAO DIỆN 1: PHÒNG HIỆN TẠI (Chi tiết) ===
    if (mode === 'room_current') {
        const household = data[0]; // Lấy phần tử đầu tiên
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Card Thông Tin Phòng */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            🏠 Phòng {household.room}
                        </h2>
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow">
                            Đang ở
                        </span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-100">
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Chủ hộ</p>
                            <p className="font-bold text-gray-800 truncate">{residents.find(r => r.role === 'Chủ hộ')?.name || "---"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Diện tích</p>
                            <p className="font-bold text-gray-800">{household.area || 0} m²</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Phương tiện</p>
                            <p className="font-bold text-gray-800">
                                🏍️ {household.number_motorbike || 0} - 🚗 {household.number_car || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Ngày vào</p>
                            <p className="font-bold text-blue-600">
                                {new Date(household.start_date).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Danh sách thành viên */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700">👥 Danh Sách Thành Viên</h3>
                    </div>
                    <table className="min-w-full">
                        <thead className="bg-white border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ Tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {residents.map((mem, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{mem.name}</td>
                                    <td className="px-6 py-4 text-sm">{mem.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{mem.phonenumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${mem.living ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {mem.living ? 'Living' : 'Left'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // === GIAO DIỆN 2: LỊCH SỬ PHÒNG (Timeline) ===
    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-700 border-l-4 border-orange-500 pl-3">
                📜 Lịch sử cư trú - Phòng {data[0]?.room}
            </h3>
            <p className="text-sm text-gray-500 mb-4">Tìm thấy {data.length} hồ sơ</p>

            <div className="space-y-3">
                {data.map((house) => (
                    <div key={house.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                        <div 
                            className="p-4 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => handleExpandHistory(house.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${house.leave_date ? 'bg-gray-400' : 'bg-green-500'}`}>
                                    {house.leave_date ? 'Old' : 'Now'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Hộ khẩu #{house.id} ({house.type})</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(house.start_date).toLocaleDateString('vi-VN')} 
                                        {' ➔ '} 
                                        {house.leave_date ? new Date(house.leave_date).toLocaleDateString('vi-VN') : 'Hiện tại'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                                <div className="text-right text-sm">
                                    <p><span className="font-bold">{house.number_motobike}</span> xe máy</p>
                                    <p><span className="font-bold">{house.number_car}</span> ô tô</p>
                                </div>
                                <span className="text-blue-600 text-sm font-medium">
                                    {expandedHistoryId === house.id ? 'Ẩn chi tiết ▲' : 'Xem thành viên ▼'}
                                </span>
                            </div>
                        </div>

                        {/* Expandable Section: Danh sách dân */}
                        {expandedHistoryId === house.id && (
                            <div className="bg-gray-50 p-4 border-t border-gray-100">
                                {loadingHistory ? (
                                    <p className="text-sm text-gray-500">Đang tải thành viên...</p>
                                ) : historyResidents.length > 0 ? (
                                    <ul className="space-y-2">
                                        {historyResidents.map((r, i) => (
                                            <li key={i} className="flex justify-between text-sm bg-white p-2 rounded border border-gray-200">
                                                <span className="font-medium">{r.name} ({r.role})</span>
                                                <span className="text-gray-500">{r.phonenumber}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Không có dữ liệu thành viên.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomResults;