import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await API.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7D9EB8] p-6 font-sans">
      {/* Outer Card replicating Figma Screen 2 */}
      <div className="w-full max-w-[390px] rounded-2xl bg-white px-8 py-9 shadow-2xl transition-all">
        <h2 className="mb-7 text-center text-sm font-extrabold tracking-widest text-[#2D3748] uppercase">
          LOGIN
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-slate-800 focus:outline-none"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-slate-800 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-[#EB4D75]"
              />
              <span className="ml-2 font-medium">Remember me?</span>
            </label>
            <span
              onClick={() => alert('Password reset link sent to your email.')}
              className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#EB4D75] py-2.5 text-xs font-bold tracking-wider text-white shadow-md shadow-pink-200 transition hover:bg-[#d83f65] active:scale-[0.99] uppercase disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'LOGIN'}
          </button>
        </form>

        {/* Divider OR */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400">OR</span>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-3.5">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-xs font-bold text-red-500 hover:bg-red-50 transition"
          >
            G
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
          >
            f
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 text-xs font-bold text-sky-600 hover:bg-sky-50 transition"
          >
            in
          </button>
        </div>

        {/* Bottom Link */}
        <p className="mt-7 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-bold text-slate-700 underline hover:text-slate-900">
            SIGN UP
          </Link>
        </p>
      </div>
    </div>
  );
};