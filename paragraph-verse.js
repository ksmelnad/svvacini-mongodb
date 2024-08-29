"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSingleChapterVerses = exports.deleteVerses = exports.createVerses = exports.findParagraphs = exports.deleteParagraphs = exports.createParagraphs = void 0;
const client_1 = require("@prisma/client");
const allBooks_json_1 = __importDefault(require("./data/allBooks.json"));
const gita_ch_4_json_1 = __importDefault(require("./data/gita-ch-4.json"));
// import brahmasutrani from "./data/new-brahmasutrani.json";
const prisma = new client_1.PrismaClient();
function findClosestNumber(numbers, target) {
    // Find the index of the highest number that is less than or equal to the target
    let index = numbers.findIndex((num) => num >= target);
    if (index === -1) {
        // If no number is found, return the difference with the last number
        return target - numbers[numbers.length - 1];
    }
    else {
        // Return the difference with the found number
        return target - numbers[index - 1];
    }
}
async function createParagraphs() {
    const adhikaranasPerPada = [
        0, 11, 18, 31, 39, 52, 60, 77, 86, 92, 100, 136, 153, 168, 178, 185, 191,
    ];
    const book = allBooks_json_1.default.find((item) => item.sktextsdata.id === "BV_UPG_MIM_UMIM_AV_MG_BMS");
    try {
        book === null || book === void 0 ? void 0 : book.sktextsdata.content.map(async (item) => {
            // brahmasutrani.map(async (item) => {
            const chRegex = /SC1:(\d+)/;
            const secRegex = /SC2:(\d+)/;
            const subsecRegex = /SC3:(\d+)/;
            const chapterNumberArray = item.line.match(chRegex);
            const sectionNumberArray = item.line.match(secRegex);
            const subSectionNumberArray = item.line.match(subsecRegex);
            const chapterNumber = chapterNumberArray ? chapterNumberArray[1] : null;
            const sectionNumber = sectionNumberArray ? sectionNumberArray[1] : null;
            const subSectionNumber = subSectionNumberArray
                ? subSectionNumberArray[1]
                : null;
            const cidN = Number(getCIDNumber(item.line));
            if (sectionNumber && Number(sectionNumber) === 0) {
                // console.log("inside if block");
                const paraWrite = await prisma.paragraph.create({
                    data: {
                        order: cidN,
                        line: {
                            text: item.words[0].word,
                            begin: item.words[0].begin,
                            end: item.words[0].end,
                        },
                        chapter: {
                            connect: {
                                chapterId: `BV_UPG_MIM_UMIM_AV_MG_BMS_${chapterNumber}`,
                            },
                        },
                    },
                });
                if (paraWrite) {
                    console.log(cidN + " done!\n");
                }
            }
            else if (subSectionNumber && Number(subSectionNumber) === 0) {
                // console.log("inside else block");
                const paraWrite = await prisma.paragraph.create({
                    data: {
                        order: cidN,
                        line: {
                            text: item.words[0].word,
                            begin: item.words[0].begin,
                            end: item.words[0].end,
                        },
                        section: {
                            connect: {
                                sectionId: `BV_UPG_MIM_UMIM_AV_MG_BMS_${chapterNumber}-${sectionNumber}`,
                            },
                        },
                    },
                });
                console.log(cidN + " done!\n");
            }
            else {
                const closestSubsectionNumber = findClosestNumber(adhikaranasPerPada, Number(subSectionNumber));
                console.log("SubsectionId: ", `BV_UPG_MIM_UMIM_AV_MG_BMS_${chapterNumber}-${Number(sectionNumber) % 4 || 4}-${closestSubsectionNumber}`);
                const subsectionId = `BV_UPG_MIM_UMIM_AV_MG_BMS_${chapterNumber}-${Number(sectionNumber) % 4 || 4}-${closestSubsectionNumber}`;
                const findSubsection = await prisma.subsection.findUnique({
                    where: {
                        subsectionId: subsectionId,
                    },
                });
                console.log("Found:", findSubsection);
                if (findSubsection) {
                    const paraWrite = await prisma.paragraph.create({
                        data: {
                            order: cidN,
                            line: {
                                text: item.words[0].word,
                                begin: item.words[0].begin,
                                end: item.words[0].end,
                            },
                            subsection: {
                                connect: {
                                    subsectionId: `BV_UPG_MIM_UMIM_AV_MG_BMS_${chapterNumber}-${Number(sectionNumber) % 4 || 4}-${closestSubsectionNumber}`,
                                },
                            },
                        },
                    });
                    if (paraWrite) {
                        console.log(cidN + " done!\n");
                    }
                }
            }
        });
    }
    catch (error) {
        console.log("Paragraph creation error:", error);
    }
}
exports.createParagraphs = createParagraphs;
async function deleteParagraphs() {
    //   const relatedChapters = await prisma.chapter.findMany({
    //     where: {
    //       bookId: "BV_UPG_NY_NYS_NVNYYK_PG_TKS",
    //     },
    //   });
    const chapterToBeDeleted = await prisma.chapter.findUnique({
        where: {
            chapterId: "BV_UPG_YOG_YS_4",
        },
    });
    console.log(chapterToBeDeleted);
    const deletedParagraphs = await prisma.paragraph.deleteMany({
        where: {
            chapterId: {
                equals: chapterToBeDeleted === null || chapterToBeDeleted === void 0 ? void 0 : chapterToBeDeleted.id,
            },
        },
    });
    console.log(deletedParagraphs);
    //   const deletedParagraphs = await prisma.paragraph.deleteMany({
    //     where: {
    //       chapterId: {
    //         not: null,
    //       },
    //     },
    //   });
    //   console.log(deletedParagraphs);
}
exports.deleteParagraphs = deleteParagraphs;
async function findParagraphs() {
    const paragraphs = await prisma.paragraph.findMany({
        where: {
            id: "66c7505d6e240aa0425a36b3",
        },
        include: {
            commentaries: true,
        },
    });
    console.log(paragraphs);
}
exports.findParagraphs = findParagraphs;
async function createVerses() {
    const existingBooks = [
        "BV_SH_SS_PS_RV",
        "BV_GN_LVG",
        "BV_UPG_NY_NYS_NVNYYK_PG_TKS",
        "BV_UPG_NY_NYS_NVNYYK_PG_TKS_TKSD",
        "BV_UPG_MIM_UMIM_AV_MG_BMS_SB_PCP_VVS",
        "BV_UPG_MIM_UMIM_AV_MG_BMS_SB_PCP",
        "BV_UPG_MIM_UMIM_AV_MG_BMS_SB",
        "BV_UPG_MIM_UMIM_AV_MG_BMS",
    ];
    const versedBooksArray = ["BV_UPG_MIM_UMIM_AV_IG_SVS"];
    //   const otherBooks = books.filter(
    //     (book) => !existingBooks.includes(book.sktextsdata.id)
    //   );
    const versedBooks = allBooks_json_1.default.filter((book) => versedBooksArray.includes(book.sktextsdata.id));
    versedBooks.map(async (book) => {
        book === null || book === void 0 ? void 0 : book.sktextsdata.content.map(async (item) => {
            try {
                const chRegex = /SC1:(\d+)/;
                // const secRegex = /SC2:(\d+)/;
                const chapterNumberArray = item.line.match(chRegex);
                // const sectionNumberArray = item.line.match(secRegex);
                const chapterNumber = chapterNumberArray ? chapterNumberArray[1] : null;
                // const sectionNumber = sectionNumberArray ? sectionNumberArray[1] : null;
                const cidN = Number(getCIDNumber(item.line));
                const tempLines = item.words.map((item) => {
                    return {
                        text: item.word,
                        begin: item.begin,
                        end: item.end,
                    };
                });
                // console.log("inside if block");
                console.log(`${book.sktextsdata.id}_${chapterNumber}`);
                const verseWrite = await prisma.verse.create({
                    data: {
                        order: cidN,
                        lines: tempLines,
                        chapter: {
                            connect: {
                                chapterId: `${book.sktextsdata.id}_${chapterNumber}`,
                            },
                        },
                    },
                });
                if (verseWrite) {
                    console.log(cidN + " done!");
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    });
}
exports.createVerses = createVerses;
const deleteVerses = async () => {
    //   const relatedChapterIds = await prisma.chapter.findMany({
    //     where: {
    //       OR: [{ bookId: "BV_SH_SS_PS_RV" }, { bookId: "BV_GN_LVG" }],
    //     },
    //     select: { id: true },
    //   });
    const relatedBooks = await prisma.book.findMany({
        where: {
            OR: [{ bookId: "BV_SH_SS_PS_RV" }, { bookId: "BV_GN_LVG" }],
        },
    });
    console.log(relatedBooks);
    const oneBook = await prisma.book
        .findFirst({
        where: {
            bookId: "BV_SH_SS_PS_RV",
        },
    })
        .chapters();
    //   const deletedVerses = await prisma.verse.deleteMany({
    //     where: {
    //       chapterId: {
    //         notIn: relatedChapterIds.map((item) => item.id),
    //       },
    //     },
    //   });
    //   console.log(deletedVerses);
};
exports.deleteVerses = deleteVerses;
const getCIDNumber = (line) => {
    const regex = /_CID:(\d+)/; // Matches "CID:" followed by one or more digits
    const match = line.match(regex);
    if (match) {
        const cidNumber = match[1]; // Extracts the CID number from the first capturing group
        // console.log("CID number:", cidNumber); // Output: CID number: 2
        return cidNumber;
    }
    else {
        console.log("CID number not found.");
        return null;
    }
};
async function createSingleChapterVerses() {
    gita_ch_4_json_1.default.content.map(async (item) => {
        try {
            const verseWrite = await prisma.verse.create({
                data: {
                    order: Number(item.order),
                    lines: item.lines,
                    chapter: {
                        connect: {
                            chapterId: `${gita_ch_4_json_1.default.book_id}_4`,
                        },
                    },
                },
            });
            if (verseWrite) {
                console.log(item.order + " done!");
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createSingleChapterVerses = createSingleChapterVerses;
