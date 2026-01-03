import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Password from "@/models/Password";
import { encrypt, decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const authData = auth();
    const userId = (await authData).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { website, username, password } = body;

    console.log("BODY:", body);
    console.log("FIELDS:", { website, username, password });

    if (!website || !username || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const encryptedPassword = encrypt(password);

    await connectDB();

    await Password.create({
      userId,
      website,
      username,
      encryptedPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/passwords error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const authData = auth();
    const userId = (await authData).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectDB();

    const passwords = await Password.find({ userId }).sort({
      createdAt: -1,
    });

    const decryptedPasswords = passwords.map((item) => ({
      _id: item._id,
      website: item.website,
      username: item.username,
      password: decrypt(item.encryptedPassword),
      createdAt: item.createdAt,
    }));

    return NextResponse.json(decryptedPasswords);
  } catch (error) {
    console.error("GET /api/passwords error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authData = auth();
    const userId = (await authData).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    await connectDB();

    const deleted = await Password.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/passwords error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const authData = auth();
    const userId = (await authData).userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, website, username, password } = body;

    if (!id || !website || !username || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const encryptedPassword = encrypt(password);

    await connectDB();

    const updated = await Password.findOneAndUpdate(
      { _id: id, userId },
      {
        website,
        username,
        encryptedPassword,
      }
    );

    if (!updated) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    return new NextResponse("Update failed", { status: 500 });
  }
}
