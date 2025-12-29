import React, { useState } from 'react';
import { 
    getResidentsByName, 
    getLivingHouseholdByRoomName, 
    getHouseholdHistory,
    getHumansByHousehold 
} from '../../api/searchService';
import ResidentResults from './components/ResidentResults';
import RoomResults from './components/RoomResults';
import ResidentDetailModal from './components/ResidentDetailModal';

const SearchCenter = () => {
    // === STATE UI ===
    const [searchMode, setSearchMode] = useState('room_current'); // 'resident' | 'room_current' | 'room_history'
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // === STATE DATA ===
    // 1. Kết quả tìm dân
    const [residentResults, setResidentResults] = useState([]);
    
    // 2. Kết quả tìm phòng (Dùng chung cho cả Hiện tại và Lịch sử)
    // Nếu Hiện tại: mảng có 1 phần tử. Nếu Lịch sử: mảng nhiều phần tử.
    const [roomResults, setRoomResults] = useState([]);
    
    // 3. Dữ liệu cư dân của phòng (Chỉ dùng khi xem chi tiết 1 phòng cụ thể)
    const [roomResidents, setRoomResidents] = useState([]);

    // === STATE MODAL ===
    const [selectedResident, setSelectedResident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        
        // Reset data cũ
        setResidentResults([]);
        setRoomResults([]);
        setRoomResidents([]);

        try {
            if (searchMode === 'resident') {
                // --- CASE 1: TÌM CƯ DÂN ---
                const res = await getResidentsByName(query);
                const data = res.data?.data || res.data || [];
                setResidentResults(Array.isArray(data) ? data : []);
            } 
            else if (searchMode === 'room_current') {
                // --- CASE 2: TÌM PHÒNG HIỆN TẠI ---
                const res = await getLivingHouseholdByRoomName(query);
                const data = res.data?.data || res.data;
                
                if (data) {
                    setRoomResults([data]); // Đưa vào mảng để đồng bộ format
                    // Tự động tải danh sách dân của phòng này luôn
                    if(data.id) {
                        const humanRes = await getHumansByHousehold(data.id);
                        setRoomResidents(humanRes.data?.data || humanRes.data || []);
                    }
                }
            } 
            else if (searchMode === 'room_history') {
                // --- CASE 3: TÌM LỊCH SỬ PHÒNG ---
                const res = await getHouseholdHistory();
                const allHouseholds = res.data?.data || res.data || [];
                
                // Frontend Filter: Lọc theo số phòng
                const historyList = allHouseholds.filter(
                    h => h.room && h.room.toString().toLowerCase() === query.trim().toLowerCase()
                );

                // Sort: Mới nhất lên đầu
                historyList.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                
                setRoomResults(historyList);
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            // Có thể thêm Toast error tại đây
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">🔍 Tra Cứu Thông Tin</h1>
                <p className="text-gray-500 mt-2 text-sm">Hệ thống quản lý cư dân tập trung</p>
            </div>

            {/* Form Tìm Kiếm */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-8 max-w-4xl mx-auto">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chế độ tìm kiếm</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium"
                            value={searchMode}
                            onChange={(e) => {
                                setSearchMode(e.target.value);
                                setHasSearched(false);
                                setQuery('');
                            }}
                        >
                            <option value="room_current">Phòng</option>
                            <option value="room_history">Lịch sử</option>
                            <option value="resident">Tên Cư Dân</option>
                        </select>
                    </div>

                    <div className="md:w-2/3 flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {searchMode === 'resident' ? 'Nhập tên cư dân' : 'Nhập số phòng'}
                            </label>
                            <input 
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                placeholder={searchMode === 'resident' ? "VD: Nguyễn Văn A..." : "VD: 101, P302..."}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <span className="animate-spin">⚪</span>} Tìm
                        </button>
                    </div>
                </form>
            </div>

            {/* Khu vực hiển thị kết quả */}
            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Đang truy xuất dữ liệu...</div>
                ) : hasSearched ? (
                    searchMode === 'resident' ? (
                        <ResidentResults 
                            data={residentResults} 
                            onViewDetail={(item) => {
                                setSelectedResident(item);
                                setIsModalOpen(true);
                            }} 
                        />
                    ) : (
                        <RoomResults 
                            data={roomResults} 
                            residents={roomResidents} 
                            mode={searchMode} // Truyền mode xuống để RoomResults biết cách hiển thị
                        />
                    )
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-6xl mb-4 grayscale">🏢</div>
                        <p className="text-gray-500">Nhập thông tin để bắt đầu tra cứu</p>
                    </div>
                )}
            </div>

            {/* Modal Chi tiết Cư dân */}
            <ResidentDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={selectedResident} 
            />
        </div>
    );
};

export default SearchCenter;