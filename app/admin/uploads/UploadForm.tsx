"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadForm() {
  const [episode, setEpisode] = useState("episode-1");
  const [language, setLanguage] = useState("kr");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `upstreamer/${episode}/${language}/panel-${String(
        i + 1
      ).padStart(3, "0")}.jpg`;

      const { error } = await supabase.storage
        .from("webtoons")
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) {
        alert("업로드 실패: " + error.message);
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    alert("업로드 완료!");
  };

  return (
    <section className="priceCard">
      <h2>웹툰 이미지 업로드</h2>

      <label>작품</label>
      <select className="adminInput" disabled>
        <option>역류자</option>
      </select>

      <label>회차 선택</label>
      <select
        className="adminInput"
        value={episode}
        onChange={(e) => setEpisode(e.target.value)}
      >
        <option value="episode-1">1화 월악산 흑수협곡</option>
        <option value="episode-2">2화 설악산 천검협곡</option>
        <option value="episode-3">3화 검은 입구</option>
        <option value="episode-4">4화 물 밖의 선수들</option>
      </select>

      <label>언어 선택</label>
      <select
        className="adminInput"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="kr">한국어</option>
        <option value="en">English</option>
      </select>

      <label>웹툰 이미지 선택</label>
      <input
        className="adminInput"
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
      />

      <button className="goldButton" disabled={uploading}>
        {uploading ? "업로드 중..." : "이미지를 선택하면 자동 업로드됩니다"}
      </button>
    </section>
  );
}