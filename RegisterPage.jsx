import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'wouter';


function RegisterPage() {
  const validationSchema = Yup.object({
    User_name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),

  });

  const initialValues = {
    User_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (values, formikHelpers) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, values);
      console.log('Registration successful:', response.data);
      setLocation("/");

    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      // Handle registration error (e.g., show error message)
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };



  return (
    <div className="container mt-5">
      <h1>Register</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="mb-3">
              {formik.errors.User_name && formik.touched.User_name ? <div className="text-danger">{formik.errors.User_name}</div> : null}
              <label htmlFor="User_name" className="form-label">Name</label>
              <Field
                type="text"
                className="form-control"
                id="User_name"  
                name="User_name"
              // value={formik.values.name}
              />
            </div>

            <div className="mb-3">
              {formik.errors.email && formik.touched.email ? <div className="text-danger">{formik.errors.email}</div> : null}
              <label htmlFor="email" className="form-label">Email</label>
              <Field
                type="email"
                className="form-control"
                id="email"
                name="email"
              // value={formik.values.email}
              />
            </div>


            <div className="mb-3">
              {formik.errors.phone && formik.touched.phone ? (<div className="text-danger">{formik.errors.phone}</div>) : null}
              <label htmlFor="phone" className="form-label">Contact Number</label>
              <Field
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
              // value={formik.values.phone}
              />
            </div>

            <div className="mb-3">
              {formik.errors.password && formik.touched.password ? <div className="text-danger">{formik.errors.password}</div> : null}
              <label htmlFor="password" className="form-label">Password</label>
              <Field
                type="password"
                className="form-control"
                id="password"
                name="password"
              // value={formik.values.password}
              />
            </div>

            <div className="mb-3">
              {formik.errors.confirmPassword && formik.touched.confirmPassword ? <div className="text-danger">{formik.errors.confirmPassword}</div> : null}
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <Field
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
              // value={formik.values.confirmPassword}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterPage;
