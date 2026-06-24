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

type Episode = {
  id: number;
  comic_id: number;
  episode_no: number;
  title: string;
  price: string;
  locked: boolean;
  path?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
};

type EpisodeUnlock = {
  id: number;
  comic_id: number;
  episode_no: number;
  episode_id?: number | null;
  user_key: string;
};

export default async function ComicDetailPage({
  params,
}: {
  params: Promise<{ comicId: string }>;
}) {
  const { comicId } = await params;

  const { data: comic, error: comicError } = await supabase
    .from("comics")
    .select("*")
    .eq("id", comicId)
    .single();

  const { data: episodes, error: episodeError } = await supabase
    .from("episodes")
    .select("*")
    .eq("comic_id", comicId)
    .order("episode_no", { ascending: true });

  const { data: unlocks } = await supabase
    .from("episode_unlocks")
    .select("*")
    .eq("comic_id", comicId)
    .eq("user_key", "test-user");

  if (comicError || !comic) {
    return (
      <main>
        <section className="priceCard">
          <h1>작품을 찾을 수 없습니다.</h1>
          <p>{comicError?.message}</p>
          <Link href="/comics">작품 목록으로 돌아가기</Link>
        </section>
      </main>
    );
  }

  const currentComic = comic as Comic;
  const episodeList = (episodes || []) as Episode[];
  const unlockList = (unlocks || []) as EpisodeUnlock[];

  const isEpisodeUnlocked = (episodeNo: number) => {
    return unlockList.some((unlock) => unlock.episode_no === episodeNo);
  };

  return (
    <main>
      <section
        className="priceCard"
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px, 320px) 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          <div>
            {currentComic.cover_url ? (
              <img
                src={currentComic.cover_url}
                alt={`${currentComic.title} 표지`}
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  objectFit: "cover",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ddd",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                표지 없음
              </div>
            )}
          </div>

          <div>
            <h1
              style={{
                textAlign: "left",
                margin: "0 0 10px",
                color: "#ffffff",
              }}
            >
              {currentComic.title}
            </h1>

            {currentComic.title_en && (
              <p
                style={{
                  color: "#f6d985",
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "18px",
                }}
              >
                {currentComic.title_en}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "22px",
              }}
            >
              {currentComic.genre && (
                <span
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: "rgba(246,197,82,0.18)",
                    color: "#f6d985",
                    fontWeight: "bold",
                  }}
                >
                  {currentComic.genre}
                </span>
              )}

              {currentComic.status && (
                <span
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {currentComic.status}
                </span>
              )}
            </div>

            {currentComic.description && (
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.8",
                  color: "#eeeeee",
                  marginBottom: "24px",
                }}
              >
                {currentComic.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/comics"
                style={{
                  padding: "13px 18px",
                  borderRadius: "14px",
                  background: "#f6c552",
                  color: "#2b124c",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                작품 목록으로
              </Link>

              {episodeList.length > 0 && (
                <Link
                  href={`/comics/${comicId}/episodes/${episodeList[0].episode_no}`}
                  style={{
                    padding: "13px 18px",
                    borderRadius: "14px",
                    background: "#ffffff",
                    color: "#2b124c",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  첫 화 보기
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="priceCard"
        style={{
          maxWidth: "1050px",
          margin: "28px auto 0",
          padding: "28px",
        }}
      >
        <h2>회차 목록</h2>

        {episodeError && (
          <p>회차 목록을 불러오지 못했습니다: {episodeError.message}</p>
        )}

        {!episodeError && episodeList.length === 0 && (
          <p>아직 등록된 회차가 없습니다.</p>
        )}

        <div
          style={{
            display: "grid",
            gap: "14px",
            marginTop: "22px",
          }}
        >
          {episodeList.map((episode) => {
            const thumbnail =
              episode.image_urls && episode.image_urls.length > 0
                ? episode.image_urls[0]
                : episode.image_url || "";

            const unlocked = episode.locked
              ? isEpisodeUnlocked(episode.episode_no)
              : false;

            const statusText = episode.locked
              ? unlocked
                ? `유료 · ${episode.price || "유료"} · 잠금해제 완료`
                : `유료 · ${episode.price || "유료"}`
              : "무료";

            return (
              <Link
                key={episode.id}
                href={`/comics/${comicId}/episodes/${episode.episode_no}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr auto",
                  gap: "18px",
                  alignItems: "center",
                  padding: "14px",
                  borderRadius: "18px",
                  background: unlocked
                    ? "rgba(143,240,164,0.12)"
                    : "rgba(255,255,255,0.08)",
                  border: unlocked
                    ? "1px solid rgba(143,240,164,0.45)"
                    : "1px solid rgba(255,255,255,0.14)",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={`${episode.title} 썸네일`}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ddd",
                      fontSize: "13px",
                    }}
                  >
                    이미지 없음
                  </div>
                )}

                <div>
                  <h3 style={{ margin: "0 0 8px", color: "#ffffff" }}>
                    {episode.episode_no}화. {episode.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: unlocked ? "#8ff0a4" : "#f6d985",
                      fontWeight: "bold",
                    }}
                  >
                    {statusText}
                  </p>
                </div>

                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "999px",
                    background: unlocked
                      ? "#8ff0a4"
                      : episode.locked
                      ? "#f6c552"
                      : "#ffffff",
                    color: "#2b124c",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {episode.locked
                    ? unlocked
                      ? "감상하기"
                      : episode.price || "유료"
                    : "무료 보기"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}