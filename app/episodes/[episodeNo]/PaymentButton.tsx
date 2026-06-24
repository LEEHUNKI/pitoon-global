"use client";

export default function PaymentButton({
  episodeNo,
}: {
  episodeNo: number;
}) {
  const handlePayment = () => {
    alert("임시 결제 완료!\n\n다음 단계에서 실제 Pi SDK 결제로 교체합니다.");

    localStorage.setItem(`paid-episode-${episodeNo}`, "true");

    window.location.reload();
  };

  return (
    <button className="goldButton" onClick={handlePayment}>
      Pi로 결제하기
    </button>
  );
}