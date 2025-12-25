import api from './axios';

// 1. Tìm kiếm cư dân theo tên (Smart Search)
// Backend: router.get("/api/humans/name/:name", ...);
export const searchResidentsByName = (name) => {
    return api.get(`/api/humans/name/${name}`);
};

// 2. Tìm kiếm thông tin phòng (Smart Search)
// Backend: router.get("/api/household/roomname/:name", ...);
export const searchHouseholdsByRoom = (roomName) => {
    return api.get(`/api/household/roomname/${roomName}`);
};
