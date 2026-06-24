import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Comic = {
  id: number;
  title: string;
  title_en?: string | null;
  description?: string | null;
  genre?: string | null;
  status?: string | null;
  cover_url?: string | null;
};

export default async function HomePage() {
  const { data: comics } = await supabase
    .from("comics")
    .select("*")
    .order("id", { ascending: false })
    .limit(3);

  const latestComics = (comics || []) as Comic[];

  const mainButtonStyle = {
    display: "inline-block",
    padding: "16px 24px",
    borderRadius: "16px",
    background: "#f6c552",
    color: "#2b124c",
    fontWeight: "bold",
    fontSize: "18px",
    textDecoration: "none",
  };

  const subButtonStyle = {
    display: "inline-block",
    padding: "16px 24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "18px",
    textDecoration: "none",
  };

  return (
    <main>
      <section
        className="priceCard"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(246,197,82,0.12)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-90px",
            right: "-90px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "18px",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 25%, #fff4bc 0%, #f6c552 45%, #b7791f 100%)",
                color: "#2b124c",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "22px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.28)",
                border: "2px solid rgba(255,255,255,0.55)",
              }}
            >
              π
            </span>

            <span
              aria-hidden="true"
              style={{
                position: "relative",
                width: "34px",
                height: "24px",
                borderRadius: "12px",
                background: "#ffffff",
                display: "inline-block",
                boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "7px",
                  bottom: "-6px",
                  width: 0,
                  height: 0,
                  borderTop: "8px solid #ffffff",
                  borderRight: "8px solid transparent",
                }}
              />
            </span>

            <span
              style={{
                color: "#f6d985",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Pi Webtoon
            </span>
          </div>

          <h1
            style={{
              fontSize: "52px",
              margin: "0 0 18px",
              color: "#ffffff",
              letterSpacing: "1px",
            }}
          >
            K HUN WEBTOON
          </h1>

          <p
            style={{
              fontSize: "22px",
              lineHeight: "1.7",
              color: "#eeeeee",
              maxWidth: "760px",
              margin: "0 auto 30px",
              fontWeight: "bold",
            }}
          >
            Pi로 즐기는 글로벌 웹툰 플랫폼.
            <br />
            작품 등록, 회차 관리, 유료 회차 잠금해제까지 한 번에 운영합니다.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <Link href="/comics" style={mainButtonStyle}>
              웹툰 보러가기
            </Link>

            <Link href="/admin" style={subButtonStyle}>
              관리자 대시보드
            </Link>
          </div>
        </div>
      </section>

      <section
        className="priceCard"
        style={{
          maxWidth: "1100px",
          margin: "28px auto 0",
          padding: "30px",
        }}
      >
        <h2>최신 등록 작품</h2>

        {latestComics.length === 0 ? (
          <p>아직 등록된 작품이 없습니다.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "22px",
              marginTop: "24px",
            }}
          >
            {latestComics.map((comic) => (
              <Link
                key={comic.id}
                href={`/comics/${comic.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
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
                      borderRadius: "16px",
                      display: "block",
                      marginBottom: "14px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    표지 없음
                  </div>
                )}

                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#ffffff",
                    fontSize: "22px",
                  }}
                >
                  {comic.title}
                </h3>

                {comic.genre && (
                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#f6d985",
                      fontWeight: "bold",
                    }}
                  >
                    {comic.genre}
                  </p>
                )}

                {comic.status && (
                  <p
                    style={{
                      margin: 0,
                      color: "#eeeeee",
                      fontWeight: "bold",
                    }}
                  >
                    {comic.status}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <Link href="/comics" style={mainButtonStyle}>
            전체 작품 보기
          </Link>
        </div>
      </section>

      <section
        className="priceCard"
        style={{
          maxWidth: "1100px",
          margin: "28px auto 0",
          padding: "30px",
        }}
      >
        <h2>플랫폼 기능</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginTop: "22px",
            textAlign: "left",
          }}
        >
          <div>
            <h3>📚 작품 관리</h3>
            <p>작품 등록, 표지 업로드, 작품 정보 수정과 삭제를 지원합니다.</p>
          </div>

          <div>
            <h3>🖼️ 세로 웹툰 뷰어</h3>
            <p>
              회차별 이미지를 여러 장 업로드하고 세로 스크롤로 감상할 수
              있습니다.
            </p>
          </div>

          <div>
            <h3>🔒 유료 회차</h3>
            <p>무료/유료 회차를 구분하고 잠금해제 기능을 적용할 수 있습니다.</p>
          </div>

          <div>
            <h3>π Pi 결제 준비</h3>
            <p>Pi Browser 결제 연동을 위한 기본 구조를 갖추었습니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
}