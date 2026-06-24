import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminLogoutButton from "../AdminLogoutButton";
import UnlockSearchList from "./UnlockSearchList";

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
          <UnlockSearchList
            unlocks={(unlocks || []) as UnlockLog[]}
            comics={(comics || []) as Comic[]}
          />
        )}
      </section>
    </main>
  );
}