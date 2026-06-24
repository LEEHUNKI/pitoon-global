export const episodes = Array.from({ length: 24 }, (_, index) => {
  const episodeNo = index + 1;

  const titles: Record<number, string> = {
    1: "월악산 흑수협곡",
    2: "설악산 천검협곡",
    3: "검은 입구",
    4: "물 밖의 선수들",
    5: "지리산 풍아계곡",
    6: "마음의 흐름",
    7: "주왕산 청석협곡 리그",
  };

  return {
    id: episodeNo,
    title: titles[episodeNo] ?? `시즌1 ${episodeNo}화`,
    path: `/episodes/${episodeNo}`,
    price: episodeNo <= 3 ? "무료" : "Pi 결제",
    locked: episodeNo >= 4,
  };
});