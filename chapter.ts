import { PrismaClient } from "@prisma/client";
import books from "./data/allBooks.json";
import booksJson from "./data/books.json";
import booksMeta from "./data/booksMeta.json";
import bgChapter from "./data/gita-ch-4.json";
import * as fs from "fs";

const prisma = new PrismaClient();

const existingBooks = [
  "BV_UPG_NY_NYS_NVNYYK_PG_TKS",
  "BV_SH_SS_PS_RV",
  "BV_GN_LVG",
];

export async function findChapter() {
  try {
    const chapterFind = await prisma.chapter.findFirst({
      where: {
        chapterId: "BV_UPG_MIM_UMIM_AV_MG_BMS_1",
      },
      include: {
        sections: {
          include: {
            subsections: {
              include: {
                paragraphs: {
                  include: {
                    commentaries: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(chapterFind);
  } catch (error) {
    console.log(error);
  }
}

export async function createChapter() {
  // Chapter create
  // Object.values(lilavati).map(async (ch, index) => {
  //   const chapWrite = await prisma.chapter.create({
  //     data: {
  //       title: ch,
  //       order: index + 1,
  //       chapterId: `BV_GN_LVG_${index + 1}`,
  //       book: {
  //         connect: {
  //           bookId: "BV_GN_LVG",
  //         },
  //       },
  //     },
  //   });
  //   console.log(chapWrite);
  // });
}

export async function createChapters() {
  // Chapters create many
  Object.values(booksMeta).map(async (item) => {
    if (!existingBooks.includes(item.book.id)) {
      Object.values(item.book.nodes).map(async (ch, index) => {
        const chapWrite = await prisma.chapter.create({
          data: {
            title: ch.key,
            order: index + 1,
            chapterId: `${item.book.id}_${index + 1}`,
            audio: (ch as any).audio,
            book: {
              connect: {
                bookId: item.book.id,
              },
            },
          },
        });
        console.log(chapWrite);
      });
    } else {
      console.log("Book exists");
    }
  });
}

export async function deleteChapter() {
  // Delete all chapters of the books that are not in the existingBooks array
  const res = await prisma.chapter.deleteMany({
    where: {
      NOT: {
        bookId: {
          in: existingBooks,
        },
      },
    },
  });
  console.log(res);
}

export async function updateChapter() {
  // Update chapter audio
  Object.values(booksMeta).map(async (item) => {
    Object.values(item.book.nodes).map(async (ch, index) => {
      if ((ch as any).audio) {
        const res = await prisma.chapter.update({
          where: {
            chapterId: `${item.book.id}_${index + 1}`,
          },
          data: {
            audio: (ch as any).audio,
          },
        });
        console.log(res);
      }
    });
  });
}

export async function listChapters() {
  const res = await prisma.chapter.findMany({
    include: {
      book: true,
    },
  });
  console.log(res);
}

export async function listChaptersWithVerses() {
  const res = await prisma.chapter.findMany({
    where: {
      verses: {
        some: {},
      },
    },
  });
  console.log(res);
}

export async function createDummyChapter() {
  // Chapters create many
  // Object.values(gp).map(async (item) => {

  const chapWrite = await prisma.chapter.create({
    data: {
      title: bgChapter.chapter_title,
      order: 4,
      chapterId: `${bgChapter.book_id}_4`,
      audio: (bgChapter as any).audio,
      book: {
        connect: {
          bookId: bgChapter.book_id,
        },
      },
    },
  });
  console.log(chapWrite);

  // });
}
