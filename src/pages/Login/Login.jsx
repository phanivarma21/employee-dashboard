import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../utils/storage";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication
      if (
        (values.username === "admin" || values.username === "demo") &&
        values.password === "password123"
      ) {
        setAuth();
        navigate("/dashboard");
      } else {
        formik.setErrors({ 
          username: "Invalid credentials",
          password: "Invalid credentials"
        });
      }
      
      setLoading(false);
    },
  });

  return (
    <div style={{
      position: "fixed", // Changed from minHeight to fixed
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "20px",
      overflow: "hidden", // Prevent scrolling
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        html, body {
          overflow: hidden; /* Prevent body scrolling */
          margin: 0;
          padding: 0;
          height: 100%;
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-container {
          animation: fadeSlideIn 0.6s ease-out;
        }
        
        .input-group {
          position: relative;
          margin-bottom: 24px;
        }
        
        .input-field {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s ease;
          background: white;
          outline: none;
        }
        
        .input-field:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .input-field.error {
          border-color: #ef4444;
        }
        
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        
        .toggle-password {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }
        
        .toggle-password:hover {
          color: #667eea;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
          margin-left: 4px;
          display: block;
        }
        
        .submit-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          margin-top: 8px;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }
        
        .demo-info {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
          margin-top: 24px;
          text-align: center;
        }
        
        .demo-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .demo-credentials {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .credential-badge {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: #334155;
          font-family: 'SF Mono', Monaco, monospace;
        }
      `}</style>

      <div className="login-container" style={{
        background: "white",
        padding: "48px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "420px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 8px 0",
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: "15px",
            color: "#64748b",
            margin: 0,
          }}>
            Sign in to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="input-group">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              className={`input-field ${formik.touched.username && formik.errors.username ? 'error' : ''}`}
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <span className="error-message">{formik.errors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              className={`input-field ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
            {formik.touched.password && formik.errors.password && (
              <span className="error-message">{formik.errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !formik.isValid}
          >
            {loading && <span className="spinner" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-info">
          <div className="demo-label">Demo Credentials</div>
          <div className="demo-credentials">
            <span className="credential-badge">admin</span>
            <span className="credential-badge">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;