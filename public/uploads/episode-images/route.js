import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("episodeImage");

    if (!file) {
      return NextResponse.json(
        { error: "회차 이미지가 없습니다." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "episode-images"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalName = file.name;
    const ext = path.extname(originalName);
    const fileName = `episode-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/episode-images/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("회차 이미지 업로드 오류:", error);

    return NextResponse.json(
      { error: "회차 이미지 업로드 실패" },
      { status: 500 }
    );
  }
}