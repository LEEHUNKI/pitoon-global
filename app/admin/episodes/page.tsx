import { supabase } from "@/lib/supabase";
import EpisodeForm from "./EpisodeForm";
import EpisodeManager from "./EpisodeManager";
import AdminLogoutButton from "../AdminLogoutButton";
export default async function AdminEpisodesPage() {
  const { data: comics, error: comicsError } = await supabase
    .from("comics")
    .select("*")
    .order("id", { ascending: true });

  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select("*")
    .order("comic_id", { ascending: true })
    .order("episode_no", { ascending: true });

  if (comicsError || episodesError) {
    return (
      <main>
        <h1>회차 관리</h1>
        <AdminLogoutButton />
        <p>데이터를 불러오지 못했습니다.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>회차 관리</h1>

      <EpisodeForm comics={comics || []} />

      <section className="priceCard">
        <h2>등록된 회차 목록</h2>

        <EpisodeManager episodes={episodes || []} />
      </section>
    </main>
  );
}