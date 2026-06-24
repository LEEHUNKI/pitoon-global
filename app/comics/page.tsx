import Link from "next/link";
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

export default async function ComicsPage() {
  const { data: comics, error } = await supabase
    .from("comics")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main>
        <h1>웹툰 작품 목록</h1>
        <section className="priceCard">
          <p>작품 목록을 불러오지 못했습니다.</p>
          <p>{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <h1>K HUN WEBTOON</h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "20px",
          marginTop: "-10px",
          marginBottom: "36px",
          color: "#f6d985",
          fontWeight: "bold",
        }}
      >
        Pi로 즐기는 글로벌 웹툰 플랫폼
      </p>

      {(!comics || comics.length === 0) && (
        <section className="priceCard">
          <p>아직 등록된 작품이 없습니다.</p>
        </section>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {(comics || []).map((comic: Comic) => (
          <article
            key={comic.id}
            className="priceCard"
            style={{
              padding: "18px",
              textAlign: "left",
            }}
          >
            <Link
              href={`/comics/${comic.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {comic.cover_url ? (
                <img
                  src={comic.cover_url}
                  alt={`${comic.title} 표지`}
                  style={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "block",
                    marginBottom: "16px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ddd",
                    fontWeight: "bold",
                  }}
                >
                  표지 없음
                </div>
              )}

              <h2
                style={{
                  fontSize: "24px",
                  margin: "0 0 8px",
                  color: "#ffffff",
                }}
              >
                {comic.title}
              </h2>

              {comic.title_en && (
                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#f6d985",
                    fontWeight: "bold",
                  }}
                >
                  {comic.title_en}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                {comic.genre && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "rgba(246,197,82,0.18)",
                      color: "#f6d985",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {comic.genre}
                  </span>
                )}

                {comic.status && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {comic.status}
                  </span>
                )}
              </div>

              {comic.description && (
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.6",
                    color: "#eeeeee",
                    minHeight: "48px",
                  }}
                >
                  {comic.description}
                </p>
              )}

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "#f6c552",
                  color: "#2b124c",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
              >
                작품 보러가기
              </div>
            </Link>
          </article>
        ))}
      </section>

      <p style={{ textAlign: "center", marginTop: "36px" }}>
        <Link href="/">홈으로 돌아가기</Link>
      </p>
    </main>
  );
}