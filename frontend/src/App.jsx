import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Statistics/index'; 
import SearchCenter from './pages/SearchCenter/index'; 
import HouseholdList from './pages/Household/HouseholdList'; 
import CreateHousehold from './pages/Household/CreateHousehold';
import HouseholdDetail from './pages/Household/HouseholdDetail';
import BillList from './pages/Finance/BillList';
import CreateBill from './pages/Finance/CreateBill';
import BillDetail from './pages/Finance/BillDetail';
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                
                {/* 1. Dashboard (Mặc định) */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 2. Module Tra Cứu */}
                <Route path="/search" element={<SearchCenter />} />

                {/* 3. Module Quản Lý */}
                <Route path="/households" element={<HouseholdList />} />
                <Route path="/households/create" element={<CreateHousehold />} />
                <Route path="/households/:id" element={<HouseholdDetail />} />

                {/* 4. Module Tài Chính */}
                <Route path="/fees/create-bill" element={<CreateBill />} />
                <Route path="/finance/bills" element={<BillList />} />
                <Route path="/finance/bills/:id" element={<BillDetail />} />

            </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;