"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    const ok = confirm("관리자에서 로그아웃할까요?");

    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("로그아웃 실패");
        return;
      }

      alert("로그아웃 완료!");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="goldButton"
      onClick={handleLogout}
      disabled={loading}
      style={{ marginBottom: "16px" }}
    >
      {loading ? "로그아웃 중..." : "관리자 로그아웃"}
    </button>
  );
}