import api from './axios';

// 1. Lấy tất cả lịch sử cư dân (Cả đang ở và đã đi)
// Backend: GET /api/humans/household/:householdId
export const getAllResidents = (householdId) => {
    return api.get(`/api/humans/household/${householdId}`);
};

// 2. Chỉ lấy cư dân ĐANG Ở (Living)
// Backend: GET /api/humans/household/:householdId/living
export const getLivingResidents = (householdId) => {
    return api.get(`/api/humans/household/${householdId}/living`);
};

// 3. Thêm nhân khẩu mới
// Backend: POST /api/humans
export const addResident = (data) => {
    return api.post('/api/humans', data);
};

// 4. Báo chuyển đi (Tạm vắng/Rời đi)
// Backend: PATCH /api/humans/:humanId/status/leave  <-- Cũ của bạn đang sai chỗ này
export const markAsLeave = (id) => {
    return api.patch(`/api/humans/${id}/status/leave`);
};

// 5. Báo quay lại (Đang ở)
// Backend: PATCH /api/humans/:humanId/status/living
export const markAsLiving = (id) => {
    return api.patch(`/api/humans/${id}/status/living`);
};