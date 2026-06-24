import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("episodeImages");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "회차 이미지가 없습니다." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "episode-images"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name;
      const ext = path.extname(originalName);

      const fileName = `episode-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}${ext}`;

      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imageUrls.push(`/uploads/episode-images/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      imageUrls,
      imageUrl: imageUrls[0],
    });
  } catch (error) {
    console.error("회차 이미지 업로드 오류:", error);

    return NextResponse.json(
      { error: "회차 이미지 업로드 실패" },
      { status: 500 }
    );
  }
}