import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

function uploadBufferToCloudinary(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const resourceType = "raw";

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "hireflow/resumes",
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        format: fileName.split(".").pop(),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    const role = (session?.user as any)?.role as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "CANDIDATE" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF or Word documents are allowed" },
        { status: 400 }
      );
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: "File must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadBufferToCloudinary(
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json(
      {
        data: {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          fileName: file.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}