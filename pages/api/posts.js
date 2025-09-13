import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, content, tags } = req.body;
      
      const userId = session.user.id;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: { id: userId },
          },
          tags,
        },
      });
      console.log(post);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res
            .status(409)
            .json({ message: "Post with this title already exists." });
        }
      }
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: { author: true },
      });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).end();
  }
}