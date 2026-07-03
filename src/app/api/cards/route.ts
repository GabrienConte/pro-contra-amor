import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: lista todos os cards
export async function GET() {
  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(cards);
}

// POST: cria um novo card
export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, type } = body;

  if (!title || !description || !type) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando" },
      { status: 400 }
    );
  }

  const card = await prisma.card.create({
    data: { title, description, type },
  });

  return NextResponse.json(card, { status: 201 });
}