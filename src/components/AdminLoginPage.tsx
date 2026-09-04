import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Car, 
  ArrowLeft,
  Sparkles,
  Server
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (user: { username: string; email: string; role: string }) => void;
  onBackToShowroom: () => void;
}

export default function AdminLoginPage({ onLoginSuccess, onBackToShowroom }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate verification delay
    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check credentials (accepts 'admin' / 'admin@shahglobal.com' with password 'shahglobal2025' or 'admin123')
      if (
        (cleanUser === 'admin' || cleanUser === 'admin@shahglobal.com' || cleanUser === 'staff') &&
        (cleanPass === 'shahglobal2025' || cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === 'password')
      ) {
        const userData = {
          username: cleanUser === 'admin' ? 'admin' : cleanUser,
          email: 'admin@shahglobal.com',
          role: 'Senior Executive',
        };

        if (rememberMe) {
          localStorage.setItem('shahglobal_admin_session', JSON.stringify({
            ...userData,
            token: 'tok_' + Date.now(),
            loginAt: new Date().toISOString()
          }));
        }

        onLoginSuccess(userData);
      } else {
        setError('Invalid username or password. Please verify your credentials or click "Fill Demo Credentials" below.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('shahglobal2025');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080a] text-white flex flex-col justify-between overflow-y-auto min-h-screen">
      {/* Top Header Bar */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-neutral-900 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white font-display">
            Shahglobal<span className="text-[#e63946]">.</span>
          </span>
          <span className="text-[10px] font-mono font-bold uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 ml-2">
            STAFF PORTAL
          </span>
        </div>

        <button
          onClick={onBackToShowroom}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO SHOWROOM</span>
        </button>
      </header>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[#0e1014] border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e63946]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] text-[10px] font-mono font-extrabold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EXECUTIVE AUTHENTICATION</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-display mt-2">
              Dealership Portal
            </h1>
            <p className="text-xs text-neutral-400 font-medium">
              Access real-time inventory control, bookings, customer leads, and MySQL cPanel synchronization.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-6 rounded-2xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center justify-between">
                <span>USERNAME OR EMAIL</span>
                <span className="text-[9px] text-neutral-500 font-normal">Default: admin</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#15181e] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center justify-between">
                <span>PASSWORD</span>
                <span className="text-[9px] text-neutral-500 font-normal">Default: shahglobal2025</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#15181e] border border-neutral-700/80 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#e63946] bg-neutral-900 border-neutral-700"
                />
                <span>Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-[#e63946] hover:text-red-400 transition-colors font-mono cursor-pointer"
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-extrabold uppercase tracking-wider font-heading flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-400 uppercase">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                PRE-CONFIGURED ACCESS:
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                READY
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black/50 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">User:</span>
                <span className="text-white font-bold">admin</span>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Pass:</span>
                <span className="text-white font-bold">shahglobal2025</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Footer Info */}
      <footer className="w-full py-4 text-center text-neutral-600 text-[11px] font-mono border-t border-neutral-900">
        Shahglobal Luxury Dealership Platform • cPanel MySQL REST API Enabled • Port 3000
      </footer>
    </div>
  );
}
