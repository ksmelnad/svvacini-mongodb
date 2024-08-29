"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBook = exports.createBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createBook() {
    // BOOK CREATE
    const res = await prisma.book.create({
        data: {
            bookId: "BV_UPG_MIM_UMIM_AV_MG_BG",
            title: "भगवद्गीता",
            author: "व्यासः",
        },
    });
    console.log(res);
    // Create books from const books if not exists
    // Object.values(booksJson).map(async (item) => {
    //   const bookExists = await prisma.book.findFirst({
    //     where: {
    //       bookId: item.book_id,
    //     },
    //   });
    //   if (!bookExists) {
    //     const res = await prisma.book.create({
    //       data: {
    //         bookId: item.book_id,
    //         title: item.book,
    //         author: item.author!,
    //       },
    //     });
    //     console.log(res);
    //   }
    // });
}
exports.createBook = createBook;
async function readBook() {
    // const book = books.find((item) => item.sktextsdata.id === "BV_GN_LVG");
    // BOOK READ
    const bookRes = await prisma.book.findFirst({
        where: {
            bookId: "BV_SH_SS_PS_RV",
        },
        include: {
            chapters: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    paragraphs: {
                        orderBy: {
                            order: "asc",
                        },
                    },
                    sections: {
                        orderBy: {
                            order: "asc",
                        },
                        include: {
                            paragraphs: {
                                orderBy: {
                                    order: "asc",
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    console.log(bookRes);
}
exports.readBook = readBook;
