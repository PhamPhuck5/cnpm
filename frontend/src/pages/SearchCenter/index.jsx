import React, { useState } from 'react';
import { searchResidentsByName, searchHouseholdsByRoom} from '../../api/searchService';
import ResidentResults from './components/ResidentResults';
import RoomResults from './components/RoomResults';
import ResidentDetailModal from './components/ResidentDetailModal';

const SearchCenter = () => {
    // State UI
    const [searchMode, setSearchMode] = useState('resident'); // 'resident' | 'room'
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // State Data
    const [residentResults, setResidentResults] = useState([]);
    
    // State Data cho Tìm Phòng (Cần 2 phần)
    const [householdResult, setHouseholdResult] = useState(null);
    const [roomResidents, setRoomResidents] = useState([]);

    // State Modal
    const [selectedResident, setSelectedResident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        
        // Reset data cũ
        setResidentResults([]);
        setHouseholdResult(null);
        setRoomResidents([]);

        try {
            if (searchMode === 'resident') {
                // 1. TÌM THEO TÊN
                const res = await searchResidentsByName(query);
                // Backend trả về mảng humans trực tiếp hoặc trong res.data
                setResidentResults(res.data || res || []);
            } else {
                // 2. TÌM THEO SỐ PHÒNG
                // Bước A: Tìm thông tin hộ khẩu
                const res = await searchHouseholdsByRoom(query);
                const households = res.data || res || [];
                
                if (households.length > 0) {
                    // Lấy hộ khẩu mới nhất (phần tử đầu tiên hoặc logic sort date)
                    const activeHousehold = households[0]; 
                    setHouseholdResult(activeHousehold);

                    // Bước B: Gọi tiếp API lấy danh sách người trong hộ này
                    if (activeHousehold.id) {
                        const humanRes = await getResidentsByHouseholdId(activeHousehold.id);
                        setRoomResidents(humanRes.data || humanRes || []);
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            // Có thể thêm Toast báo lỗi ở đây
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">🔍 Tra Cứu Thông Tin</h1>
                <p className="text-gray-500 mt-2 text-sm">Hệ thống tìm kiếm Cư dân & Căn hộ tập trung</p>
            </div>

            {/* Form Tìm Kiếm */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 max-w-4xl mx-auto">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại tìm kiếm</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 font-medium"
                            value={searchMode}
                            onChange={(e) => {
                                setSearchMode(e.target.value);
                                setHasSearched(false);
                                setQuery('');
                            }}
                        >
                            <option value="resident">👤 Tìm theo Tên Cư Dân</option>
                            <option value="room">🏠 Tìm theo Số Phòng</option>
                        </select>
                    </div>

                    <div className="md:w-2/3 flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Từ khóa</label>
                            <input 
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                                placeholder={searchMode === 'resident' ? "Ví dụ: Nguyễn Văn A..." : "Ví dụ: 301, 12A..."}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30 flex items-center disabled:opacity-70"
                        >
                            {loading ? <span className="animate-spin mr-2">⚪</span> : 'Tìm'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Kết quả */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Đang truy xuất dữ liệu...</p>
                    </div>
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
                            householdData={householdResult} 
                            residentsData={roomResidents} 
                        />
                    )
                ) : (
                    // Màn hình Welcome
                    <div className="text-center py-20 opacity-60">
                        <div className="text-6xl mb-4 grayscale">🏙️</div>
                        <h3 className="text-xl font-medium text-gray-600">Sẵn sàng tra cứu</h3>
                        <p className="text-sm text-gray-400 mt-2">Nhập thông tin để tìm kiếm hồ sơ từ hệ thống</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <ResidentDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={selectedResident} 
            />
        </div>
    );
};

export default SearchCenter;