import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Card from "@/models/Card";
import { encrypt, decrypt } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const authData = auth();
    const userId = (await authData).userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { cardName, expiryMonth, expiryYear, cardNumber, cvv } = body;

    if (!cardName || !expiryMonth || !expiryYear || !cardNumber || !cvv) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectDB();

    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCvv = encrypt(cvv);

    await Card.create({
      userId,
      cardName,
      expiryMonth,
      expiryYear,
      encryptedCardNumber,
      encryptedCvv,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/cards error:", error);
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

    const cards = await Card.find({ userId }).sort({
      createdAt: -1,
    });

    const decryptedCards = cards.map((card) => ({
      _id: card._id,
      cardName: card.cardName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cardNumber: decrypt(card.encryptedCardNumber),
      cvv: decrypt(card.encryptedCvv),
      createdAt: card.createdAt,
    }));

    return NextResponse.json(decryptedCards);
  } catch (error) {
    console.error("GET /api/cards error:", error);
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
    const authData = auth();
    const userId = (await authData).userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("UPDATE CARD BODY:", body);

    const { id, cardName, cardNumber, expiryMonth, expiryYear, cvv } = body;

    if (
      !id ||
      !cardName ||
      !cardNumber ||
      !expiryMonth ||
      !expiryYear ||
      !cvv
    ) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCvv = encrypt(cvv);

    await connectDB();

    const updated = await Card.findOneAndUpdate(
      { _id: id, userId },
      {
        cardName,
        cardNumber: encryptedCardNumber,
        cvv: encryptedCvv,
        expiryMonth,
        expiryYear,
      },
      { new: true }
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
