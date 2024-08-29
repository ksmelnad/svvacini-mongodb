import { Chapter, PrismaClient, Section } from "@prisma/client";

const fs = require("fs");

interface VerseObj {
  id: string;
  book_title: string;
  book_id: string;
  line: string;
  line_id: string;
  section?: Section;
  chapter?: Chapter;
}

// const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const prisma = new PrismaClient();
export async function mapMongoIdsWithVerses() {
  try {
    const verses = await prisma.verse.findMany({
      include: {
        chapter: {
          include: {
            book: true,
          },
        },
      },
    });

    const paragraphs = await prisma.paragraph.findMany({
      include: {
        section: {
          include: {
            chapter: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });

    const textObjs: VerseObj[] = [];

    verses.forEach((verse) => {
      const verseObjectId = verse.id.toString(); // Get the ObjectId as a string

      verse.lines.forEach((line) => {
        let verseObj = {} as VerseObj;
        verseObj.id = verseObjectId;
        verseObj.book_title = verse.chapter?.book.title!;
        verseObj.book_id = verse.chapter?.book.bookId!;
        verseObj.line = line.text;

        textObjs.push(verseObj);
      });
    });

    paragraphs.forEach((paragraph) => {
      const paragraphObjectId = paragraph.id.toString(); // Get the ObjectId as a string

      let paragraphObj = {} as VerseObj;
      paragraphObj.id = paragraphObjectId;
      paragraphObj.book_title = paragraph.section?.chapter?.book.title!;
      paragraphObj.book_id = paragraph.section?.chapter?.book.bookId!;
      paragraphObj.line = paragraph.line.text;

      textObjs.push(paragraphObj);
    });

    // Write the JSON object to a file
    fs.writeFileSync(
      "data/svvacini-mapped.json",
      JSON.stringify(textObjs, null, 2)
    );

    console.log("JSON file created successfully!");
  } catch (err) {
    console.error(err);
  }
}
