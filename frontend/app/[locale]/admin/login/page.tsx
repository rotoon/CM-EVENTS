"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLogin } from "@/hooks/use-admin";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Apple HIG System Colors
const hig = {
  blue: "#007AFF",
  red: "#FF3B30",
  labelPrimary: "#000000",
  labelSecondary: "rgba(60, 60, 67, 0.6)",
  labelTertiary: "rgba(60, 60, 67, 0.3)",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F2F2F7",
  separator: "rgba(60, 60, 67, 0.12)",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(password, {
      onSuccess: () => {
        router.push("/admin");
      },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: hig.bgSecondary,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo - iOS App Icon Style */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] text-white text-3xl font-semibold mb-4"
            style={{ backgroundColor: hig.blue }}
          >
            H
          </div>
          <h1
            style={{
              color: hig.labelPrimary,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            HYPE CNX
          </h1>
          <p
            style={{
              color: hig.labelSecondary,
              fontSize: "15px",
              marginTop: "4px",
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Login Card - iOS Card Style */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: hig.bgPrimary }}
        >
          <div className="mb-6 text-center">
            <h2
              style={{
                color: hig.labelPrimary,
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              เข้าสู่ระบบ
            </h2>
            <p
              style={{
                color: hig.labelSecondary,
                fontSize: "15px",
                marginTop: "4px",
              }}
            >
              กรุณาใส่รหัสผ่าน
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Password Input - iOS Style */}
            <div
              className="flex items-center gap-3 rounded-xl px-4"
              style={{
                backgroundColor: hig.bgSecondary,
                minHeight: "50px",
              }}
            >
              <Lock size={20} style={{ color: hig.labelTertiary }} />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                style={{
                  fontSize: "17px",
                  color: hig.labelPrimary,
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-full transition-colors cursor-pointer"
                style={{ color: hig.labelTertiary }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error Message - iOS Alert Style */}
            {loginMutation.error && (
              <div
                className="text-center p-3 rounded-xl"
                style={{
                  backgroundColor: "rgba(255, 59, 48, 0.1)",
                  color: hig.red,
                  fontSize: "15px",
                }}
              >
                {loginMutation.error.message || "รหัสผ่านไม่ถูกต้อง"}
              </div>
            )}

            {/* Submit Button - iOS Capsule Style */}
            <Button
              type="submit"
              className="w-full rounded-full transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: hig.blue,
                fontSize: "17px",
                fontWeight: 600,
                minHeight: "50px",
              }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-8"
          style={{ color: hig.labelTertiary, fontSize: "13px" }}
        >
          © 2026 HYPE CNX
        </p>
      </div>
    </div>
  );
}
