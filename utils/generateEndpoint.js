import Post from "../model/post.js";

const getItemEndpint = async (title, i = 0) => {
	const endpoint = title.replace(/ /g, "-");
	try {
		console.log("count", await Post.countDocuments({ endpoint: endpoint + (i ? `-${i}` : "") }));
		if ((await Post.countDocuments({ endpoint: endpoint + (i ? `-${i}` : "") })) > 0) {
			return getItemEndpint(title, i + 1);
		} else {
			return endpoint + (i ? `-${i}` : "");
		}
	} catch (error) {
		console.log(error);
	}
};
export default getItemEndpint;
