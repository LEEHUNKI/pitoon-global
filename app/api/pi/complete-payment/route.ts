import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PI_API_BASE = "https://api.minepi.com/v2";

export async function POST(request: Request) {
  try {
    const { paymentId, txid, comicId, episodeNo, episodeId } =
      await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "paymentId 또는 txid가 없습니다." },
        { status: 400 }
      );
    }

    if (!comicId || !episodeNo || !episodeId) {
      return NextResponse.json(
        { error: "회차 정보가 없습니다." },
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

    const piRes = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const piData = await piRes.json().catch(() => null);

    if (!piRes.ok) {
      console.error("Pi 결제 완료 실패:", piData);

      return NextResponse.json(
        {
          error: "Pi 결제 완료 실패",
          detail: piData,
        },
        { status: piRes.status }
      );
    }

    const userKey = "test-user";

    const { error } = await supabase.from("episode_unlocks").insert({
      comic_id: Number(comicId),
      episode_no: Number(episodeNo),
      episode_id: Number(episodeId),
      user_key: userKey,
    });

    if (error && error.code !== "23505") {
      return NextResponse.json(
        {
          error: "잠금 해제 저장 실패",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: piData,
    });
  } catch (error) {
    console.error("complete-payment 오류:", error);

    return NextResponse.json(
      { error: "결제 완료 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}