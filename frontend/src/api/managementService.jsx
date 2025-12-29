import api from './axios';

// ==================== 1. CĂN HỘ (Apartment) ====================
export const getApartmentByUser = () => {
    return api.get('/api/apartment');
};

export const getAllApartments = () => {
    return api.get('/api/apartments');
};

export const createApartment = (data) => {
    return api.post('/api/apartments', data);
};

// ==================== 2. PHÒNG (Room - Mới) ====================
export const getAllRooms = () => {
    return api.get('/api/room/all');
};

export const getEmptyRooms = () => {
    return api.get('/api/room/empty');
};

export const getOccupiedRooms = () => {
    return api.get('/api/room/occupied');
};

// ==================== 3. HỘ KHẨU (Household) ====================
// Tạo hộ khẩu mới
export const createHousehold = (data) => {
    return api.post('/api/households/create', data);
};

// Lấy danh sách các hộ ĐANG SỐNG
export const getLivingHouseholds = () => {
    return api.get('/api/households/living');
};

// Lấy chi tiết hộ khẩu
export const getHouseholdDetail = (id) => {
    return api.get(`/api/households/${id}`);
};

// Chuyển đi cả hộ (Stop Living)
export const stopLivingHousehold = (data) => {
    // data: { room: "P101", stopTime: "2023-12-31" }
    return api.put('/api/households/stop-living', data);
};

// ==================== 4. CƯ DÂN (Human) ====================
// Thêm nhân khẩu mới vào hộ
export const addResident = (data) => {
    return api.post('/api/humans', data);
};

// Set trạng thái: Đang ở (Living)
export const markAsLiving = (humanId) => {
    return api.patch(`/api/humans/${humanId}/status/living`);
};

// Set trạng thái: Đã rời đi (Leave)
export const markAsLeave = (humanId) => {
    return api.patch(`/api/humans/${humanId}/status/leave`);
};

// Lấy tất cả nhân khẩu trong tòa nhà (của User đang login)
export const getAllHumansInApartment = () => {
    return api.get('/api/humans/household/');
};

// ==================== 5. QUẢN LÝ TẠM VẮNG/LƯU TRÚ (Resident Record) ====================
// Lưu ý: Backend đã đổi từ /api/absents sang /api/records

// Tạo bản ghi (Tạm vắng/Tạm trú)
export const createRecord = (data) => {
    // data: { humanId, start_date, last_date, isAbsent: true/false }
    return api.post('/api/records', data);
};

// Kết thúc bản ghi (Về sớm hơn dự kiến)
export const endRecord = (data) => {
    // data: { record_id, last_date }
    return api.post('/api/records/end', data);
};