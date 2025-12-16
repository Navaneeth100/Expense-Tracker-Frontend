import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PermissionDenied from "../PermissionDenied";
import ProtectedRoute from "../ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MenuList from "./pages/MenuList";
import Category from "./pages/ExpenseCategory";
import Type from "./pages/IncomeType";
import PaymentMethod from "./pages/PaymentMethod";
import Expense from "./pages/Transaction";
import CategoryBudget from "./pages/CategoryBudget";
import MainLayout from "./pages/MainLayout";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/menu_list" element={<MenuList />} />
          <Route path="/Income_type" element={<Type />} />
          <Route path="/expense_category" element={<Category />} />
          <Route path="/payment_method" element={<PaymentMethod />} />
          <Route path="/transaction" element={<Expense />} />
          <Route path="/category_budget" element={<CategoryBudget />} />
          <Route path="/permission-denied" element={<PermissionDenied />} />
        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
}

export default App;
