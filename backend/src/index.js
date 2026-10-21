import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
