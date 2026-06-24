"use client";

import { useState } from "react";
import Link from "next/link";

type UnlockLog = {
  id: number;
  comic_id: number;
  episode_no: number;
  created_at?: string;
  user_id?: string | null;
  pi_user_uid?: string | null;
  username?: string | null;
};

type Comic = {
  id: number;
  title: string;
};

export default function UnlockSearchList({
  unlocks,
  comics,
}: {
  unlocks: UnlockLog[];
  comics: Comic[];
}) {
  const [searchText, setSearchText] = useState("");

  const getComicTitle = (comicId: number) => {
    const comic = comics.find((item) => item.id === comicId);
    return comic?.title || `${comicId}번 작품`;
  };

  const formatDate = (dateText?: string) => {
    if (!dateText) return "날짜 정보 없음";

    const date = new Date(dateText);

    if (Number.isNaN(date.getTime())) {
      return dateText;
    }

    return date.toLocaleString("ko-KR");
  };

  const filteredUnlocks = unlocks.filter((unlock) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return true;

    const comicTitle = getComicTitle(unlock.comic_id).toLowerCase();
    const episodeNo = String(unlock.episode_no);
    const comicId = String(unlock.comic_id);
    const userText = (
      unlock.username ||
      unlock.pi_user_uid ||
      unlock.user_id ||
      ""
    ).toLowerCase();

    return (
      comicTitle.includes(keyword) ||
      episodeNo.includes(keyword) ||
      comicId.includes(keyword) ||
      userText.includes(keyword)
    );
  });

  return (
    <div>
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input
          className="adminInput"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="작품명, 작품 번호, 회차 번호, 사용자 정보 검색"
        />

        <p style={{ marginTop: "8px", color: "#ffd166" }}>
          검색 결과: {filteredUnlocks.length}개
        </p>
      </div>

      {filteredUnlocks.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {filteredUnlocks.map((unlock) => (
            <Link
              key={unlock.id}
              href={`/comics/${unlock.comic_id}/episodes/${unlock.episode_no}`}
              style={{
                display: "block",
                padding: "18px",
                borderRadius: "18px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                color: "white",
                textDecoration: "none",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>
                {getComicTitle(unlock.comic_id)} / {unlock.episode_no}화
              </h3>

              <p style={{ margin: "4px 0" }}>
                잠금해제 시간: {formatDate(unlock.created_at)}
              </p>

              <p style={{ margin: "4px 0" }}>
                사용자:{" "}
                {unlock.username ||
                  unlock.pi_user_uid ||
                  unlock.user_id ||
                  "사용자 정보 없음"}
              </p>

              <p style={{ margin: "8px 0 0", color: "#ffd166" }}>
                클릭하면 해당 회차로 이동합니다.
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}