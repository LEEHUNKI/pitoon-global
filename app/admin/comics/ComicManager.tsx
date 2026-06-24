"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Comic = {
  id: number;
  title: string;
  title_en?: string | null;
  description?: string | null;
  genre?: string | null;
  status?: string | null;
  slug?: string | null;
  cover_url?: string | null;
};

export default function ComicManager({ comics }: { comics: Comic[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const startEdit = (comic: Comic) => {
    setEditingId(comic.id);
    setTitle(comic.title || "");
    setTitleEn(comic.title_en || "");
    setDescription(comic.description || "");
    setGenre(comic.genre || "");
    setStatus(comic.status || "");
    setSlug(comic.slug || "");
    setCoverUrl(comic.cover_url || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setTitleEn("");
    setDescription("");
    setGenre("");
    setStatus("");
    setSlug("");
    setCoverUrl("");
    setUploadingCover(false);
    setSaving(false);
  };

  const handleCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        alert(data.error || "표지 이미지 업로드 실패");
        return;
      }

      const uploadedCoverUrl =
        data.coverUrl || data.url || data.imageUrl || data.cover_url || "";

      if (!uploadedCoverUrl) {
        alert("표지 이미지 주소를 가져오지 못했습니다.");
        console.log("upload-cover 응답:", data);
        return;
      }

      setCoverUrl(uploadedCoverUrl);
      alert("표지 이미지가 업로드되었습니다. 이제 수정 저장을 눌러주세요.");
    } catch (error) {
      console.error(error);
      alert("표지 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUpdate = async (comic: Comic) => {
    if (!title) {
      alert("작품 제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("comics")
      .update({
        title: title,
        title_en: titleEn,
        description: description,
        genre: genre,
        status: status,
        slug: slug,
        cover_url: coverUrl,
      })
      .eq("id", comic.id);

    setSaving(false);

    if (error) {
      alert("작품 수정 실패: " + error.message);
      return;
    }

    alert("작품 수정 완료!");
    window.location.reload();
  };

  const handleDelete = async (comic: Comic) => {
    const firstConfirm = confirm(
      `${comic.id}번 작품 "${comic.title}"을 삭제할까요?\n\n이 작업은 작품, 회차, 잠금해제 기록을 함께 삭제합니다.`
    );

    if (!firstConfirm) return;

    const typedTitle = prompt(
      `삭제를 계속하려면 작품 제목을 정확히 입력하세요.\n\n작품 제목: ${comic.title}`
    );

    if (typedTitle === null) {
      alert("삭제가 취소되었습니다.");
      return;
    }

    if (typedTitle.trim() !== comic.title.trim()) {
      alert("작품 제목이 일치하지 않아 삭제를 취소했습니다.");
      return;
    }

    const finalConfirm = confirm(
      `"${comic.title}"을 정말 삭제합니다.\n\n삭제 후에는 관리자 화면에서 복구할 수 없습니다.`
    );

    if (!finalConfirm) return;

    try {
      setDeletingId(comic.id);

      const { error: unlockDeleteError } = await supabase
        .from("episode_unlocks")
        .delete()
        .eq("comic_id", comic.id);

      if (unlockDeleteError) {
        alert("잠금해제 기록 삭제 실패: " + unlockDeleteError.message);
        setDeletingId(null);
        return;
      }

      const { error: episodeDeleteError } = await supabase
        .from("episodes")
        .delete()
        .eq("comic_id", comic.id);

      if (episodeDeleteError) {
        alert("회차 삭제 실패: " + episodeDeleteError.message);
        setDeletingId(null);
        return;
      }

      const { error: comicDeleteError } = await supabase
        .from("comics")
        .delete()
        .eq("id", comic.id);

      if (comicDeleteError) {
        alert("작품 삭제 실패: " + comicDeleteError.message);
        setDeletingId(null);
        return;
      }

      alert("작품, 회차, 잠금해제 기록 삭제 완료!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("작품 삭제 중 오류가 발생했습니다.");
      setDeletingId(null);
    }
  };

  if (!comics.length) {
    return <p>등록된 작품이 없습니다.</p>;
  }

  return (
    <div>
      {comics.map((comic) => {
        return (
          <div
            key={comic.id}
            className="episodeButton"
            style={{ display: "block", marginBottom: "18px" }}
          >
            {editingId === comic.id ? (
              <div>
                <h3>{comic.id}번 작품 수정</h3>

                <label>작품 제목</label>
                <input
                  className="adminInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 역류자"
                />

                <label>영어 제목</label>
                <input
                  className="adminInput"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="예: The Upstreamer"
                />

                <label>작품 설명</label>
                <textarea
                  className="adminInput"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="작품 설명을 입력하세요"
                  rows={4}
                />

                <label>장르</label>
                <input
                  className="adminInput"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="예: 스포츠 / 액션"
                />

                <label>상태</label>
                <select
                  className="adminInput"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">상태 선택</option>
                  <option value="연재중">연재중</option>
                  <option value="완결">완결</option>
                  <option value="휴재">휴재</option>
                  <option value="준비중">준비중</option>
                </select>

                <label>슬러그</label>
                <input
                  className="adminInput"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="예: upstreamer"
                />

                <label>표지 이미지 교체</label>
                <input
                  className="adminInput"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                />

                {uploadingCover && <p>표지 이미지 업로드 중...</p>}

                {coverUrl ? (
                  <div style={{ marginTop: "12px", marginBottom: "16px" }}>
                    <p>현재 적용될 표지</p>
                    <img
                      src={coverUrl}
                      alt="표지 미리보기"
                      style={{
                        width: "160px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        display: "block",
                      }}
                    />
                    <p style={{ fontSize: "12px", wordBreak: "break-all" }}>
                      {coverUrl}
                    </p>
                  </div>
                ) : (
                  <p>현재 등록된 표지가 없습니다.</p>
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
                    onClick={() => handleUpdate(comic)}
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
                <div style={{ display: "flex", gap: "16px" }}>
                  {comic.cover_url ? (
                    <img
                      src={comic.cover_url}
                      alt={`${comic.title} 표지`}
                      style={{
                        width: "100px",
                        height: "130px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "130px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                      }}
                    >
                      표지 없음
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginTop: 0 }}>
                      {comic.id}번 작품 / {comic.title}
                    </h3>

                    {comic.title_en && <p>영어 제목: {comic.title_en}</p>}
                    {comic.genre && <p>장르: {comic.genre}</p>}
                    {comic.status && <p>상태: {comic.status}</p>}
                    {comic.slug && <p>슬러그: {comic.slug}</p>}
                    {comic.description && <p>{comic.description}</p>}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        className="goldButton"
                        onClick={() => startEdit(comic)}
                      >
                        수정
                      </button>

                      <button
                        className="goldButton"
                        onClick={() => handleDelete(comic)}
                        disabled={deletingId === comic.id}
                      >
                        {deletingId === comic.id ? "삭제 중..." : "삭제"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}