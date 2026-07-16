import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`The Server is running on http://localhost:${PORT}`);
});



