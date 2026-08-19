'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@maison-meridia.fr');
  const [password, setPassword] = useState('Meridia2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Veuillez saisir votre email et mot de passe.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Échec de la connexion');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] font-sans-ui">
      
      {/* LEFT: Luxury Bordeaux Architectural Hero Area */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-[#171512] overflow-hidden p-12 flex-col justify-between text-white">
        <img
          src="/images/hero.jpg"
          alt="Bordeaux Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/40 to-transparent" />

        <div className="relative z-10 flex items-center space-x-3">
          <span className="font-serif-display text-2xl font-medium tracking-tight">MAISON MÉRIDIA</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A2234] bg-[#7A2234]/20 px-2.5 py-0.5 rounded-full border border-[#7A2234]/40">
            ADMIN SAAS OS
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#EAE6DF] bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#7A2234]" />
            <span>Gestion Locative & Real Estate OS</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-light leading-tight">
            L'excellence immobilière bordelaise sous contrôle.
          </h1>
          <p className="text-xs text-[#9E9285] leading-relaxed font-light">
            Gérez vos annonces, votre CRM propriétaires/locataires, votre CMS et vos performances depuis un terminal d'administration centralisé.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-[#9E9285] flex items-center justify-between border-t border-white/10 pt-4">
          <span>© 2026 MAISON MÉRIDIA SARL</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7A2234]" />
            <span>Connexion Sécurisée AES-256</span>
          </span>
        </div>
      </div>

      {/* RIGHT: High-End Linear/Notion Style Login Form */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-white border-l border-[#171717]/5 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#7A2234]/10 text-[#7A2234] flex items-center justify-center font-bold">
              MM
            </div>
            <h2 className="font-serif-display text-3xl font-medium text-[#171717]">
              Welcome back.
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Manage your properties, content and enquiries from one place.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Authentification réussie. Redirection...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@maison-meridia.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium text-[#171717] focus:outline-none focus:border-[#7A2234] focus:ring-1 focus:ring-[#7A2234] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold uppercase tracking-wider text-[#171717]">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Veuillez contacter le Super Admin pour réinitialiser.'); }} className="text-[11px] text-[#7A2234] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium text-[#171717] focus:outline-none focus:border-[#7A2234] focus:ring-1 focus:ring-[#7A2234] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#171717]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#171717]/20 text-[#7A2234] focus:ring-[#7A2234]"
                />
                <span className="text-xs text-[#6B6B6B]">Remember me for 24h</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#171717] hover:bg-[#7A2234] text-white py-3.5 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-2 whitespace-nowrap disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign in to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 text-center text-[11px] text-[#6B6B6B] border-t border-[#171717]/5">
            Default credentials: <code className="bg-[#F7F7F5] px-2 py-0.5 rounded font-mono text-[#171717]">admin@maison-meridia.fr</code> / <code className="bg-[#F7F7F5] px-2 py-0.5 rounded font-mono text-[#171717]">Meridia2026!</code>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
