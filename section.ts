import booksMeta from "./data/booksMeta.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const book = booksMeta.find(
  (item) => item.book.id === "BV_UPG_MIM_UMIM_AV_MG_BMS"
);

export async function createSections() {
  // Sections create for Brahmasutra

  Object.values(book?.book.nodes!).map(async (ch, chIndex) => {
    Object.values(ch.nodes).map(async (section, secIndex) => {
      // Check section exists
      const secWrite = await prisma.section.create({
        data: {
          title: section.key,
          order: secIndex + 1,
          sectionId: `${book?.book.id}_${chIndex + 1}-${secIndex + 1}`,
          chapter: {
            connect: {
              chapterId: `${book?.book.id}_${chIndex + 1}`,
            },
          },
        },
      });
      console.log(secWrite);
    });
  });
}
