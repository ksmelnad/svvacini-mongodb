import { PrismaClient } from "@prisma/client";
import books from "./data/allBooks.json";
import booksJson from "./data/books.json";
import booksMeta from "./data/booksMeta.json";

import { createBook, readBook } from "./book";
import {
  createChapters,
  createChapter,
  deleteChapter,
  updateChapter,
  listChapters,
  listChaptersWithVerses,
  createDummyChapter,
  findChapter,
} from "./chapter";
import { createSections } from "./section";
import {
  createParagraphs,
  findParagraphs,
  deleteParagraphs,
  createVerses,
  deleteVerses,
  createSingleChapterVerses,
} from "./paragraph-verse";
import { mapMongoIdsWithVerses } from "./mapMongoIdsWithText";
import { createSubsections } from "./subsection";
import { mapBrahmasutraAdhikaranas } from "./mapBrahmasutraAdhikaranas";
import { createCommentary } from "./commentary";

const prisma = new PrismaClient();

async function main() {
  try {
    createSingleChapterVerses();
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
