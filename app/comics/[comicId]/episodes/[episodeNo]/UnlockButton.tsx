"use client";

import { supabase } from "@/lib/supabase";

type UnlockButtonProps = {
  comicId: string;
  episodeNo: string;
  episodeId: number;
  price: string;
};

export default function UnlockButton({
  comicId,
  episodeNo,
  episodeId,
  price,
}: UnlockButtonProps) {
  const saveTestUnlock = async () => {
    const userKey = "test-user";

    const { error } = await supabase.from("episode_unlocks").insert({
      comic_id: Number(comicId),
      episode_no: Number(episodeNo),
      episode_id: episodeId,
      user_key: userKey,
    });

    if (error) {
      if (error.code === "23505") {
        alert("이미 잠금 해제된 회차입니다.");
        window.location.reload();
        return;
      }

      alert("잠금 해제 실패: " + error.message);
      return;
    }

    alert("잠금 해제 완료!");
    window.location.reload();
  };

  const handleTestUnlock = async () => {
    const ok = confirm(
      `${price} 결제를 완료한 것으로 처리하고 이 회차를 잠금 해제할까요?`
    );

    if (!ok) return;

    await saveTestUnlock();
  };

  const approvePiPayment = async (paymentId: string) => {
    const res = await fetch("/api/pi/approve-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Pi 결제 승인 실패:", data);
      alert(data.error || "Pi 결제 승인에 실패했습니다.");
      return;
    }

    console.log("Pi 결제 승인 완료:", data);
  };

  const completePiPayment = async (paymentId: string, txid: string) => {
    const res = await fetch("/api/pi/complete-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        txid,
        comicId,
        episodeNo,
        episodeId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Pi 결제 완료 실패:", data);
      alert(data.error || "Pi 결제 완료 처리에 실패했습니다.");
      return;
    }

    alert("Pi 결제 완료! 회차가 잠금 해제되었습니다.");
    window.location.reload();
  };

  const handlePiPayment = async () => {
    const Pi = (window as any).Pi;

    if (!Pi) {
      alert("Pi Browser에서 실행되지 않았습니다. 현재는 테스트 결제로 진행합니다.");
      await handleTestUnlock();
      return;
    }

    try {
      Pi.init({
        version: "2.0",
        sandbox: true,
      });

      await Pi.authenticate(["payments"], {
        onIncompletePaymentFound: function (payment: any) {
          console.log("미완료 결제 발견:", payment);
        },
      });

      Pi.createPayment(
        {
          amount: 0.01,
          memo: `PiToon ${comicId}번 작품 ${episodeNo}화 잠금 해제`,
          metadata: {
            comicId,
            episodeNo,
            episodeId,
          },
        },
        {
          onReadyForServerApproval: async function (paymentId: string) {
            console.log("서버 승인 요청 paymentId:", paymentId);
            await approvePiPayment(paymentId);
          },

          onReadyForServerCompletion: async function (
            paymentId: string,
            txid: string
          ) {
            console.log("서버 완료 요청 paymentId:", paymentId, "txid:", txid);
            await completePiPayment(paymentId, txid);
          },

          onCancel: function (paymentId: string) {
            console.log("결제 취소:", paymentId);
            alert("결제가 취소되었습니다.");
          },

          onError: function (error: any, payment: any) {
            console.error("Pi 결제 오류:", error, payment);
            alert("Pi 결제 중 오류가 발생했습니다.");
          },
        }
      );
    } catch (error) {
      console.error(error);
      alert("Pi 결제 초기화 중 오류가 발생했습니다. 테스트 결제로 진행합니다.");
      await handleTestUnlock();
    }
  };

  return (
    <div>
      <button className="goldButton" onClick={handlePiPayment}>
        Pi로 결제하고 잠금 해제
      </button>

      <p style={{ fontSize: "12px", opacity: 0.75, marginTop: "10px" }}>
        현재 개발 단계에서는 Pi Browser가 아니면 테스트 결제로 처리됩니다.
      </p>
    </div>
  );
}