import { supabase } from "@/lib/supabase";
import UnlockButton from "./UnlockButton";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ comicId: string; episodeNo: string }>;
}) {
  const { comicId, episodeNo } = await params;

  const { data: comic, error: comicError } = await supabase
    .from("comics")
    .select("*")
    .eq("id", comicId)
    .single();

  const { data: episode, error: episodeError } = await supabase
    .from("episodes")
    .select("*")
    .eq("comic_id", comicId)
    .eq("episode_no", episodeNo)
    .single();

  const userKey = "test-user";

  const { data: unlock } = await supabase
    .from("episode_unlocks")
    .select("*")
    .eq("comic_id", comicId)
    .eq("episode_no", episodeNo)
    .eq("user_key", userKey)
    .maybeSingle();

  const { data: previousEpisode } = await supabase
    .from("episodes")
    .select("episode_no, title")
    .eq("comic_id", comicId)
    .lt("episode_no", episodeNo)
    .order("episode_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: nextEpisode } = await supabase
    .from("episodes")
    .select("episode_no, title")
    .eq("comic_id", comicId)
    .gt("episode_no", episodeNo)
    .order("episode_no", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (comicError || !comic) {
    return (
      <main>
        <section className="priceCard">
          <h1>작품을 찾을 수 없습니다.</h1>
          <p>
            <a href="/comics">작품 목록으로 돌아가기</a>
          </p>
        </section>
      </main>
    );
  }

  if (episodeError || !episode) {
    return (
      <main>
        <section className="priceCard">
          <h1>회차를 찾을 수 없습니다.</h1>
          <p>등록된 회차 정보가 없거나 주소가 잘못되었습니다.</p>
          <p>
            <a href={`/comics/${comicId}`}>회차 목록으로 돌아가기</a>
          </p>
        </section>
      </main>
    );
  }

  const imageUrls =
    episode.image_urls && episode.image_urls.length > 0
      ? episode.image_urls
      : episode.image_url
      ? [episode.image_url]
      : [];

  const isLocked = episode.locked && !unlock;

  const episodeStatusText = episode.locked
    ? unlock
      ? `유료 회차 · ${episode.price} · 잠금해제 완료`
      : `유료 회차 · ${episode.price}`
    : "무료 회차";

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "14px",
    background: "#f6c552",
    color: "#2b124c",
    fontWeight: "bold",
    textDecoration: "none",
  };

  const subButtonStyle = {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontWeight: "bold",
    textDecoration: "none",
  };

  return (
    <main>
      <section
        className="priceCard"
        style={{
          maxWidth: "900px",
          margin: "0 auto 24px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#f6d985",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "8px",
          }}
        >
          《{comic.title}》
        </p>

        <h1
          style={{
            margin: "0 0 14px",
            color: "#ffffff",
            fontSize: "34px",
          }}
        >
          {episode.episode_no}화. {episode.title}
        </h1>

        <p
          style={{
            margin: "0 0 20px",
            color: unlock && episode.locked ? "#8ff0a4" : "#eeeeee",
            fontWeight: "bold",
          }}
        >
          {episodeStatusText}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href={`/comics/${comicId}`} style={buttonStyle}>
            작품 상세로
          </a>

          <a href="/comics" style={subButtonStyle}>
            작품 목록
          </a>
        </div>
      </section>

      {isLocked ? (
        <section
          className="priceCard"
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "54px", marginBottom: "14px" }}>🔒</div>

          <h2>Pi 결제가 필요한 회차입니다</h2>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#eeeeee",
            }}
          >
            이 회차는 유료 회차입니다.
            <br />
            결제 또는 테스트 잠금해제를 진행하면 바로 감상할 수 있습니다.
          </p>

          <p
            style={{
              color: "#f6d985",
              fontSize: "22px",
              fontWeight: "bold",
              marginTop: "18px",
            }}
          >
            가격: {episode.price}
          </p>

          <div style={{ marginTop: "24px" }}>
            <UnlockButton
              comicId={comicId}
              episodeNo={episodeNo}
              episodeId={episode.id}
              price={episode.price}
            />
          </div>

          <p style={{ marginTop: "28px" }}>
            <a href={`/comics/${comicId}`} style={buttonStyle}>
              회차 목록으로 돌아가기
            </a>
          </p>
        </section>
      ) : (
        <>
          <section
            style={{
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            {imageUrls.length > 0 ? (
              imageUrls.map((url: string, index: number) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${episode.title} ${index + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: "820px",
                    display: "block",
                    margin: "0 auto",
                    borderRadius: "0",
                  }}
                />
              ))
            ) : (
              <section className="priceCard">
                <p>등록된 회차 이미지가 없습니다.</p>
                <p>관리자 화면에서 회차 이미지를 업로드해주세요.</p>
              </section>
            )}
          </section>

          <section
            className="priceCard"
            style={{
              maxWidth: "900px",
              margin: "28px auto 0",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div>
                {previousEpisode ? (
                  <a
                    href={`/comics/${comicId}/episodes/${previousEpisode.episode_no}`}
                    style={{
                      display: "block",
                      padding: "14px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.16)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    이전화
                  </a>
                ) : (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.06)",
                      color: "#999",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    이전화 없음
                  </div>
                )}
              </div>

              <a
                href={`/comics/${comicId}`}
                style={{
                  display: "block",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "#f6c552",
                  color: "#2b124c",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                회차 목록
              </a>

              <div>
                {nextEpisode ? (
                  <a
                    href={`/comics/${comicId}/episodes/${nextEpisode.episode_no}`}
                    style={{
                      display: "block",
                      padding: "14px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.16)",
                      color: "#ffffff",
                      fontWeight: "bold",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    다음화
                  </a>
                ) : (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.06)",
                      color: "#999",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    다음화 없음
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}