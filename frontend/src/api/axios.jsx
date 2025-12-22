import axios from 'axios';

// 1. Tạo instance (Cấu hình chung)
const instance = axios.create({
    // Nếu bạn chưa cấu hình biến môi trường .env, hãy để cứng localhost:3003
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3003',
    
    // Header mặc định
    headers: {
        'Content-Type': 'application/json',
    },
    
    // Nếu sau này cần gửi Cookie
    withCredentials: true, 
});

// 2. REQUEST INTERCEPTOR (Quan trọng: Gắn Token)
// Trước khi gửi request đi, đoạn này sẽ chạy
instance.interceptors.request.use(
    (config) => {
        // Lấy token từ bộ nhớ (Lúc đăng nhập xong bạn phải lưu vào đây)
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // Gắn vào Header: Authorization: Bearer eyJhbGci...
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. RESPONSE INTERCEPTOR (Xử lý phản hồi)
// Khi nhận data về, đoạn này sẽ chạy
instance.interceptors.response.use(
    (response) => {
        // Cách xử lý đơn giản: Trả về toàn bộ response để bạn tự xử lý ở component
        // Bạn có thể dùng response.data.status hoặc response.data.message tùy ý
        return response; 
    },
    (error) => {
        const { response } = error;
        
        // Xử lý khi Token hết hạn hoặc không hợp lệ (Lỗi 401)
        if (response && response.status === 401) {
            console.log("Phiên đăng nhập hết hạn.");
            // Xóa token cũ
            localStorage.removeItem('token');
            // Đá người dùng về trang đăng nhập
            // window.location.href = '/login'; 
        }

        // Trả lỗi về để component (ví dụ trang Login) có thể catch và hiện alert
        return Promise.reject(error);
    }
);

export default instance;