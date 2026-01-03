import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Card from "@/models/Card";
import { encrypt, decrypt } from "@/lib/crypto";


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { cardName, expiryMonth, expiryYear, cardNumber, cvv } =
      await req.json();

    if (!cardName || !expiryMonth || !expiryYear || !cardNumber || !cvv) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectDB();

    await Card.create({
      userId,
      cardName,
      expiryMonth,
      expiryYear,
      encryptedCardNumber: encrypt(cardNumber),
      encryptedCvv: encrypt(cvv),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/cards error:", error);
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

    const cards = await Card.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      cards.map((card) => ({
        _id: card._id,
        cardName: card.cardName,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        cardNumber: decrypt(card.encryptedCardNumber),
        cvv: decrypt(card.encryptedCvv),
        createdAt: card.createdAt,
      }))
    );
  } catch (error) {
    console.error("GET /api/cards error:", error);
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

    const deleted = await Card.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/cards error:", error);
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

    const { id, cardName, cardNumber, expiryMonth, expiryYear, cvv } =
      await req.json();

    if (!id || !cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectDB();

    const updated = await Card.findOneAndUpdate(
      { _id: id, userId },
      {
        cardName,
        expiryMonth,
        expiryYear,
        encryptedCardNumber: encrypt(cardNumber),
        encryptedCvv: encrypt(cvv),
      }
    );

    if (!updated) {
      return new NextResponse("Card not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE CARD ERROR:", error);
    return new NextResponse("Update failed", { status: 500 });
  }
}
