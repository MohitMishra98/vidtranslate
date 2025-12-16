import mongoose, { mongo } from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Successfully connected");
    });

    connection.on("error", (err) => {
      console.log(
        "mongodb connection error. please make sure mongodb is running" + err
      );
      process.exit(1);
    });
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
  }
}