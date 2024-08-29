import booksMeta from "./data/booksMeta.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const book = booksMeta.find(
  (item) => item.book.id === "BV_UPG_MIM_UMIM_AV_MG_BMS"
);

export async function createSubsections() {
  // Sections create for Brahmasutra

  Object.values(book?.book.nodes!).map(async (ch, chIndex) => {
    Object.values(ch.nodes).map(async (section, secIndex) => {
      Object.values(section.nodes).map(async (subsection, subsecIndex) => {
        // Check section exists
        const subsecWrite = await prisma.subsection.create({
          data: {
            title: subsection.key,
            order: subsecIndex + 1,
            subsectionId: `${book?.book.id}_${chIndex + 1}-${secIndex + 1}-${
              subsecIndex + 1
            }`,

            section: {
              connect: {
                sectionId: `${book?.book.id}_${chIndex + 1}-${secIndex + 1}`,
              },
            },
          },
        });
        console.log(subsecWrite);
      });
    });
  });
}

export const findSubsections = async () => {
  try {
    const subsectionsResult = prisma.subsection.findMany({});
  } catch (error) {}
};
