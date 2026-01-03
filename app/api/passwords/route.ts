import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Password from "@/models/Password";
import { encrypt, decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { website, username, password } = await req.json();

    if (!website || !username || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectDB();

    await Password.create({
      userId,
      website,
      username,
      encryptedPassword: encrypt(password),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/passwords error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const passwords = await Password.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      passwords.map((item) => ({
        _id: item._id,
        website: item.website,
        username: item.username,
        password: decrypt(item.encryptedPassword),
        createdAt: item.createdAt,
      }))
    );
  } catch (error) {
    console.error("GET /api/passwords error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = new URL(req.url).searchParams.get("id");
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
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id, website, username, password } = await req.json();

    if (!id || !website || !username || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectDB();

    const updated = await Password.findOneAndUpdate(
      { _id: id, userId },
      {
        website,
        username,
        encryptedPassword: encrypt(password),
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
