import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHouseholdDetail } from '../../api/householdService';
import { getAllResidents, addResident, markAsLeave, markAsLiving } from '../../api/residentService';

const HouseholdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE DỮ LIỆU ---
    const [household, setHousehold] = useState(null);
    const [residents, setResidents] = useState([]); // Lưu tất cả
    const [filteredResidents, setFilteredResidents] = useState([]); // Chỉ lưu người đang ở
    const [showHistory, setShowHistory] = useState(false); // Toggle: Xem người đang ở / Xem tất cả
    
    // --- STATE FORM (MODAL) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phonenumber: '',
        email: '',
        dateOfBirth: '',
        role: 'Thành viên' // Mặc định
    });

    useEffect(() => {
        loadData();
    }, [id]);

    // Khi danh sách gốc hoặc chế độ xem thay đổi -> Cập nhật danh sách hiển thị
    useEffect(() => {
        if (showHistory) {
            setFilteredResidents(residents); // Xem tất cả
        } else {
            // Chỉ xem người có status là 'living' hoặc is_living = true (tùy backend trả về)
            // Giả sử backend trả về field 'is_living' (true/false) hoặc kiểm tra logic
            setFilteredResidents(residents.filter(r => r.is_living || r.status === 'living' || r.status === 1));
        }
    }, [residents, showHistory]);

    const loadData = async () => {
        try {
            const [resHouse, resRes] = await Promise.all([
                getHouseholdDetail(id),
                getAllResidents(id)
            ]);
            setHousehold(resHouse.data?.data || resHouse.data);
            setResidents(resRes.data || []);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải dữ liệu!");
        }
    };

    // --- XỬ LÝ THÊM CƯ DÂN / TẠM TRÚ ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await addResident({ ...formData, household_id: parseInt(id) });
            alert("✅ Thêm thành công!");
            setIsModalOpen(false);
            setFormData({ name: '', phonenumber: '', email: '', dateOfBirth: '', role: 'Thành viên' }); // Reset form
            loadData(); // Load lại bảng
        } catch (error) {
            alert("Lỗi: " + error.message);
        }
    };

    // --- XỬ LÝ TẠM VẮNG / QUAY VỀ ---
    const handleStatusChange = async (humanId, isCurrentLiving) => {
        try {
            if (isCurrentLiving) {
                if (window.confirm("Xác nhận đăng ký TẠM VẮNG cho người này? Họ sẽ bị ẩn khỏi danh sách hiện tại.")) {
                    await markAsLeave(humanId);
                }
            } else {
                if (window.confirm("Xác nhận người này đã QUAY VỀ (Hủy tạm vắng)?")) {
                    await markAsLiving(humanId);
                }
            }
            loadData();
        } catch (error) {
            alert("Lỗi cập nhật trạng thái!");
        }
    };

    // Format ngày hiển thị
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : "N/A";

    if (!household) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header & Nút Quay lại */}
            <div className="flex justify-between items-start mb-6">
                <button onClick={() => navigate('/households')} className="text-gray-500 hover:text-blue-600 flex items-center gap-2">
                    ⬅ Quay lại danh sách
                </button>
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-blue-800">Phòng {household.room || household.apartment_id}</h1>
                    <p className="text-gray-600">Ngày bắt đầu: {formatDate(household.start_date)}</p>
                </div>
            </div>

            {/* Thẻ Thông tin chung */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-100">
                <div className="p-3 bg-blue-50 rounded">
                    <p className="text-xs text-gray-500 uppercase">Loại hộ</p>
                    <p className="font-bold text-blue-700">{household.type}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                    <p className="text-xs text-gray-500 uppercase">Phí quản lý</p>
                    <p className="font-bold text-green-700">{new Intl.NumberFormat('vi-VN').format(household.feePerMeter)} đ/m²</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 uppercase">Xe máy</p>
                    <p className="font-bold">🏍 {household.number_motobike}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 uppercase">Ô tô</p>
                    <p className="font-bold">🚗 {household.number_car}</p>
                </div>
            </div>

            {/* THANH CÔNG CỤ (Actions) */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Danh sách nhân khẩu {showHistory ? "(Tất cả lịch sử)" : "(Hiện tại)"}
                </h2>
                <div className="flex gap-3">
                    {/* Toggle Switch xem lịch sử */}
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`px-4 py-2 rounded text-sm font-medium transition
                            ${showHistory ? 'bg-gray-200 text-gray-800' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                        {showHistory ? "👁 Chỉ xem người đang ở" : "👁 Xem cả người đã đi"}
                    </button>

                    {/* Nút Thêm Mới */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold flex items-center gap-2"
                    >
                        + Thêm / Tạm Trú
                    </button>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="px-5 py-3">Họ Tên</th>
                            <th className="px-5 py-3">Ngày sinh</th>
                            <th className="px-5 py-3">Quan hệ / Vai trò</th>
                            <th className="px-5 py-3">Liên hệ</th>
                            <th className="px-5 py-3 text-center">Trạng thái</th>
                            <th className="px-5 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResidents.length > 0 ? filteredResidents.map((r) => {
                            const isLiving = r.is_living || r.status === 'living' || r.status === 1;
                            return (
                                <tr key={r.id} className={`border-b hover:bg-gray-50 ${!isLiving ? 'bg-gray-100 opacity-60' : ''}`}>
                                    <td className="px-5 py-4 font-bold text-gray-800">{r.name}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(r.dateOfBirth)}</td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-300">
                                            {r.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <div className="text-gray-900">{r.phonenumber}</div>
                                        <div className="text-xs text-gray-500">{r.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {isLiving ? (
                                            <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">Đang ở</span>
                                        ) : (
                                            <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-1 rounded-full">Tạm vắng</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {isLiving ? (
                                            <button 
                                                onClick={() => handleStatusChange(r.id, true)}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 hover:bg-red-50 px-3 py-1 rounded"
                                            >
                                                Báo Tạm Vắng
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleStatusChange(r.id, false)}
                                                className="text-green-600 hover:text-green-800 text-xs font-medium border border-green-200 hover:bg-green-50 px-3 py-1 rounded"
                                            >
                                                Hủy Tạm Vắng
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400 italic">
                                    Không tìm thấy cư dân nào trong danh sách này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL (POPUP) THÊM CƯ DÂN --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            &times;
                        </button>
                        
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Thêm Cư Dân / Tạm Trú</h2>
                        
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và Tên (*)</label>
                                <input required className="w-full border p-2 rounded mt-1" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ngày sinh (*)</label>
                                    <input required type="date" className="w-full border p-2 rounded mt-1" 
                                        value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quan hệ/Vai trò</label>
                                    <select className="w-full border p-2 rounded mt-1 bg-white"
                                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                        <option value="Chủ hộ">Chủ hộ</option>
                                        <option value="Thành viên">Thành viên</option>
                                        <option value="Tạm trú">Khách / Tạm trú</option>
                                        <option value="Con cái">Con cái</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input className="w-full border p-2 rounded mt-1" 
                                    value={formData.phonenumber} onChange={e => setFormData({...formData, phonenumber: e.target.value})} />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                                    Xác Nhận Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseholdDetail;