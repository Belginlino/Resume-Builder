import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base mx-auto mb-3 shadow-xs">
          CF
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Reset your password</h2>
        <p className="mt-1.5 text-xs text-neutral-500">We'll send password reset instructions to your email.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-neutral-200 rounded-xl sm:px-10 space-y-6">
          
          {submitted ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset Link Sent</span>
              </div>
              <p>Check your email inbox ({email}) for instructions to reset your password.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none transition-all shadow-xs"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs">
            <Link to="/login" className="font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
