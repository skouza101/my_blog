import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });
    res.json(users);
  } else if (req.method === "POST") {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } else {
    res.status(405).end();
  }
}

