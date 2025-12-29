import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Layout
import MainLayout from './components/MainLayout';

// Import Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Statistics/index'; 
import SearchCenter from './pages/SearchCenter/index'; 

// Household Module
import HouseholdList from './pages/Household/HouseholdList'; 
import CreateHousehold from './pages/Household/CreateHousehold';
import HouseholdDetail from './pages/Household/HouseholdDetail';

// Finance Module
import BillList from './pages/Finance/BillList';
import CreateBill from './pages/Finance/CreateBill';
import BillDetail from './pages/Finance/BillDetail';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    // Có thể thêm logic check token hết hạn tại đây nếu cần
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === PROTECTED ROUTES (Yêu cầu đăng nhập) === */}
        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                
                {/* 1. Dashboard (Mặc định) */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 2. Module Tra Cứu (Search) */}
                <Route path="/search" element={<SearchCenter />} />

                {/* 3. Module Quản Lý Hộ Khẩu (Household) */}
                <Route path="/households" element={<HouseholdList />} />
                <Route path="/households/create" element={<CreateHousehold />} />
                <Route path="/households/:id" element={<HouseholdDetail />} />

                {/* 4. Module Tài Chính (Finance) */}
                {/* 👇 SỬA LẠI PATH NÀY ĐỂ KHỚP VỚI LINK TRONG BillList.jsx */}
                <Route path="/finance/create" element={<CreateBill />} /> 
                
                <Route path="/finance/bills" element={<BillList />} />
                <Route path="/finance/bills/:id" element={<BillDetail />} />

            </Route>
        </Route>

        {/* 404 / Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 