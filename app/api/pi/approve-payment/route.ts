import { NextResponse } from "next/server";

const PI_API_BASE = "https://api.minepi.com/v2";

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId가 없습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.PI_SERVER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "PI_SERVER_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const res = await fetch(`${PI_API_BASE}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Pi 결제 승인 실패:", data);

      return NextResponse.json(
        {
          error: "Pi 결제 승인 실패",
          detail: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      payment: data,
    });
  } catch (error) {
    console.error("approve-payment 오류:", error);

    return NextResponse.json(
      { error: "결제 승인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}