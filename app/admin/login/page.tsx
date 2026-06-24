"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      alert("관리자 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "관리자 로그인 실패");
        return;
      }

      alert("관리자 로그인 성공!");
      router.push("/admin/comics");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="priceCard" style={{ maxWidth: "520px", margin: "80px auto" }}>
        <h1>관리자 로그인</h1>
        <p>작품과 회차를 관리하려면 관리자 비밀번호를 입력하세요.</p>

        <form onSubmit={handleLogin}>
          <label>관리자 비밀번호</label>
          <input
            className="adminInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="관리자 비밀번호 입력"
          />

          <button
            className="goldButton"
            type="submit"
            disabled={loading}
            style={{ marginTop: "16px" }}
          >
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}