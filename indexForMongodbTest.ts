import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const database = client.db("MongoPractice");
    const collection = database.collection("Users");

    // Insert operation
    // const InsertResult = await collection.insertOne({ name: "Bhima", age: 36 });

    // Update operation
    // const updateResult = await collection.updateOne(
    //   { name: "Bhima" },
    //   { $set: { age: 37 } }
    // );
    // console.log(updateResult);

    // Delete operation
    const deleteResult = await collection.deleteOne({ name: "Bhima" });
    console.log(deleteResult);

    // Find operation
    // const findResult = await collection
    //   .find({
    //     name: { $in: ["Keshav", "Arjun"] },
    //   })
    //   .toArray();
    // console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

main();
