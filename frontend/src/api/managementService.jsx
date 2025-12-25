import api from './axios';

// ==================== CĂN HỘ (Apartment) ====================
// 1. Tạo căn hộ mới (Cấu trúc toà nhà)
export const createApartment = (data) => {
    return api.post('/api/apartments', data);
};

// 2. Lấy danh sách tất cả căn hộ
export const getAllApartments = () => {
    return api.get('/api/apartments');
};

// ==================== HỘ KHẨU (Household) ====================
// 3. Tạo hộ khẩu mới (Thêm người vào ở)
export const createHousehold = (data) => {
    return api.post('/api/households/create', data);
};

// 4. Lấy danh sách hộ khẩu
export const getAllHouseholds = () => {
    return api.get('/api/households');
};

// 5. Lấy chi tiết hộ khẩu
export const getHouseholdDetail = (id) => {
    return api.get(`/api/households/${id}`);
};

// ==================== CƯ DÂN (Resident/Human) ====================
// 6. Thêm nhân khẩu mới
export const addResident = (data) => {
    return api.post('/api/humans', data);
};

// 7. Lấy tất cả lịch sử cư dân của 1 hộ
export const getAllResidentsInHousehold = (householdId) => {
    return api.get(`/api/humans/household/${householdId}`);
};

// 8. Chỉ lấy cư dân ĐANG Ở (Living)
export const getLivingResidents = (householdId) => {
    return api.get(`/api/humans/household/${householdId}/living`);
};

// 9. Báo quay lại sinh sống
export const markAsLiving = (humanId) => {
    return api.patch(`/api/humans/${humanId}/status/living`);
};

// 10. Báo chuyển đi/Rời đi
export const markAsLeave = (humanId) => {
    return api.patch(`/api/humans/${humanId}/status/leave`);
};

// ==================== TẠM VẮNG (Absent) ====================
// 11. Đăng ký tạm vắng
export const registerAbsent = (data) => {
    return api.post('/api/absents', data);
};

// 12. Lấy danh sách tạm vắng theo hộ
export const getAbsentsByHousehold = (householdId) => {
    return api.get(`/api/absents/household/${householdId}`);
};

// 13. Lọc tạm vắng (Filter)
export const filterAbsents = (householdId) => {
    return api.get(`/api/absents/household/${householdId}/filter`);
};

// 14. Kết thúc tạm vắng
export const endAbsent = (data) => {
    return api.post('/api/absents/end', data);
};