import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body ?? {};

		if (typeof id !== "string" || id !== req.auth?.userId) {
			return res.status(403).json({ message: "Forbidden - user ID does not match" });
		}

		const fullName = [firstName, lastName]
			.filter((part) => typeof part === "string")
			.join(" ")
			.trim();
		if (!fullName || typeof imageUrl !== "string" || !imageUrl) {
			return res.status(400).json({ message: "Full name and image URL are required" });
		}

		const user = await User.findOne({ clerkId: id });
		if (!user) {
			await User.create({ clerkId: id, fullName, imageUrl });
		}

		res.status(200).json({ success: true });
	} catch (error) {
		next(error);
	}
};
