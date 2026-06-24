"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ComicForm() {
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("연재중");
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("cover", file);

    try {
      setUploadingCover(true);

      const res = await fetch("/api/upload-cover", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "표지 업로드 실패");
        return;
      }

      setCover(data.imageUrl);
      alert("표지 이미지가 업로드되었습니다.");
    } catch (error) {
      console.error(error);
      alert("표지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    if (!title) {
      alert("작품 제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const slug = titleEn
      ? titleEn.toLowerCase().replaceAll(" ", "-")
      : title.toLowerCase();

    const { error } = await supabase.from("comics").insert({
      title,
      title_en: titleEn,
      description,
      genre,
      status,
      cover_url: cover,
      slug,
    });

    setSaving(false);

    if (error) {
      alert("저장 실패: " + error.message);
      return;
    }

    alert("작품 등록 완료!");
    window.location.reload();
  };

  return (
    <section className="priceCard">
      <h2>새 작품 등록</h2>

      <label>작품 제목</label>
      <input
        className="adminInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>영문 제목</label>
      <input
        className="adminInput"
        value={titleEn}
        onChange={(e) => setTitleEn(e.target.value)}
      />

      <label>표지 이미지</label>
      <input
        className="adminInput"
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
      />

      {uploadingCover && <p>표지 업로드 중...</p>}

      {cover && (
        <div style={{ marginTop: "12px", marginBottom: "20px" }}>
          <p>표지 미리보기</p>
          <img
            src={cover}
            alt="표지 미리보기"
            style={{
              width: "160px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      <label>작품 설명</label>
      <textarea
        className="adminInput"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>장르</label>
      <input
        className="adminInput"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <label>상태</label>
      <select
        className="adminInput"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>연재중</option>
        <option>준비중</option>
        <option>완결</option>
      </select>

      <button className="goldButton" onClick={handleSave} disabled={saving}>
        {saving ? "저장 중..." : "작품 등록하기"}
      </button>
    </section>
  );
}