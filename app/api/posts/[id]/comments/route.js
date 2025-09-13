import { prisma } from "../../../../../lib/prisma";
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../../../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id) },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const session = await unstable_getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId: parseInt(id),
      },
      include: { author: true },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
