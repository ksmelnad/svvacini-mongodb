"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const paragraph_verse_1 = require("./paragraph-verse");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        (0, paragraph_verse_1.findParagraphs)();
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
