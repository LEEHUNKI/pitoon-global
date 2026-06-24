import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ComicForm from "./ComicForm";
import ComicManager from "./ComicManager";
import AdminLogoutButton from "../AdminLogoutButton";

export default async function AdminComicsPage() {
  const { data: comics, error } = await supabase
    .from("comics")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main>
        <h1>작품 관리</h1>
        <AdminLogoutButton />
        <p>작품 목록을 불러오지 못했습니다.</p>
        <p>{error.message}</p>
        <Link href="/">홈으로</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>작품 관리</h1>

      <AdminLogoutButton />

      <p>
        <Link href="/admin/episodes">회차 관리로 이동</Link>
      </p>

      <section className="priceCard">
        <h2>새 작품 등록</h2>
        <ComicForm />
      </section>

      <section className="priceCard" style={{ marginTop: "24px" }}>
        <h2>등록된 작품 수정 / 삭제</h2>
        <ComicManager comics={comics || []} />
      </section>

      <p style={{ marginTop: "24px" }}>
        <Link href="/">홈으로 돌아가기</Link>
      </p>
    </main>
  );
}