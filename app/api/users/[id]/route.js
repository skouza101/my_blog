import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
      const { id } = params;
      
      console.log("Fetching user with ID:", id);
      
      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { error: "Invalid user ID" },
          { status: 400 }
        );
      }
  
      const user = await prisma.user.findUnique({
        where: {
          id: id
        },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              posts: true
            }
          }
        }
      });
  
      if (!user) {
        console.log("User not found:", id);
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      console.log("User found:", user.name || user.email);
  
      const userWithStats = {
        ...user,
        postsCount: user._count.posts,
        followersCount: 0,
        followingCount: 0
      };
  
      return NextResponse.json(userWithStats);
    } catch (error) {
      console.error("Error fetching user:", error);
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
      
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }