'use client';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { url } from '../../mainurl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Lottie from 'lottie-react';
import animationData from '../Lottie/Register.json';

export default function Register() {
    const navigate = useNavigate();

    const initialValues = { username: '', email: '', password: '', password2: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .required('Password is required'),
        password2: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });


    const handleSubmit = async (values) => {
        try {
            const res = await axios.post(`${url}/register/`, values);
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="max-w-5xl w-full p-8 shadow-xl rounded-2xl bg-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                {/* Left Form */}

                <div className="md:col-span-6">
                    <h2 className="text-3xl font-extrabold mb-6 text-black-700 text-center md:text-left">Register</h2>

                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {() => (
                            <Form className="space-y-5">
                                <div>
                                    <Field
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <div>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <div>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder="Enter Password"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <div>
                                    <Field
                                        name="password2"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="password2" component="div" className="text-red-500 text-xs text-start italic mt-1" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                                >
                                    Register
                                </button>

                                <p className="mt-4 text-sm text-gray-600 text-center md:text-left">
                                    Already Registered? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Right Lottie Animation */}

                <div className="md:col-span-6 flex justify-center">
                    <Lottie animationData={animationData} loop={true} className="w-full max-w-md" />
                </div>
            </div>
        </div>
    );
}
