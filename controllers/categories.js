import CategoriesModal from "../models/categoriesModal.js";

export const getAllCategories = async (req, res) => {
	try {
		const categories = await CategoriesModal.find({}).sort({ _id: -1 });
		return res.status(200).json(categories);
	} catch (error) {
		res.status(400).send({ message: error });
	}
};

export const getSingleCategory = async (req, res) => {
	const { id } = req.params;

	try {
		const singleCategory = await CategoriesModal.findById(id);
		res.status(200).json(singleCategory);
	} catch (error) {}
};

export const createCategory = async (req, res) => {
	const body = req.body;

	const newCategory = new CategoriesModal({
		...body,
	});

	try {
		await newCategory.save();
		res.status(201).json(newCategory);
	} catch (error) {
		res.status(409).json({ message: error });
	}
};

export const updateCategory = async (req, res) => {
	const { id: _id } = req.params;
	const body = req.body;

	try {
		if (!Mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send("No Category with that Id");
		}

		const updateCategory = await CategoriesModal.findByIdAndUpdate(_id, ...body);

		res.status(200).json(updateCategory);
	} catch (error) {
		res.status(409).json({ message: error });
	}
};

export const deleteCategory = async (req, res) => {
	const { id: _id } = req.params;

	try {
		if (!Mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send("No Category with that Id");
		}

		await CategoriesModal.findByIdAndDelete(_id);
		res.status(200).send({ message: "Category removed successfully!" });
	} catch (error) {
		res.status(404).json({ message: error });
	}
};
