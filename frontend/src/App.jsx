import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Layout
import MainLayout from './components/MainLayout';

// Import các trang Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Import các trang Nghiệp vụ
import HouseholdList from './pages/Household/HouseholdList';
import HouseholdDetail from './pages/Household/HouseholdDetail';
import CreateHousehold from './pages/Household/CreateHousehold';
import CreateBill from './pages/Fees/CreateBill';
import Payment from './pages/Fees/Payment';

// Component bảo vệ Route (Chưa đăng nhập -> Đá về Login)
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTE CÔNG KHAI (Không cần đăng nhập) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ROUTE RIÊNG TƯ (Cần đăng nhập) --- */}
        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                {/* Mặc định vào trang households */}
                <Route path="/" element={<Navigate to="/households" replace />} />
                
                {/* Nhóm Hộ Khẩu */}
                <Route path="/households" element={<HouseholdList />} />
                <Route path="/households/create" element={<CreateHousehold />} />
                <Route path="/households/:id" element={<HouseholdDetail />} />

                {/* Nhóm Thu Phí */}
                <Route path="/fees/create-bill" element={<CreateBill />} />
                <Route path="/fees/payment" element={<Payment />} />
            </Route>
        </Route>

        {/* Xử lý đường dẫn linh tinh -> Về Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;