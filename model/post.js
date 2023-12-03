import { Schema, model } from "mongoose";

const postSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
	},
	like: {
		type: [Schema.Types.ObjectId],
		default: [],
	},
	comment: {
		type: [
			{
				content: String,
				createdBy: { type: Schema.Types.ObjectId, ref: "User" },
				createdAt: Date,
			},
		],
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	endpoint: {
		type: String,
		required: true,
		unique: true,
	},
});

export default model("Post", postSchema);
