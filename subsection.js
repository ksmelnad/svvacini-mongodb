"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSubsections = exports.createSubsections = void 0;
const booksMeta_json_1 = __importDefault(require("./data/booksMeta.json"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const book = booksMeta_json_1.default.find((item) => item.book.id === "BV_UPG_MIM_UMIM_AV_MG_BMS");
async function createSubsections() {
    // Sections create for Brahmasutra
    Object.values(book === null || book === void 0 ? void 0 : book.book.nodes).map(async (ch, chIndex) => {
        Object.values(ch.nodes).map(async (section, secIndex) => {
            Object.values(section.nodes).map(async (subsection, subsecIndex) => {
                // Check section exists
                const subsecWrite = await prisma.subsection.create({
                    data: {
                        title: subsection.key,
                        order: subsecIndex + 1,
                        subsectionId: `${book === null || book === void 0 ? void 0 : book.book.id}_${chIndex + 1}-${secIndex + 1}-${subsecIndex + 1}`,
                        section: {
                            connect: {
                                sectionId: `${book === null || book === void 0 ? void 0 : book.book.id}_${chIndex + 1}-${secIndex + 1}`,
                            },
                        },
                    },
                });
                console.log(subsecWrite);
            });
        });
    });
}
exports.createSubsections = createSubsections;
const findSubsections = async () => {
    try {
        const subsectionsResult = prisma.subsection.findMany({});
    }
    catch (error) { }
};
exports.findSubsections = findSubsections;
