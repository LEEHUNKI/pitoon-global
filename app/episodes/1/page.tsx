import { supabase } from "@/lib/supabase";

export default async function Episode1Page() {
  const { data: files, error } = await supabase.storage
    .from("webtoons")
    .list("upstreamer/episode-1/kr", {
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    return (
      <main>
        <h1>역류자 1화</h1>
        <p>이미지를 불러오지 못했습니다.</p>
      </main>
    );
  }

  const images =
    files?.map((file) => {
      const { data } = supabase.storage
        .from("webtoons")
        .getPublicUrl(`upstreamer/episode-1/kr/${file.name}`);

      return data.publicUrl;
    }) ?? [];

  return (
    <main>
      <h1>역류자 1화</h1>
      <h2>월악산 흑수협곡</h2>

      {images.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={`역류자 1화 ${index + 1}컷`}
          style={{
            width: "100%",
            display: "block",
            marginBottom: "0",
          }}
        />
      ))}
    </main>
  );
}