import { prisma } from "../../../../../lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const session = await unstable_getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === "like") {
      // Check if user already liked this post
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: parseInt(id),
          },
        },
      });

      if (existingLike) {
        return NextResponse.json({ message: "Already liked" }, { status: 400 });
      }

      // Create like and increment post likes count
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: parseInt(id),
        },
      });

      const updatedPost = await prisma.post.update({
        where: { id: parseInt(id) },
        data: { likes: { increment: 1 } },
        select: { likes: true },
      });

      return NextResponse.json({
        message: "Post liked",
        likes: updatedPost.likes,
        liked: true
      });
    } else if (action === "unlike") {
      // Check if user has liked this post
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: parseInt(id),
          },
        },
      });

      if (!existingLike) {
        return NextResponse.json({ message: "Not liked yet" }, { status: 400 });
      }

      // Remove like and decrement post likes count
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: parseInt(id),
          },
        },
      });

      const updatedPost = await prisma.post.update({
        where: { id: parseInt(id) },
        data: { likes: { decrement: 1 } },
        select: { likes: true },
      });

      return NextResponse.json({
        message: "Post unliked",
        likes: updatedPost.likes,
        liked: false
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await unstable_getServerSession(authOptions);

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: { likes: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    let userLiked = false;
    if (session) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: parseInt(id),
          },
        },
      });
      userLiked = !!like;
    }

    return NextResponse.json({
      likes: post.likes,
      liked: userLiked,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
