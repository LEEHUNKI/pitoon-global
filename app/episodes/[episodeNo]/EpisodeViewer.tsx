"use client";

import { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";

export default function EpisodeViewer({
  episodeNo,
  title,
  locked,
  images,
}: {
  episodeNo: number;
  title: string;
  locked: boolean;
  images: string[];
}) {
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const paid = localStorage.getItem(`paid-episode-${episodeNo}`);
    setIsPaid(paid === "true");
  }, [episodeNo]);

  if (locked && !isPaid) {
    return (
      <main>
        <h1>역류자 {episodeNo}화</h1>
        <h2>{title}</h2>

        <section className="priceCard">
          <h2>🔒 Pi 결제가 필요한 회차입니다</h2>
          <p>이 회차는 유료 회차입니다.</p>
          <p>웹툰 1회 가격: 200원 상당의 Pi</p>

          <PaymentButton episodeNo={episodeNo} />
        </section>

        <p>
          <a href="/comics/1">회차 목록으로 돌아가기</a>
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>역류자 {episodeNo}화</h1>
      <h2>{title}</h2>

      {images.length === 0 ? (
        <section className="priceCard">
          <p>아직 업로드된 이미지가 없습니다.</p>
        </section>
      ) : (
        images.map((url, index) => (
          <img
            key={url}
            src={url}
            alt={`역류자 ${episodeNo}화 ${index + 1}컷`}
            style={{
              width: "100%",
              display: "block",
              marginBottom: "0",
            }}
          />
        ))
      )}

      <p>
        <a href="/comics/1">회차 목록으로 돌아가기</a>
      </p>
    </main>
  );
}