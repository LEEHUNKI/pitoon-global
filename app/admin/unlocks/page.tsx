import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminLogoutButton from "../AdminLogoutButton";

type Comic = {
  id: number;
  title: string;
};

type UnlockLog = {
  id: number;
  comic_id: number;
  episode_no: number;
  created_at?: string;
  user_id?: string | null;
  pi_user_uid?: string | null;
  username?: string | null;
};

export default async function AdminUnlocksPage() {
  const { data: comics, error: comicsError } = await supabase
    .from("comics")
    .select("id, title")
    .order("id", { ascending: true });

  const { data: unlocks, error: unlocksError } = await supabase
    .from("episode_unlocks")
    .select("*")
    .order("created_at", { ascending: false });

  const getComicTitle = (comicId: number) => {
    const comic = comics?.find((item) => item.id === comicId);
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

  if (comicsError || unlocksError) {
    return (
      <main>
        <h1>잠금해제 기록 관리</h1>
        <AdminLogoutButton />
        <p>잠금해제 기록을 불러오는 중 오류가 발생했습니다.</p>
        <p>{comicsError?.message || unlocksError?.message}</p>
        <Link href="/admin" className="goldButton">
          관리자 대시보드로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>잠금해제 기록 관리</h1>
      <AdminLogoutButton />

      <section className="priceCard" style={{ marginTop: "24px" }}>
        <h2>전체 잠금해제 기록</h2>
        <p>총 {unlocks?.length || 0}개의 잠금해제 기록이 있습니다.</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Link
            href="/admin"
            className="goldButton"
            style={{ textDecoration: "none" }}
          >
            대시보드
          </Link>

          <Link
            href="/admin/episodes"
            className="goldButton"
            style={{ textDecoration: "none" }}
          >
            회차 관리
          </Link>
        </div>

        {!unlocks || unlocks.length === 0 ? (
          <p>아직 잠금해제 기록이 없습니다.</p>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {unlocks.map((unlock: UnlockLog) => (
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
      </section>
    </main>
  );
}