import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";
import { supabase } from "@/lib/supabase";

type Comic = {
  id: number;
  title: string;
};

type Episode = {
  id: number;
  comic_id: number;
  episode_no: number;
  title: string;
  price?: string | null;
  locked: boolean;
  created_at?: string | null;
};

type EpisodeUnlock = {
  id: number;
  comic_id: number;
  episode_no: number;
  episode_id?: number | null;
  user_key: string;
  created_at?: string | null;
};

export default async function AdminDashboardPage() {
  const { count: comicCount } = await supabase
    .from("comics")
    .select("*", { count: "exact", head: true });

  const { count: episodeCount } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true });

  const { count: freeEpisodeCount } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true })
    .eq("locked", false);

  const { count: paidEpisodeCount } = await supabase
    .from("episodes")
    .select("*", { count: "exact", head: true })
    .eq("locked", true);

  const { count: unlockCount } = await supabase
    .from("episode_unlocks")
    .select("*", { count: "exact", head: true });

  const { data: comics } = await supabase
    .from("comics")
    .select("id, title")
    .order("id", { ascending: true });

  const { data: recentEpisodes } = await supabase
    .from("episodes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUnlocks } = await supabase
    .from("episode_unlocks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const comicList = (comics || []) as Comic[];
  const recentEpisodeList = (recentEpisodes || []) as Episode[];
  const recentUnlockList = (recentUnlocks || []) as EpisodeUnlock[];

  const getComicTitle = (comicId: number) => {
    const comic = comicList.find((item) => item.id === comicId);
    return comic ? comic.title : `${comicId}번 작품`;
  };

  const menuButtonStyle = {
    display: "block",
    width: "100%",
    maxWidth: "360px",
    margin: "0 auto",
    padding: "18px 24px",
    borderRadius: "14px",
    background: "#f6c552",
    color: "#2b124c",
    textAlign: "center" as const,
    fontWeight: "bold",
    fontSize: "20px",
    textDecoration: "none",
  };

  const statCardStyle = {
    padding: "24px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    textAlign: "center" as const,
  };

  const statNumberStyle = {
    fontSize: "38px",
    fontWeight: "bold",
    color: "#f6d985",
    margin: "8px 0 0",
  };

  const listCardStyle = {
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    marginBottom: "12px",
  };

  return (
    <main>
      <h1>관리자 대시보드</h1>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <AdminLogoutButton />
      </div>

      <section className="priceCard">
        <h2>사이트 통계</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <div style={statCardStyle}>
            <h3>전체 작품</h3>
            <p style={statNumberStyle}>{comicCount || 0}</p>
          </div>

          <div style={statCardStyle}>
            <h3>전체 회차</h3>
            <p style={statNumberStyle}>{episodeCount || 0}</p>
          </div>

          <div style={statCardStyle}>
            <h3>무료 회차</h3>
            <p style={statNumberStyle}>{freeEpisodeCount || 0}</p>
          </div>

          <div style={statCardStyle}>
            <h3>유료 회차</h3>
            <p style={statNumberStyle}>{paidEpisodeCount || 0}</p>
          </div>

          <div style={statCardStyle}>
            <h3>잠금해제</h3>
            <p style={statNumberStyle}>{unlockCount || 0}</p>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "24px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        <div className="priceCard">
          <h2>최근 등록 회차</h2>

          {recentEpisodeList.length === 0 ? (
            <p>최근 등록된 회차가 없습니다.</p>
          ) : (
            <div style={{ marginTop: "20px" }}>
              {recentEpisodeList.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/comics/${episode.comic_id}/episodes/${episode.episode_no}`}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <div style={listCardStyle}>
                    <h3 style={{ margin: "0 0 8px", color: "#ffffff" }}>
                      {getComicTitle(episode.comic_id)} {episode.episode_no}화
                    </h3>

                    <p style={{ margin: "0 0 6px", color: "#eeeeee" }}>
                      {episode.title}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: episode.locked ? "#f6d985" : "#8ff0a4",
                        fontWeight: "bold",
                      }}
                    >
                      {episode.locked
                        ? `유료 · ${episode.price || "유료"}`
                        : "무료"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="priceCard">
          <h2>최근 잠금해제 기록</h2>
          <div style={{ marginTop: "12px", marginBottom: "16px", textAlign: "center" }}>
  <Link
    href="/admin/unlocks"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 18px",
      borderRadius: "12px",
      background: "#f6c552",
      color: "#2b124c",
      fontWeight: "bold",
      textDecoration: "none",
    }}
  >
    전체 잠금해제 기록 보기
  </Link>
</div>
          

          {recentUnlockList.length === 0 ? (
            
            <p>최근 잠금해제 기록이 없습니다.</p>
          ) : (
            <div style={{ marginTop: "20px" }}>
              {recentUnlockList.map((unlock) => (
                <Link
                  key={unlock.id}
                  href={`/comics/${unlock.comic_id}/episodes/${unlock.episode_no}`}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <div style={listCardStyle}>
                    <h3 style={{ margin: "0 0 8px", color: "#ffffff" }}>
                      {getComicTitle(unlock.comic_id)} {unlock.episode_no}화
                    </h3>

                    <p style={{ margin: "0 0 6px", color: "#eeeeee" }}>
                      사용자: {unlock.user_key}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: "#8ff0a4",
                        fontWeight: "bold",
                      }}
                    >
                      잠금해제 완료
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="priceCard" style={{ marginTop: "24px" }}>
        <h2>관리 메뉴</h2>

        <div
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <Link href="/admin/comics" style={menuButtonStyle}>
            작품 관리
          </Link>

          <Link href="/admin/episodes" style={menuButtonStyle}>
            회차 관리
          </Link>

          <Link href="/comics" style={menuButtonStyle}>
            작품 목록 보기
          </Link>

          <Link href="/" style={menuButtonStyle}>
            웹사이트 홈으로
          </Link>
        </div>
      </section>

      <section className="priceCard" style={{ marginTop: "24px" }}>
        <h2>현재 관리자 기능</h2>

        <div
          style={{
            maxWidth: "560px",
            margin: "20px auto 0",
            textAlign: "left",
            fontSize: "18px",
            lineHeight: "1.9",
          }}
        >
          <p>✅ 작품 등록, 수정, 삭제</p>
          <p>✅ 작품 표지 업로드 및 교체</p>
          <p>✅ 회차 등록, 수정, 삭제</p>
          <p>✅ 회차 이미지 여러 장 업로드</p>
          <p>✅ 무료 / 유료 회차 설정</p>
          <p>✅ 유료 회차 잠금해제 상태 표시</p>
          <p>✅ 최근 등록 회차 표시</p>
          <p>✅ 최근 잠금해제 기록 표시</p>
          <p>✅ Pi 결제 준비 및 테스트 잠금해제</p>
          <p>✅ 관리자 로그인 / 로그아웃</p>
          <p>✅ 관리자 통계 카드</p>
        </div>
      </section>
    </main>
  );
}