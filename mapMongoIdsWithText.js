"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMongoIdsWithVerses = void 0;
const client_1 = require("@prisma/client");
const fs = require("fs");
// const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const prisma = new client_1.PrismaClient();
async function mapMongoIdsWithVerses() {
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
        const textObjs = [];
        verses.forEach((verse) => {
            const verseObjectId = verse.id.toString(); // Get the ObjectId as a string
            verse.lines.forEach((line) => {
                var _a, _b;
                let verseObj = {};
                verseObj.id = verseObjectId;
                verseObj.book_title = (_a = verse.chapter) === null || _a === void 0 ? void 0 : _a.book.title;
                verseObj.book_id = (_b = verse.chapter) === null || _b === void 0 ? void 0 : _b.book.bookId;
                verseObj.line = line.text;
                textObjs.push(verseObj);
            });
        });
        paragraphs.forEach((paragraph) => {
            var _a, _b, _c, _d;
            const paragraphObjectId = paragraph.id.toString(); // Get the ObjectId as a string
            let paragraphObj = {};
            paragraphObj.id = paragraphObjectId;
            paragraphObj.book_title = (_b = (_a = paragraph.section) === null || _a === void 0 ? void 0 : _a.chapter) === null || _b === void 0 ? void 0 : _b.book.title;
            paragraphObj.book_id = (_d = (_c = paragraph.section) === null || _c === void 0 ? void 0 : _c.chapter) === null || _d === void 0 ? void 0 : _d.book.bookId;
            paragraphObj.line = paragraph.line.text;
            textObjs.push(paragraphObj);
        });
        // Write the JSON object to a file
        fs.writeFileSync("data/svvacini-mapped.json", JSON.stringify(textObjs, null, 2));
        console.log("JSON file created successfully!");
    }
    catch (err) {
        console.error(err);
    }
}
exports.mapMongoIdsWithVerses = mapMongoIdsWithVerses;
