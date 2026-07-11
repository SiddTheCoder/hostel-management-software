"use client";

import { 
  ArrowLeft, 
  BarChart3, 
  Building2, 
  Check, 
  HelpCircle, 
  LockKeyhole, 
  Pencil, 
  ShieldCheck 
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, type FormEvent } from "react";

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(42);
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const emailParam = searchParams.get("email") || "alex@example.com";

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle OTP focus transitions
  const handleOtpChange = (value: string, index: number) => {
    const val = value.replace(/[^0-9]/g, "");
    if (!val) {
      const newOtp = [...otpArray];
      newOtp[index] = "";
      setOtpArray(newOtp);
      return;
    }

    const newOtp = [...otpArray];
    newOtp[index] = val.slice(-1);
    setOtpArray(newOtp);

    // Auto-focus next input
    if (index < 5 && val) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otpArray];
        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otpArray];
        newOtp[index] = "";
        setOtpArray(newOtp);
      }
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const fullCode = otpArray.join("");
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      setIsSubmitting(false);
      return;
    }

    // Simulate OTP validation
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/login");
    }, 1000);
  }

  const resendOtp = () => {
    setError("");
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(42);
      setOtpArray(Array(6).fill(""));
    }, 800);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0f172a] font-sans flex flex-col justify-between p-4 lg:p-8 select-none">
      {/* Top bar */}
      <header className="flex items-center justify-between max-w-[1360px] mx-auto w-full border-b border-slate-100 pb-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 text-[#0A8A4B]">
          <div className="flex items-center justify-center size-9 bg-[#0A8A4B]/10 rounded-xl">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H14V14H10V21H4C3.44772 21 3 20.5523 3 20V9.5Z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-heading text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Hostel<span className="text-[#0A8A4B]">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
          <span className="hidden md:flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-[#0A8A4B]" /> Secure & Trusted
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <HelpCircle className="size-4" /> Need help?
          </span>
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="size-3.5" /> Back to Login
          </button>
        </div>
      </header>

      {/* Outer verification card */}
      <div className="flex-1 flex items-center justify-center w-full max-w-[1100px] mx-auto min-h-0 py-6">
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 grid md:grid-cols-[1.1fr_0.9fr] overflow-hidden min-h-0 max-h-[560px]">
          
          {/* Left side: Inputs */}
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header icon & text */}
              <div className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#0A8A4B]/10 text-[#0A8A4B] mb-4">
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                    <path d="M9 6h6" />
                    <path d="M9 10h6" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">Verify your account</h2>
                <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                  We&apos;ve sent a 6-digit verification code to<br />
                  <span className="font-bold text-slate-600 mt-1 inline-flex items-center gap-1.5">
                    {emailParam}
                    <button 
                      onClick={() => router.push("/signup")}
                      className="text-[#0A8A4B] hover:text-[#0a8a4b]/80 inline-flex items-center"
                      title="Edit details"
                    >
                      <Pencil className="size-3" />
                    </button>
                  </span>
                </p>
              </div>

              {/* Verification form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error ? (
                  <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs font-semibold text-red-600 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                    {error}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex justify-center gap-2 max-w-[340px] mx-auto">
                    {otpArray.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="size-11 md:size-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50/30 focus:border-[#0A8A4B] focus:bg-white focus:ring-2 focus:ring-[#0A8A4B]/10 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend timer */}
                <div className="text-center text-xs font-semibold text-slate-400">
                  Didn&apos;t receive the code?{" "}
                  {countdown > 0 ? (
                    <span className="text-[#0A8A4B] font-bold">Resend in {formatTimer(countdown)}</span>
                  ) : (
                    <button
                      onClick={resendOtp}
                      disabled={isResending}
                      type="button"
                      className="text-[#0A8A4B] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A8A4B] text-sm font-bold text-white transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-400 shadow-md shadow-[#0A8A4B]/10"
                >
                  <LockKeyhole className="size-4" />
                  {isSubmitting ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
            </div>

            {/* Encryption Notice */}
            <div className="text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1 mt-4">
              <LockKeyhole className="size-3" /> Your information is encrypted and secure
            </div>
          </div>

          {/* Right side: Welcome context */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-[#EAF6F3]/50 border-l border-slate-100">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative flex size-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#0A8A4B]/5 animate-ping duration-1000" />
                  <div className="absolute inset-2 rounded-full bg-[#0A8A4B]/10" />
                  <div className="relative flex size-12 items-center justify-center rounded-full bg-[#0A8A4B] text-white shadow-md shadow-[#0A8A4B]/15">
                    <Check className="size-6 stroke-[3]" />
                  </div>
                </div>
                <h3 className="font-heading text-lg font-extrabold text-[#0F172A] mt-4">You&apos;re almost there!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                  Once verified, you&apos;ll get full access to your account and all HostelHub features.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#0A8A4B]/10 text-[#0A8A4B] shrink-0">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Secure Access</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Your account is protected with industry-standard encryption.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#0A8A4B]/10 text-[#0A8A4B] shrink-0">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Manage Easily</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Manage hostels, residents, payments and more from one dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#0A8A4B]/10 text-[#0A8A4B] shrink-0">
                    <BarChart3 className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Grow Your Business</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Get insights and tools to grow your hostel or property business.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-3 flex items-center justify-center gap-3">
        <span>&copy; 2026 HostelHub Platform. All rights reserved.</span>
        <span className="text-slate-200">|</span>
        <span className="flex items-center gap-1">Made with <span className="text-red-500">❤️</span> in Nepal 🇳🇵</span>
      </footer>
    </main>
  );
}
