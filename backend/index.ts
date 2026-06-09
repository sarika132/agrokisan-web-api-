import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import { connectToMongoDB } from "./src/database/mongodb";

const PORT = process.env.PORT || 5000;

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`The Server is running on http://localhost:${PORT}`);
});