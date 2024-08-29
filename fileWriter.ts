// write to json file
import * as fs from "fs";
export async function writeToFile() {
  const bookRes = {};
  try {
    await fs.promises.writeFile(
      "./data/book.json",
      JSON.stringify(bookRes, null, 2)
    );
  } catch (err) {
    console.log(err);
  }
}
