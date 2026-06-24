"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Comic = {
  id: number;
  title: string;
};

export default function EpisodeForm({ comics }: { comics: Comic[] }) {
  const [comicId, setComicId] = useState("");
  const [episodeNo, setEpisodeNo] = useState("");
  const [title, setTitle] = useState("");
  const [locked, setLocked] = useState(false);
  const [price, setPrice] = useState("무료");
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(true);

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleEpisodeImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("episodeImages", file);
    });

    try {
      setUploadingImage(true);

      const res = await fetch("/api/upload-episode-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "회차 이미지 업로드 실패");
        return;
      }

      setImageUrls(data.imageUrls || []);
      setImageUrl(data.imageUrl || data.imageUrls?.[0] || "");

      alert("회차 이미지가 업로드되었습니다.");
    } catch (error) {
      console.error(error);
      alert("회차 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!comicId) {
      alert("작품을 선택해주세요.");
      return;
    }

    if (!episodeNo) {
      alert("회차 번호를 입력해주세요.");
      return;
    }

    if (!title) {
      alert("회차 제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const path = `/comics/${comicId}/episodes/${episodeNo}`;

    const { error } = await supabase.from("episodes").insert({
      comic_id: Number(comicId),
      episode_no: Number(episodeNo),
      published,
      title,
      locked,
      price: locked ? price : "무료",
      path,
      image_url: imageUrl,
      image_urls: imageUrls,
    });

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        alert("이미 같은 작품에 같은 회차 번호가 등록되어 있습니다.");
        return;
      }

      alert("회차 저장 실패: " + error.message);
      return;
    }

    alert("회차 등록 완료!");
    window.location.reload();
  };

  return (
    <section className="priceCard">
      <h2>새 회차 등록</h2>

      <label>작품 선택</label>
      <select
        className="adminInput"
        value={comicId}
        onChange={(e) => setComicId(e.target.value)}
      >
        <option value="">작품을 선택하세요</option>
        {comics.map((comic) => (
          <option key={comic.id} value={comic.id}>
            {comic.id}번 - {comic.title}
          </option>
        ))}
      </select>

      <label>회차 번호</label>
      <input
        className="adminInput"
        type="number"
        value={episodeNo}
        onChange={(e) => setEpisodeNo(e.target.value)}
        placeholder="예: 1"
      />

      <label>회차 제목</label>
      <input
        className="adminInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 시작된 역류"
      />

      <label>회차 이미지</label>
      <input
        className="adminInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleEpisodeImageUpload}
      />

      {uploadingImage && <p>회차 이미지 업로드 중...</p>}

      {imageUrls.length > 0 && (
        <div style={{ marginTop: "12px", marginBottom: "20px" }}>
          <p>회차 이미지 미리보기 ({imageUrls.length}장)</p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {imageUrls.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`회차 이미지 ${index + 1}`}
                style={{
                  width: "120px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </div>
      )}
      <label>공개 여부</label>
<select
  className="adminInput"
  value={published ? "true" : "false"}
  onChange={(e) => setPublished(e.target.value === "true")}
>
  <option value="true">공개</option>
  <option value="false">비공개</option>
</select>

      <label>유료 회차 여부</label>
      <select
        className="adminInput"
        value={locked ? "true" : "false"}
        onChange={(e) => setLocked(e.target.value === "true")}
      >
        <option value="false">무료</option>
        <option value="true">유료</option>
      </select>

      {locked && (
        <>
          <label>가격</label>
          <input
            className="adminInput"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="예: 200원 상당의 Pi"
          />
        </>
      )}

      <button className="goldButton" onClick={handleSave} disabled={saving}>
        {saving ? "저장 중..." : "회차 등록하기"}
      </button>
    </section>
  );
}