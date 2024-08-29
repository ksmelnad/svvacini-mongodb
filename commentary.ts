import { PrismaClient } from "@prisma/client";
import bs from "./data/bs-bhashya.json";

const prisma = new PrismaClient();

export async function createCommentary() {
  const findPara = await prisma.paragraph.findFirst({
    where: {
      id: "66c7505d6e240aa0425a36b3",
    },
  });

  console.log(findPara);

  if (findPara) {
    const commentaryWrite = await prisma.commentary.create({
      data: {
        lines: bs[0],
        paragraph: {
          connect: {
            id: findPara.id,
          },
        },
      },
    });

    console.log(commentaryWrite);
  }
}
