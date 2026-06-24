import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "관리자 비밀번호가 서버에 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "관리자 로그인 성공",
  });

  response.cookies.set("admin_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return response;
}