import { readFileSync, writeFileSync } from "fs";

interface Word {
  begin: string;
  end: string;
  id: string;
  word: string;
}

interface DataItem {
  words: Word[];
  line: string;
}
import data from "./data/brahmasutrani.json";

export async function mapBrahmasutraAdhikaranas() {
  //   const data: DataItem[] = JSON.parse(
  //     readFileSync("/data/brahmasutrani.json", "utf-8")
  //   );

  const result: DataItem[] = [];

  let currentChapter = 1;
  let currentSection = 1;
  let currentSubsection = 1;
  let currentSutra = 1;

  data.forEach((item) => {
    const parts = item.line.split("_");
    const [chapter, section, subsection] = parts[0].split("-").map(Number);
    const [_, cid] = parts[1].split(":").map(Number);

    // Check if we need to move to the next chapter
    if (chapter > currentChapter) {
      currentChapter = chapter;
      currentSection = 1;
      currentSubsection = 1;
      currentSutra = 1;
    }

    // Check if we need to move to the next section
    if (section > currentSection) {
      currentSection = section;
      currentSubsection = 1;
      currentSutra = 1;
    }

    // Check if we need to move to the next subsection
    if (subsection > currentSubsection) {
      currentSubsection = subsection;
      currentSutra = 1;
    }

    // Update the line with the new section, subsection, and sutra numbers
    const newLine = `SC1:${currentChapter}:${currentSection}-SC${currentChapter}:${currentSection}-${currentChapter}:${currentSubsection}_PCID:0_CID:${currentSutra}`;

    // Add the updated item to the result array
    result.push({ ...item, line: newLine });

    // Increment the sutra number
    currentSutra++;
  });

  // Write the new JSON data to a file
  writeFileSync(
    "./data/new-brahmasutrani.json",
    JSON.stringify(result, null, 2),
    "utf-8"
  );

  console.log("JSON data updated successfully!");
}
