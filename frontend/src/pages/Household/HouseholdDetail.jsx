import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getHouseholdDetail, 
    addResident, 
    markAsLeave,  
    markAsLiving, 
    stopLivingHousehold,
    createRecord 
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
    
    // --- STATE MODAL THÊM CƯ DÂN (Đã cập nhật thêm trường) ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '', 
        identity: '', // CMND/CCCD
        phonenumber: '', 
        email: '', 
        dateOfBirth: '', 
        role: 'Thành viên',
        
        // --- MỚI: Cấu hình loại cư trú ---
        type: 'Thường trú', // Mặc định là thường trú
        startDate: '',      // Ngày bắt đầu tạm trú
        endDate: ''         // Ngày kết thúc tạm trú
    });

    // --- STATE MODAL TẠM VẮNG ---
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [recordData, setRecordData] = useState({
        humanId: null,
        humanName: '',
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

    // --- 1. XỬ LÝ THÊM CƯ DÂN MỚI (CẬP NHẬT LOGIC) ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        // Validate logic Tạm trú
        if (addFormData.type === 'Tạm trú') {
            if (!addFormData.startDate || !addFormData.endDate) {
                alert("Vui lòng nhập đầy đủ thời gian Tạm trú (Từ ngày - Đến ngày)!");
                return;
            }
        }

        try {
            const payload = {
                household_id: parseInt(id),
                name: addFormData.name,
                cccd: addFormData.identity, // Map identity sang cccd (tuỳ backend bạn đặt tên gì)
                phonenumber: addFormData.phonenumber,
                email: addFormData.email,
                dateOfBirth: addFormData.dateOfBirth,
                role: addFormData.role,
                living: true, // Dù tạm trú hay thường trú thì hiện tại vẫn đang Sống ở đây

                // Gửi thêm thông tin loại cư trú
                stay_type: addFormData.type, 
                // Nếu là tạm trú thì gửi ngày, nếu thường trú thì null
                start_date: addFormData.type === 'Tạm trú' ? addFormData.startDate : null,
                end_date: addFormData.type === 'Tạm trú' ? addFormData.endDate : null
            };

            await addResident(payload);
            
            alert(`✅ Thêm cư dân thành công! (Hình thức: ${addFormData.type})`);
            setIsAddModalOpen(false);
            
            // Reset form
            setAddFormData({ 
                name: '', identity: '', phonenumber: '', email: '', dateOfBirth: '', role: 'Thành viên',
                type: 'Thường trú', startDate: '', endDate: ''
            }); 
            
            loadData(); 
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    // --- 2. CÁC HÀM XỬ LÝ KHÁC (GIỮ NGUYÊN) ---
    const openAbsentModal = (human) => {
        setRecordData({
            humanId: human.id,
            humanName: human.name,
            start_date: new Date().toISOString().split('T')[0],
            last_date: ''
        });
        setIsRecordModalOpen(true);
    };

    const handleAbsentSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRecord({
                humanId: recordData.humanId,
                start_date: recordData.start_date,
                last_date: recordData.last_date,
                isAbsent: true 
            });
            await markAsLeave(recordData.humanId); 
            alert(`✅ Đã báo tạm vắng cho ${recordData.humanName}.`);
            setIsRecordModalOpen(false);
            loadData();
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const handleRegisterTemporary = async (humanId, humanName) => {
        if (window.confirm(`Xác nhận đăng ký Trở về (Hủy tạm vắng) cho ${humanName}?`)) {
            try {
                await markAsLiving(humanId);
                alert(`✅ ${humanName} đã quay lại danh sách thường trú.`);
                loadData();
            } catch (error) {
                alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
            }
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
                            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 font-bold flex items-center gap-2 transition"
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
                            <th className="px-6 py-4 text-center">Hình thức</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
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
                                    
                                    {/* TRẠNG THÁI HIỂN THỊ */}
                                    <td className="px-6 py-4 text-center">
                                        {!isLiving ? (
                                             <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">Đã đi / Vắng</span>
                                        ) : (
                                            r.stay_type === 'Tạm trú' ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs font-bold">● Tạm trú</span>
                                                    <span className="text-[10px] text-gray-500 mt-1">Đến: {formatDate(r.end_date)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">● Thường trú</span>
                                            )
                                        )}
                                    </td>

                                    {/* HÀNH ĐỘNG */}
                                    <td className="px-6 py-4 text-center">
                                        {!household.end_date && (
                                            isLiving ? (
                                                <button 
                                                    onClick={() => openAbsentModal(r)}
                                                    className="text-orange-600 hover:bg-orange-50 border border-orange-200 px-3 py-1.5 rounded text-xs font-bold transition"
                                                >
                                                    ⚠️ Báo Tạm Vắng
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRegisterTemporary(r.id, r.name)}
                                                    className="text-blue-600 hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-xs font-bold transition"
                                                >
                                                    🌐 Quay về
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr><td colSpan="4" className="text-center py-8 text-gray-400 italic">Chưa có cư dân nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL 1: THÊM CƯ DÂN (ĐÃ CẬP NHẬT) --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-2xl">&times;</button>
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Thêm Cư Dân Mới</h2>
                        
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            {/* 1. Chọn loại cư trú */}
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <label className="block text-sm font-bold text-blue-800 mb-2">Hình thức cư trú</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" name="resType" value="Thường trú"
                                            checked={addFormData.type === 'Thường trú'}
                                            onChange={e => setAddFormData({...addFormData, type: e.target.value})}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium">Thường trú (Hộ khẩu)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" name="resType" value="Tạm trú"
                                            checked={addFormData.type === 'Tạm trú'}
                                            onChange={e => setAddFormData({...addFormData, type: e.target.value})}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <span className="text-sm font-medium">Tạm trú</span>
                                    </label>
                                </div>
                            </div>

                            {/* 2. Nếu là Tạm trú -> Hiện ô nhập ngày */}
                            {addFormData.type === 'Tạm trú' && (
                                <div className="grid grid-cols-2 gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-fade-in-up">
                                    <div>
                                        <label className="block text-xs font-bold text-purple-800 mb-1">Từ ngày (*)</label>
                                        <input required type="date" className="w-full border p-2 rounded text-sm"
                                            value={addFormData.startDate} 
                                            onChange={e => setAddFormData({...addFormData, startDate: e.target.value})} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-purple-800 mb-1">Đến ngày (*)</label>
                                        <input required type="date" className="w-full border p-2 rounded text-sm"
                                            value={addFormData.endDate} 
                                            onChange={e => setAddFormData({...addFormData, endDate: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 3. Thông tin cá nhân */}
                            <input required className="w-full border p-2 rounded" placeholder="Họ và tên"
                                value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} />
                            
                            <input required className="w-full border p-2 rounded" placeholder="Số CMND/CCCD"
                                value={addFormData.identity} onChange={e => setAddFormData({...addFormData, identity: e.target.value})} />
                            
                            <input required type="tel" className="w-full border p-2 rounded" placeholder="Số điện thoại"
                                value={addFormData.phonenumber} onChange={e => setAddFormData({...addFormData, phonenumber: e.target.value})} />
                            
                            <input type="email" className="w-full border p-2 rounded" placeholder="Email (nếu có)"
                                value={addFormData.email} onChange={e => setAddFormData({...addFormData, email: e.target.value})} />
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
                                <input required type="date" className="w-full border p-2 rounded" 
                                value={addFormData.dateOfBirth} onChange={e => setAddFormData({...addFormData, dateOfBirth: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Vai trò</label>
                                <select className="w-full border p-2 rounded bg-white"
                                    value={addFormData.role} onChange={e => setAddFormData({...addFormData, role: e.target.value})}>
                                    <option value="Thành viên">Thành viên</option>
                                    <option value="Chủ hộ">Chủ hộ</option>
                                    <option value="Người ở ghép">Người ở ghép</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded shadow hover:bg-blue-700 transition">
                                Xác Nhận Thêm
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: BÁO TẠM VẮNG (GIỮ NGUYÊN) --- */}
            {isRecordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
                        <button onClick={() => setIsRecordModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        <h2 className="text-xl font-bold mb-2 text-orange-600">⚠️ Báo Tạm Vắng</h2>
                        <p className="text-sm text-gray-600 mb-4">Xác nhận báo vắng mặt cho: <span className="font-bold text-gray-800">{recordData.humanName}</span></p>
                        <form onSubmit={handleAbsentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Bắt đầu vắng từ (*)</label>
                                <input required type="date" className="w-full border border-gray-300 p-2.5 rounded" 
                                    value={recordData.start_date} onChange={e => setRecordData({...recordData, start_date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Đến ngày (Dự kiến)</label>
                                <input required type="date" className="w-full border border-gray-300 p-2.5 rounded" 
                                    value={recordData.last_date} onChange={e => setRecordData({...recordData, last_date: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-orange-600 transition mt-2">Xác Nhận Tạm Vắng</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseholdDetail;