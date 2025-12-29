import api from './axios';

//tìm kiếm nhân khẩu theo tên
export const getResidentsByName = (name) => {
    return api.get(`/api/humans/name/${name}`);
};

//tìm kiếm hộ đang sống theo số phòng
export const getLivingHouseholdByRoomName = (roomName) => {
    return api.get(`/api/household/roomname/living/${roomName}`);
};

// Lấy tất cả nhân khẩu của 1 hộ (theo ID hộ)
export const getHumansByHousehold = (householdId) => {
    return api.get(`/api/humans/household/${householdId}`);
};

// tìm kiếm các hộ theo lịch sử 
export const getHouseholdHistory = () => {
    return api.get('/api/households');
};
