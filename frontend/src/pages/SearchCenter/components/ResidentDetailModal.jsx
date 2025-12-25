import React from 'react';

const ResidentDetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    // Format ngày sinh
    const formatDate = (dateString) => {
        if (!dateString) return "Chưa cập nhật";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span>👤</span> Hồ Sơ Cư Dân
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-md mb-3">
                            {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
                        <span className="text-sm text-gray-500">{data.role || 'Thành viên'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-gray-500 mb-1">Ngày sinh</p>
                            <p className="font-semibold text-gray-800">{formatDate(data.dateOfBirth)}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-gray-500 mb-1">Số điện thoại</p>
                            <p className="font-semibold text-gray-800">{data.phonenumber || '---'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-1">Email</p>
                            <p className="font-semibold text-gray-800">{data.email || '---'}</p>
                        </div>
                        
                        {/* Hiển thị phòng dựa trên quan hệ include Household */}
                        <div className="col-span-2 border-t border-dashed pt-3 mt-1">
                             <p className="text-gray-500 mb-1">Đang sinh sống tại</p>
                             <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                                    {data.Household ? `Phòng ${data.Household.room}` : 'Chưa cập nhật'}
                                </span>
                             </div>
                        </div>

                        {/* Trạng thái sinh sống */}
                        <div className="col-span-2 pt-2">
                            <p className="text-gray-500 mb-1">Trạng thái</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                                ${data.living ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {data.living ? '✅ Đang thường trú' : '❌ Đã chuyển đi / Tạm vắng'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResidentDetailModal;