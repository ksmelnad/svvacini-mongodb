const fs = require("fs");

const jsonString = fs.readFileSync("data/svvacini-mapped.json", "utf-8");
const data = JSON.parse(jsonString);

if (Array.isArray(data)) {
  console.log(data.length);
} else {
  console.log("Data is not an array.");
}
