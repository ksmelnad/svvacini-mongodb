"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentary = void 0;
const client_1 = require("@prisma/client");
const bs_bhashya_json_1 = __importDefault(require("./data/bs-bhashya.json"));
const prisma = new client_1.PrismaClient();
async function createCommentary() {
    const findPara = await prisma.paragraph.findFirst({
        where: {
            id: "66c7505d6e240aa0425a36b3",
        },
    });
    console.log(findPara);
    if (findPara) {
        const commentaryWrite = await prisma.commentary.create({
            data: {
                lines: bs_bhashya_json_1.default[0],
                paragraph: {
                    connect: {
                        id: findPara.id,
                    },
                },
            },
        });
        console.log(commentaryWrite);
    }
}
exports.createCommentary = createCommentary;
