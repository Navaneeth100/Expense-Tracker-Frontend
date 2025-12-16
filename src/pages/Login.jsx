'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { url } from '../../mainurl';
import { Lock, Unlock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Lottie from 'lottie-react';
import animationData from '../Lottie/Login.json';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const initialValues = { email: '', password: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
    });

    const handleSubmit = async (values) => {
        try {
            const res = await axios.post(`${url}/login/`, values);
            if (res.status === 200) {
                toast.success(res.data.message)
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('menu', JSON.stringify(res.data.menu));
                setTimeout(() => {
                navigate(`/dashboard`);
                window.location.reload()
                }, 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="max-w-5xl w-full p-8 shadow-xl rounded-2xl bg-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                {/* Left Lottie Animation */}

                <div className="md:col-span-6 flex justify-center">
                    <Lottie animationData={animationData} loop={true} className="w-full max-w-md" />
                </div>

                {/* Right Form */}

                <div className="md:col-span-6">
                    <h2 className="text-3xl font-extrabold mb-6 text-black-700 text-center md:text-left">Login</h2>

                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {() => (
                            <Form className="space-y-5">
                                <div>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <div className="relative">
                                    <Field
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Unlock size={20} /> : <Lock size={20} />}
                                    </span>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                                >
                                    Login
                                </button>

                                <p className="mt-4 text-sm text-gray-600 text-center md:text-left">
                                    New User? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
