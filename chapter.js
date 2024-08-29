"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDummyChapter = exports.listChaptersWithVerses = exports.listChapters = exports.updateChapter = exports.deleteChapter = exports.createChapters = exports.createChapter = exports.findChapter = void 0;
const client_1 = require("@prisma/client");
const booksMeta_json_1 = __importDefault(require("./data/booksMeta.json"));
const gita_ch_4_json_1 = __importDefault(require("./data/gita-ch-4.json"));
const prisma = new client_1.PrismaClient();
const existingBooks = [
    "BV_UPG_NY_NYS_NVNYYK_PG_TKS",
    "BV_SH_SS_PS_RV",
    "BV_GN_LVG",
];
async function findChapter() {
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
    }
    catch (error) {
        console.log(error);
    }
}
exports.findChapter = findChapter;
async function createChapter() {
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
exports.createChapter = createChapter;
async function createChapters() {
    // Chapters create many
    Object.values(booksMeta_json_1.default).map(async (item) => {
        if (!existingBooks.includes(item.book.id)) {
            Object.values(item.book.nodes).map(async (ch, index) => {
                const chapWrite = await prisma.chapter.create({
                    data: {
                        title: ch.key,
                        order: index + 1,
                        chapterId: `${item.book.id}_${index + 1}`,
                        audio: ch.audio,
                        book: {
                            connect: {
                                bookId: item.book.id,
                            },
                        },
                    },
                });
                console.log(chapWrite);
            });
        }
        else {
            console.log("Book exists");
        }
    });
}
exports.createChapters = createChapters;
async function deleteChapter() {
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
exports.deleteChapter = deleteChapter;
async function updateChapter() {
    // Update chapter audio
    Object.values(booksMeta_json_1.default).map(async (item) => {
        Object.values(item.book.nodes).map(async (ch, index) => {
            if (ch.audio) {
                const res = await prisma.chapter.update({
                    where: {
                        chapterId: `${item.book.id}_${index + 1}`,
                    },
                    data: {
                        audio: ch.audio,
                    },
                });
                console.log(res);
            }
        });
    });
}
exports.updateChapter = updateChapter;
async function listChapters() {
    const res = await prisma.chapter.findMany({
        include: {
            book: true,
        },
    });
    console.log(res);
}
exports.listChapters = listChapters;
async function listChaptersWithVerses() {
    const res = await prisma.chapter.findMany({
        where: {
            verses: {
                some: {},
            },
        },
    });
    console.log(res);
}
exports.listChaptersWithVerses = listChaptersWithVerses;
async function createDummyChapter() {
    // Chapters create many
    // Object.values(gp).map(async (item) => {
    const chapWrite = await prisma.chapter.create({
        data: {
            title: gita_ch_4_json_1.default.chapter_title,
            order: 4,
            chapterId: `${gita_ch_4_json_1.default.book_id}_4`,
            audio: gita_ch_4_json_1.default.audio,
            book: {
                connect: {
                    bookId: gita_ch_4_json_1.default.book_id,
                },
            },
        },
    });
    console.log(chapWrite);
    // });
}
exports.createDummyChapter = createDummyChapter;
