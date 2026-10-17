'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, 
  AlertCircle, CheckCircle2, Shield, KeyRound, Loader2, Info, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();

  // Credentials requested by user
  const [email, setEmail] = useState('admin@gg.fr.com');
  const [password, setPassword] = useState('@dmin@gg.fr');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already authenticated, redirect immediately to dashboard
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/auth/session')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.authenticated) {
          router.replace('/admin');
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [router]);

  // Handle Caps Lock detection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(lang === 'fr' 
        ? 'Veuillez saisir votre email et votre mot de passe.' 
        : 'Please enter your email and password.');
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
        throw new Error(data.error || (lang === 'fr' ? 'Échec de la connexion' : 'Authentication failed'));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'fr' ? 'Identifiants invalides' : 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@gg.fr.com');
    setPassword('@dmin@gg.fr');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F5F0] text-[#171512] font-sans-ui selection:bg-[#748C8C]/25 selection:text-[#171512] overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* LEFT: Atmospheric Bordeaux Architectural Office Showcase */}
      {/* ========================================================= */}
      <div className="relative hidden lg:flex lg:col-span-7 bg-[#121818] overflow-hidden flex-col justify-between p-10 xl:p-14 text-white">
        
        {/* Office HD Showcase Background with Subtle Parallax & Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/office-HD.png"
            alt="Bureau Goizet Gestion Bordeaux"
            className="w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.78] contrast-[1.06]"
          />
          {/* Subtle multi-layer luxury gradient scrim for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121818] via-[#121818]/65 to-[#121818]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121818]/80" />
        </div>

        {/* Ambient Top Brand Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 shadow-2xl flex items-center justify-center">
              <img
                src="/apple-touch-icon.png"
                alt="Goizet Gestion Logomark"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif-display text-xl font-semibold tracking-tight block leading-tight text-white">
                GOIZET GESTION
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#748C8C] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#748C8C] animate-pulse inline-block" />
                <span>Maison de Conseil Immobilier • Bordeaux</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center space-x-2 text-[11px] font-medium text-[#DCE4E4] bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C]" />
            <span>Terminal d'Administration Sécurisé</span>
          </div>
        </div>

        {/* Middle Value Proposition & Architectural Quote */}
        <div className="relative z-10 space-y-6 max-w-xl my-auto py-12">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#EAE6DF] bg-[#748C8C]/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#748C8C]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#748C8C]" />
            <span>Goizet Gestion SaaS OS • Version 2026.4</span>
          </div>

          <h1 className="font-serif-display text-4xl xl:text-5xl font-light leading-[1.15] text-white">
            {lang === 'fr' 
              ? "L'excellence de la gestion locative bordelaise sous contrôle."
              : 'Exceptional Bordeaux property management, fully synchronized.'}
          </h1>

          <p className="text-sm text-[#DCE4E4]/90 font-light leading-relaxed">
            {lang === 'fr'
              ? 'Accédez au terminal centralisé pour piloter votre portefeuille immobilier, vos mandats, votre CRM prospects et votre présence numérique.'
              : 'Access the centralized terminal to manage your portfolio, owner & tenant CRM pipelines, and digital real estate assets.'}
          </p>

          {/* Luxury Metric Cards */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <span className="block text-[10px] uppercase tracking-wider text-[#90A5A5] font-semibold">
                {lang === 'fr' ? 'Chiffrement' : 'Encryption'}
              </span>
              <span className="font-serif-display text-lg font-medium text-white">AES-256</span>
              <span className="block text-[10px] text-white/60">Bordeaux Cloud</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <span className="block text-[10px] uppercase tracking-wider text-[#90A5A5] font-semibold">
                {lang === 'fr' ? 'Disponibilité' : 'Uptime'}
              </span>
              <span className="font-serif-display text-lg font-medium text-white">99.98%</span>
              <span className="block text-[10px] text-white/60">Temps réel</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <span className="block text-[10px] uppercase tracking-wider text-[#90A5A5] font-semibold">
                {lang === 'fr' ? 'Protection' : 'Protection'}
              </span>
              <span className="font-serif-display text-lg font-medium text-white">Rate Limit</span>
              <span className="block text-[10px] text-white/60">Anti-bruteforce</span>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Credibility */}
        <div className="relative z-10 text-[11px] text-[#A2B2B2] flex items-center justify-between border-t border-white/10 pt-5">
          <span>© 2026 GOIZET GESTION SARL • 48 rue Calvé, 33000 Bordeaux</span>
          <span className="flex items-center space-x-1.5 text-white/70">
            <Building2 className="w-3.5 h-3.5 text-[#748C8C]" />
            <span>CPI33012025000000128</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT: High-End Minimalist Authentication Panel           */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white min-h-screen">
        
        {/* Top Bar with Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#171512]/10 p-1.5 shadow-xs flex items-center justify-center">
              <img
                src="/apple-touch-icon.png"
                alt="Goizet Gestion"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif-display text-sm font-semibold tracking-tight text-[#171512]">
              GOIZET GESTION
            </span>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#F7F5F0] p-1 rounded-xl border border-[#171512]/10 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                lang === 'fr' ? 'bg-white text-[#171512] shadow-2xs font-bold' : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                lang === 'en' ? 'bg-white text-[#171512] shadow-2xs font-bold' : 'text-[#6F6255] hover:text-[#171512]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Main Center Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto my-auto py-8 space-y-7"
        >
          {/* Header Typography */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-3 py-1 rounded-full border border-[#748C8C]/25">
              <Shield className="w-3 h-3 text-[#748C8C]" />
              <span>{lang === 'fr' ? 'Connexion Super Admin' : 'Super Admin Sign In'}</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#171512] tracking-tight">
              {lang === 'fr' ? 'Espace Direction' : 'Admin Portal'}
            </h2>
            <p className="text-xs text-[#6F6255] leading-relaxed">
              {lang === 'fr'
                ? 'Veuillez saisir vos identifiants pour accéder au tableau de bord.'
                : 'Please enter your credentials to access the management workspace.'}
            </p>
          </div>

          {/* Quick Credential Badge Helper */}
          <div 
            onClick={handleQuickFill}
            className="group p-3.5 bg-[#FAF9F6] hover:bg-[#F0F5F5] border border-[#171512]/10 hover:border-[#748C8C]/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between"
            title={lang === 'fr' ? 'Cliquer pour insérer automatiquement les identifiants' : 'Click to autofill credentials'}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center shrink-0">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-[#171512] block">
                  {lang === 'fr' ? 'Identifiants configurés' : 'Configured Credentials'}
                </span>
                <span className="text-[#6F6255] font-mono text-[10px]">
                  admin@gg.fr.com • @dmin@gg.fr
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#748C8C] group-hover:underline">
              {lang === 'fr' ? 'Insérer' : 'Fill'}
            </span>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2.5 shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2.5 shadow-2xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'fr' 
                    ? 'Authentification réussie. Redirection vers le tableau de bord...' 
                    : 'Authentication successful. Redirecting to dashboard...'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Authentication Form */}
          <form onSubmit={handleLogin} className="space-y-4.5 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#171512]"
              >
                {lang === 'fr' ? 'Identifiant / Adresse Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6F6255] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@gg.fr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium text-[#171512] placeholder:text-[#6F6255]/50 focus:outline-none focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="admin-password-input"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#171512]"
                >
                  {lang === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#748C8C] hover:text-[#4F6565] font-semibold transition-colors hover:underline"
                >
                  {lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-[#6F6255] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-11 py-3 bg-[#FAF9F6] border border-[#171512]/15 rounded-xl font-medium text-[#171512] placeholder:text-[#6F6255]/50 focus:outline-none focus:border-[#748C8C] focus:ring-2 focus:ring-[#748C8C]/20 transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F6255] hover:text-[#171512] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {capsLockActive && (
                <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center space-x-1.5">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>{lang === 'fr' ? 'Attention : Verr Maj est activé' : 'Notice: Caps Lock is on'}</span>
                </div>
              )}
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#171512]/20 text-[#748C8C] accent-[#748C8C] focus:ring-[#748C8C] cursor-pointer"
                />
                <span className="text-[11px] text-[#6F6255] font-medium">
                  {lang === 'fr' ? 'Mémoriser ma session pendant 24h' : 'Remember my session for 24 hours'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-brand-gradient hover:bg-brand-gradient-hover active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-semibold text-xs transition-all shadow-brand flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'fr' ? 'Connexion en cours...' : 'Authenticating...'}</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'fr' ? 'Accès autorisé !' : 'Access Granted!'}</span>
                </>
              ) : (
                <>
                  <span>{lang === 'fr' ? 'Accéder au tableau de bord' : 'Sign in to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Bottom */}
          <div className="pt-4 text-center border-t border-[#171512]/10 space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-[10px] text-[#6F6255] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#748C8C]" />
              <span>{lang === 'fr' ? 'Authentification Sécurisée HTTPS / AES-256' : 'Secure TLS 1.3 / AES-256 Session'}</span>
            </div>
            <p className="text-[10px] text-[#6F6255]/70">
              {lang === 'fr' 
                ? 'Terminal strictement réservé aux gestionnaires accrédités Goizet Gestion.' 
                : 'Restricted system for authorized Goizet Gestion personnel only.'}
            </p>
          </div>
        </motion.div>

        {/* Footer Copyright */}
        <div className="text-center text-[11px] text-[#6F6255]/60 pt-4">
          GOIZET GESTION OS • Bordeaux Chartrons
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171512]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#171512]/10 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-semibold text-[#171512]">
                {lang === 'fr' ? 'Réinitialisation du compte' : 'Password Recovery'}
              </h3>
              <p className="text-xs text-[#6F6255] leading-relaxed">
                {lang === 'fr'
                  ? 'Pour des raisons de conformité et de sécurité des mandats, contactez directement la direction Goizet Gestion ou connectez-vous avec les identifiants Super Admin :'
                  : 'For security and regulatory compliance, please contact Goizet Gestion administration or use your Super Admin credentials:'}
              </p>
              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#171512]/10 text-[11px] font-mono text-[#171512] space-y-1">
                <div>Email : <span className="font-bold text-[#748C8C]">admin@gg.fr.com</span></div>
                <div>Pass : <span className="font-bold text-[#748C8C]">@dmin@gg.fr</span></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleQuickFill();
                  setShowForgotModal(false);
                }}
                className="w-full bg-[#171512] hover:bg-[#2C2723] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                {lang === 'fr' ? 'Appliquer ces identifiants' : 'Apply These Credentials'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
