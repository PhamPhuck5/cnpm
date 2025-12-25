import React from 'react';

const RoomResults = ({ householdData, residentsData }) => {
    // householdData: Dữ liệu từ API getHouseholdByRoom
    // residentsData: Dữ liệu từ API getAllByHousehold
    
    if (!householdData) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-gray-500 italic">Không tìm thấy thông tin phòng này.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 1. Card Thông Tin Phòng */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        🏠 Phòng {householdData.room}
                    </h2>
                    <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {householdData.type || 'Căn hộ'}
                    </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Diện tích</p>
                        <p className="text-2xl font-bold text-gray-800">{householdData.area} m²</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Phí quản lý</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {new Intl.NumberFormat('vi-VN').format(householdData.feePerMeter)} đ/m²
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Xe máy</p>
                        <p className="text-2xl font-bold text-gray-800">{householdData.number_motobike || 0}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Ô tô</p>
                        <p className="text-2xl font-bold text-gray-800">{householdData.number_car || 0}</p>
                    </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 flex justify-between">
                     <span>Ngày bàn giao: {new Date(householdData.start_date).toLocaleDateString('vi-VN')}</span>
                     <span>Mã hộ: #{householdData.id}</span>
                </div>
            </div>

            {/* 2. Danh sách thành viên bên dưới */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        👥 Danh Sách Thành Viên ({residentsData.length})
                    </h3>
                </div>
                
                <table className="min-w-full">
                    <thead className="bg-white border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Họ Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">SĐT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {residentsData.length > 0 ? (
                            residentsData.map((member, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{member.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-0.5 rounded text-xs ${member.role === 'Chủ hộ' ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-gray-100'}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{member.phonenumber || '---'}</td>
                                    <td className="px-6 py-4">
                                         {member.living ? (
                                             <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                 ● Đang ở
                                             </span>
                                         ) : (
                                             <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                                                 ○ Đã đi
                                             </span>
                                         )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                                    Chưa có dữ liệu nhân khẩu cho phòng này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomResults;