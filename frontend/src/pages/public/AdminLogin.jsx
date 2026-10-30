import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ShieldAlert, Lock } from "lucide-react";

export default function AdminLogin() {
  const { adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
        
        {/* Header with Security Badge */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Admin Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Restricted Management Access
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800/60 text-red-400 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@luminahotel.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-600 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Secure Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-lg shadow-amber-600/20 text-sm mt-2"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        {/* Back to Home Link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}