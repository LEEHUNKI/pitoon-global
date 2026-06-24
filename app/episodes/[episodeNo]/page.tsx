import EpisodeViewer from "./EpisodeViewer";
import { supabase } from "@/lib/supabase";
import { episodes } from "@/lib/episodes";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ episodeNo: string }>;
}) {
  const { episodeNo } = await params;
  const episodeNumber = Number(episodeNo);

  const episode = episodes.find((item) => item.id === episodeNumber);

  if (!episode) {
    return (
      <main>
        <h1>회차를 찾을 수 없습니다.</h1>
        <a href="/comics/1">회차 목록으로 돌아가기</a>
      </main>
    );
  }
  

if (!episode) {
  return (
    <main>
      <h1>회차를 찾을 수 없습니다.</h1>
      <a href="/comics/1">회차 목록으로 돌아가기</a>
    </main>
  );
}

// 여기 추가 ↓↓↓

  const folderName = `episode-${episodeNumber}`;

  const { data: files, error } = await supabase.storage
    .from("webtoons")
    .list(`upstreamer/${folderName}/kr`, {
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    return (
      <main>
        <h1>역류자 {episodeNumber}화</h1>
        <p>이미지를 불러오지 못했습니다.</p>
        <a href="/comics/1">회차 목록으로 돌아가기</a>
      </main>
    );
  }

  const images =
    files?.map((file) => {
      const { data } = supabase.storage
        .from("webtoons")
        .getPublicUrl(`upstreamer/${folderName}/kr/${file.name}`);

      return data.publicUrl;
    }) ?? [];

  return (
  <EpisodeViewer
    episodeNo={episodeNumber}
    title={episode.title}
    locked={episode.locked}
    images={images}
  />
);
}