import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "K HUN WEBTOON",
  description: "Pi로 즐기는 글로벌 웹툰 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            <span
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 25%, #fff4bc 0%, #f6c552 45%, #b7791f 100%)",
                color: "#2b124c",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "22px",
                border: "2px solid rgba(255,255,255,0.55)",
              }}
            >
              π
            </span>

            <span>K HUN WEBTOON</span>
          </Link>

          <nav
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              href="/"
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              홈
            </Link>

            <Link
              href="/comics"
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              작품 목록
            </Link>

            <Link
              href="/admin"
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                background: "#f6c552",
                color: "#2b124c",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              관리자
            </Link>
          </nav>
        </header>

        {children}

        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
      </body>
    </html>
  );
}