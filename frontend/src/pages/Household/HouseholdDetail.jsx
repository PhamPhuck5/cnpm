import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getHouseholdDetail, 
    addResident, 
    markAsLeave, 
    markAsLiving,
    stopLivingHousehold,
    createRecord // <--- Import thêm hàm này
} from '../../api/managementService';
import { getHumansByHousehold } from '../../api/searchService';

const HouseholdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE DỮ LIỆU ---
    const [household, setHousehold] = useState(null);
    const [residents, setResidents] = useState([]); 
    const [filteredResidents, setFilteredResidents] = useState([]); 
    const [showHistory, setShowHistory] = useState(false); 
    
    // --- STATE MODAL THÊM CƯ DÂN ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '', phonenumber: '', email: '', dateOfBirth: '', role: 'Thành viên'
    });

    // --- STATE MODAL TẠM VẮNG / TẠM TRÚ (Mới) ---
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [recordData, setRecordData] = useState({
        humanId: null,
        humanName: '',
        type: 'absent', // 'absent' (Tạm vắng) hoặc 'temporary' (Tạm trú)
        start_date: '',
        last_date: ''
    });

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (showHistory) {
            setFilteredResidents(residents); 
        } else {
            setFilteredResidents(residents.filter(r => r.living === true));
        }
    }, [residents, showHistory]);

    const loadData = async () => {
        try {
            const [resHouse, resRes] = await Promise.all([
                getHouseholdDetail(id),
                getHumansByHousehold(id)
            ]);
            setHousehold(resHouse.data?.data || resHouse.data);
            setResidents(resRes.data?.data || resRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // --- 1. XỬ LÝ THÊM CƯ DÂN MỚI ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await addResident({ ...addFormData, household_id: parseInt(id) });
            alert("✅ Thêm cư dân thành công!");
            setIsAddModalOpen(false);
            setAddFormData({ name: '', phonenumber: '', email: '', dateOfBirth: '', role: 'Thành viên' }); 
            loadData(); 
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    // --- 2. XỬ LÝ NÚT BẤM MỞ MODAL TẠM VẮNG/TRÚ ---
    const openRecordModal = (human, type) => {
        setRecordData({
            humanId: human.id,
            humanName: human.name,
            type: type, // 'absent' hoặc 'temporary'
            start_date: new Date().toISOString().split('T')[0], // Mặc định hôm nay
            last_date: ''
        });
        setIsRecordModalOpen(true);
    };

    // --- 3. GỌI API TẠO RECORD (Logic bạn cần) ---
    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            // Xác định isAbsent dựa trên loại đang chọn
            // type = 'absent' -> isAbsent = true (Tạm vắng)
            // type = 'temporary' -> isAbsent = false (Tạm trú)
            const isAbsent = recordData.type === 'absent';

            const payload = {
                humanId: recordData.humanId,
                start_date: recordData.start_date,
                last_date: recordData.last_date,
                isAbsent: isAbsent // <--- Truyền đúng true/false vào đây
            };

            console.log("Gửi API Record:", payload);
            await createRecord(payload);
            
            alert(`✅ Đã đăng ký ${isAbsent ? 'Tạm vắng' : 'Tạm trú'} thành công!`);
            setIsRecordModalOpen(false);
            loadData(); // Load lại để cập nhật trạng thái
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    // --- 4. CÁC HÀM KHÁC (Chuyển đi, Kết thúc hộ...) ---
    const handleStatusChange = async (humanId, isCurrentLiving) => {
        try {
            if (isCurrentLiving) {
                if (window.confirm("Xác nhận người này đã CHUYỂN ĐI HẲN (Cắt khẩu)?")) {
                    await markAsLeave(humanId);
                }
            } else {
                if (window.confirm("Xác nhận người này đã QUAY VỀ sinh sống?")) {
                    await markAsLiving(humanId);
                }
            }
            loadData();
        } catch (error) {
            alert("Lỗi cập nhật trạng thái cư dân!");
        }
    };

    const handleStopLiving = async () => {
        if (!household) return;
        if (window.confirm(`Bạn có chắc chắn muốn kết thúc hộ khẩu tại phòng ${household.room}?`)) {
            try {
                await stopLivingHousehold({
                    room: household.room,
                    stopTime: new Date().toISOString().split('T')[0]
                });
                alert("✅ Đã cập nhật trạng thái: Hộ đã chuyển đi.");
                navigate('/households');
            } catch (error) {
                alert("Lỗi: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : "---";

    if (!household) return <div className="p-10 text-center">Đang tải thông tin hộ...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <button onClick={() => navigate('/households')} className="text-gray-500 hover:text-blue-600 flex items-center gap-2 font-medium">
                    ⬅ Quay lại danh sách
                </button>
                {!household.end_date && (
                    <button onClick={handleStopLiving} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">
                        ⛔ Kết thúc Hộ Khẩu
                    </button>
                )}
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900">Phòng {household.room}</h1>
                <p className="text-gray-500 mt-1">
                    Thời gian: {formatDate(household.start_date)} - {household.end_date ? formatDate(household.end_date) : <span className="text-green-600 font-bold">Hiện tại</span>}
                </p>
            </div>

            {/* List Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                    👥 Danh sách nhân khẩu {showHistory ? "(Toàn bộ lịch sử)" : "(Đang ở)"}
                </h2>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition border
                            ${showHistory ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-300'}`}
                    >
                        {showHistory ? "Đang xem: Tất cả" : "Đang xem: Hiện tại"}
                    </button>

                    {!household.end_date && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 font-bold flex items-center gap-2 transition"
                        >
                            + Thêm Cư Dân
                        </button>
                    )}
                </div>
            </div>

            {/* BẢNG DỮ LIỆU CƯ DÂN */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                            <th className="px-6 py-4">Họ Tên</th>
                            <th className="px-6 py-4">Vai trò</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Đăng ký Biến động</th>
                            <th className="px-6 py-4 text-center">Cắt Khẩu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredResidents.length > 0 ? filteredResidents.map((r) => {
                            const isLiving = r.living === true; 
                            
                            return (
                                <tr key={r.id} className={`hover:bg-gray-50 transition ${!isLiving ? 'bg-gray-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <p className={`font-bold ${isLiving ? 'text-gray-800' : 'text-gray-400'}`}>{r.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(r.dateOfBirth)}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                            {r.role}
                                        </span>
                                    </td>
                                    
                                    {/* CỘT TRẠNG THÁI (Hiển thị Tạm Vắng/Tạm Trú/Thường Trú) */}
                                    <td className="px-6 py-4 text-center">
                                        {!isLiving ? (
                                             <span className="text-gray-400 font-bold text-xs">○ Đã chuyển đi</span>
                                        ) : (
                                            /* Kiểm tra nếu có record active (Cần backend trả về field status/is_absent trong object resident) */
                                            /* Giả sử logic hiển thị tạm thời: */
                                            r.status === 'Tạm vắng' || r.is_absent === true ? (
                                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold">⚠️ Tạm vắng</span>
                                            ) : r.role === 'Tạm trú' || r.role === 'Khách' ? (
                                                <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-bold">🌐 Tạm trú</span>
                                            ) : (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">● Thường trú</span>
                                            )
                                        )}
                                    </td>

                                    {/* CỘT THAO TÁC ĐĂNG KÝ (TẠM VẮNG / TẠM TRÚ) */}
                                    <td className="px-6 py-4 text-center">
                                        {isLiving && !household.end_date && (
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => openRecordModal(r, 'absent')}
                                                    className="text-orange-600 hover:bg-orange-50 border border-orange-200 px-2 py-1 rounded text-xs font-bold transition"
                                                    title="Báo người này đi vắng một thời gian"
                                                >
                                                    Báo Tạm Vắng
                                                </button>
                                                <button 
                                                    onClick={() => openRecordModal(r, 'temporary')}
                                                    className="text-blue-600 hover:bg-blue-50 border border-blue-200 px-2 py-1 rounded text-xs font-bold transition"
                                                    title="Đăng ký tạm trú cho người này"
                                                >
                                                    ĐK Tạm Trú
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* CỘT CẮT KHẨU (CHUYỂN ĐI HẲN) */}
                                    <td className="px-6 py-4 text-center">
                                        {!household.end_date && (
                                            isLiving ? (
                                                <button 
                                                    onClick={() => handleStatusChange(r.id, true)}
                                                    className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition"
                                                >
                                                    ❌ Chuyển đi
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleStatusChange(r.id, false)}
                                                    className="text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-xs font-medium"
                                                >
                                                    ↩ Quay về
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-400 italic">Trống</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL 1: THÊM CƯ DÂN --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-2xl">&times;</button>
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Thêm Cư Dân Mới</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input required className="w-full border p-2 rounded" placeholder="Họ tên"
                                value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} />
                            <input required type="tel" className="w-full border p-2 rounded" placeholder="Số điện thoại"
                                value={addFormData.phonenumber} onChange={e => setAddFormData({...addFormData, phonenumber: e.target.value})} />
                            <input type="email" className="w-full border p-2 rounded" placeholder="Email"
                                value={addFormData.email} onChange={e => setAddFormData({...addFormData, email: e.target.value})} />
                            <input required type="date" className="w-full border p-2 rounded" 
                                value={addFormData.dateOfBirth} onChange={e => setAddFormData({...addFormData, dateOfBirth: e.target.value})} />
                            <select className="w-full border p-2 rounded bg-white"
                                value={addFormData.role} onChange={e => setAddFormData({...addFormData, role: e.target.value})}>
                                <option value="Thành viên">Thành viên</option>
                                <option value="Chủ hộ">Chủ hộ</option>
                                <option value="Khách">Khách / Tạm trú</option>
                            </select>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded mt-2">Xác Nhận</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: ĐĂNG KÝ TẠM VẮNG / TẠM TRÚ (MỚI) --- */}
            {isRecordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in-up">
                        <button onClick={() => setIsRecordModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        
                        <h2 className={`text-xl font-bold mb-2 ${recordData.type === 'absent' ? 'text-orange-600' : 'text-blue-600'}`}>
                            {recordData.type === 'absent' ? '⚠️ Báo Tạm Vắng' : '🌐 Đăng Ký Tạm Trú'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Cư dân: <span className="font-bold text-gray-800">{recordData.humanName}</span>
                        </p>
                        
                        <form onSubmit={handleRecordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Từ ngày (*)</label>
                                <input required type="date" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={recordData.start_date} onChange={e => setRecordData({...recordData, start_date: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Đến ngày (Dự kiến)</label>
                                <input required type="date" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={recordData.last_date} onChange={e => setRecordData({...recordData, last_date: e.target.value})} />
                            </div>

                            <button 
                                type="submit" 
                                className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition mt-2
                                    ${recordData.type === 'absent' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Xác Nhận {recordData.type === 'absent' ? 'Tạm Vắng' : 'Tạm Trú'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseholdDetail;