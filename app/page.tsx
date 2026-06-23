export default function Home() {
  return (
    <main className="main">
      <header className="header">
        <div className="logo">π💬 PiToon Global</div>
        <div className="language">KR | EN</div>
      </header>

      <section className="hero">
        <p className="subtitle">Pi로 만나는 글로벌 웹툰 플랫폼</p>
        <h1>《역류자》</h1>
        <p className="quote">
          계곡은 벽이 아니다.
          <br />
          흐르는 길이다.
        </p>

        <div className="buttonGroup">
          <button className="primaryButton">1화 무료 보기</button>
          <button className="goldButton">4화 Pi로 보기</button>
        </div>
      </section>

      <section className="priceCard">
        <h2>오늘의 Pi 결제 기준</h2>
        <p>웹툰 1회 가격: 200원</p>
        <p>현재 1 Pi 시세: 자동 계산 예정</p>
        <strong>4화 예상 가격: x.xx Pi</strong>
      </section>
      <section className="priceCard">
  <h2>🔥 오늘의 대표작</h2>

  <div
    style={{
      height: "220px",
      background: "#4d2a87",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    }}
  >
    역류자 표지 이미지 예정
  </div>

  <h3>《역류자》</h3>

  <p>스포츠 · 생존 · 팀워크</p>

  <p>1~3화 무료 / 4화부터 Pi 결제</p>

  <button className="goldButton">
    작품 보기
  </button>
</section>
    </main>
  );
}