"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
type Episode = {
  id: number;
  comic_id: number;
  episode_no: number;
  title: string;
  price: string;
  locked: boolean;
  path: string;
  image_url?: string | null;
  image_urls?: string[] | null;
};

export default function EpisodeManager({ episodes }: { episodes: Episode[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [episodeNo, setEpisodeNo] = useState("");
  const [title, setTitle] = useState("");
  const [locked, setLocked] = useState(false);
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");

  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
  const [uploadingEditImages, setUploadingEditImages] = useState(false);

  const startEdit = (episode: Episode) => {
    setEditingId(episode.id);
    setEpisodeNo(String(episode.episode_no));
    setTitle(episode.title);
    setLocked(episode.locked);
    setPrice(episode.price || "무료");

    const existingImages =
      episode.image_urls && episode.image_urls.length > 0
        ? episode.image_urls
        : episode.image_url
        ? [episode.image_url]
        : [];

    setEditImageUrls(existingImages);
    setEditImageUrl(existingImages[0] || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEpisodeNo("");
    setTitle("");
    setLocked(false);
    setPrice("");
    setEditImageUrl("");
    setEditImageUrls([]);
    setUploadingEditImages(false);
  };

  const handleEditImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("episodeImages", file);
    });

    try {
      setUploadingEditImages(true);

      const res = await fetch("/api/upload-episode-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "회차 이미지 업로드 실패");
        return;
      }

      const uploadedImages: string[] = data.imageUrls || [];

      setEditImageUrls(uploadedImages);
      setEditImageUrl(data.imageUrl || uploadedImages[0] || "");

      alert("수정용 회차 이미지가 업로드되었습니다.");
    } catch (error) {
      console.error(error);
      alert("회차 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingEditImages(false);
    }
  };

  const handleUpdate = async (episode: Episode) => {
    if (!episodeNo) {
      alert("회차 번호를 입력해주세요.");
      return;
    }

    if (!title) {
      alert("회차 제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const newPath = `/comics/${episode.comic_id}/episodes/${episodeNo}`;

    const { error } = await supabase
      .from("episodes")
      .update({
        episode_no: Number(episodeNo),
        title,
        locked,
        price: locked ? price : "무료",
        path: newPath,
        image_url: editImageUrl,
        image_urls: editImageUrls,
      })
      .eq("id", episode.id);

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        alert("이미 같은 작품에 같은 회차 번호가 등록되어 있습니다.");
        return;
      }

      alert("회차 수정 실패: " + error.message);
      return;
    }

    alert("회차 수정 완료!");
    window.location.reload();
  };

  const handleDelete = async (episode: Episode) => {
    const ok = confirm(
      `${episode.comic_id}번 작품 / ${episode.episode_no}화 ${episode.title} 회차를 삭제할까요?`
    );

    if (!ok) return;

    const { error } = await supabase
      .from("episodes")
      .delete()
      .eq("id", episode.id);

    if (error) {
      alert("회차 삭제 실패: " + error.message);
      return;
    }

    alert("회차 삭제 완료!");
    window.location.reload();
  };

  if (!episodes.length) {
    return <p>등록된 회차가 없습니다.</p>;
  }
  const filteredEpisodes = episodes.filter((episode) => {
  if (filter === "free") return !episode.locked;
  if (filter === "paid") return episode.locked;
  return true;
});

  return (
  <div>
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      <button
        className="goldButton"
        onClick={() => setFilter("all")}
        style={{
          opacity: filter === "all" ? 1 : 0.6,
        }}
      >
        전체 회차
      </button>

      <button
        className="goldButton"
        onClick={() => setFilter("free")}
        style={{
          opacity: filter === "free" ? 1 : 0.6,
        }}
      >
        무료 회차
      </button>

      <button
        className="goldButton"
        onClick={() => setFilter("paid")}
        style={{
          opacity: filter === "paid" ? 1 : 0.6,
        }}
      >
        유료 회차
      </button>
    </div>

    {filteredEpisodes.map((episode) => {
        const previewImages =
          episode.image_urls && episode.image_urls.length > 0
            ? episode.image_urls
            : episode.image_url
            ? [episode.image_url]
            : [];

        return (
          <div
            key={episode.id}
            className="episodeButton"
            style={{ display: "block" }}
          >
            {editingId === episode.id ? (
              <div>
                <p>{episode.comic_id}번 작품 회차 수정</p>

                <label>회차 번호</label>
                <input
                  className="adminInput"
                  type="number"
                  value={episodeNo}
                  onChange={(e) => setEpisodeNo(e.target.value)}
                />

                <label>회차 제목</label>
                <input
                  className="adminInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label>회차 이미지 교체</label>
                <input
                  className="adminInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageUpload}
                />

                {uploadingEditImages && <p>수정용 이미지 업로드 중...</p>}

                {editImageUrls.length > 0 && (
                  <div style={{ marginTop: "12px", marginBottom: "20px" }}>
                    <p>현재 적용될 이미지 ({editImageUrls.length}장)</p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {editImageUrls.map((url, index) => (
                        <img
                          key={`${url}-${index}`}
                          src={url}
                          alt={`수정 이미지 ${index + 1}`}
                          style={{
                            width: "120px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

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

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  <button
                    className="goldButton"
                    onClick={() => handleUpdate(episode)}
                    disabled={saving}
                  >
                    {saving ? "수정 중..." : "수정 저장"}
                  </button>

                  <button className="goldButton" onClick={cancelEdit}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  {episode.comic_id}번 작품 / {episode.episode_no}화{" "}
                  {episode.title}
                  <span style={{ float: "right" }}>
                    {episode.locked ? episode.price : "무료"}
                  </span>
                </div>
                <div
  style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
    marginBottom: "8px",
  }}
>
  <span
    style={{
      padding: "6px 10px",
      borderRadius: "999px",
      background: episode.locked ? "#fff3cd" : "#e8f5e9",
      border: "1px solid #ddd",
      fontSize: "14px",
      fontWeight: 700,
    }}
  >
    {episode.locked ? "🔒 유료 회차" : "무료 회차"}
  </span>

  {episode.locked && (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        background: "#f8f9fa",
        border: "1px solid #ddd",
        fontSize: "14px",
        fontWeight: 700,
      }}
    >
      가격: {episode.price || 200}원
    </span>
  )}
</div>

                {previewImages.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "12px",
                    }}
                  >
                    {previewImages.slice(0, 4).map((url, index) => (
                      <img
                        key={`${url}-${index}`}
                        src={url}
                        alt={`${episode.title} 미리보기 ${index + 1}`}
                        style={{
                          width: "90px",
                          borderRadius: "10px",
                          display: "block",
                        }}
                      />
                    ))}

                    {previewImages.length > 4 && (
                      <span style={{ alignSelf: "center" }}>
                        +{previewImages.length - 4}장
                      </span>
                    )}
                  </div>
                )}

                <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  }}
>
  <Link
  href={`/comics/${episode.comic_id}/episodes/${episode.episode_no}`}
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "78px",
    height: "58px",
    padding: "0 20px",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#2b0b5c",
    fontWeight: 700,
    textDecoration: "none",
    border: "none",
  }}
>
  보기
</Link>

  <button
    className="goldButton"
    onClick={() => startEdit(episode)}
  >
    수정
  </button>

  <button
    className="goldButton"
    onClick={() => handleDelete(episode)}
  >
    삭제
  </button>
</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}