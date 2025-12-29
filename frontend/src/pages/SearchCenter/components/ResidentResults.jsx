import React from 'react';

const ResidentResults = ({ data, onViewDetail }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-2">🤷‍♂️</div>
                <p className="text-gray-500 italic">Không tìm thấy cư dân nào phù hợp.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-blue-50 flex justify-between items-center">
                <h3 className="font-bold text-blue-800">Kết quả tìm kiếm ({data.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-white text-gray-500 text-xs uppercase font-bold text-left border-b">
                            <th className="px-6 py-3">Họ Tên</th>
                            <th className="px-6 py-3">Ngày sinh</th>
                            <th className="px-6 py-3">Phòng</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((person, index) => {
                            const isHouseholdMovedOut = person.Household?.leave_date;
                            
                            let statusLabel = '○ Đã đi';
                            let statusClass = 'bg-gray-100 text-gray-500';

                            if (isHouseholdMovedOut) {
                                statusLabel = 'Đã chuyển đi';
                                statusClass = 'bg-orange-100 text-orange-700';
                            } else if (person.living) {
                                statusLabel = '● Đang ở';
                                statusClass = 'bg-green-100 text-green-700';
                            }

                            return (
                                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{person.name}</div>
                                        <div className="text-xs text-gray-500">{person.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                                            {person.Household?.room || "---"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusClass}`}>
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => onViewDetail(person)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded text-sm font-medium transition"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResidentResults;