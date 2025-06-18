import medicineModel from "../models/medicineModel.js";
import fs from "fs";


// add medicine item 

export const addMedicine = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const medicine = new medicineModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    });
    try {
        await medicine.save();
        res.json ({ success: true, message: "Medicine added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding medicine" });
}
}

// All medicines list

export const listMedicine = async (req, res) => {
   
    try {
        const medicines = await medicineModel.find({});
        res.json({ success: true, data:medicines });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching medicines" });
    }
}

// remove medicine item

export const removeMedicine = async (req, res) => {
    try {
        const medicine = await medicineModel.findById(req.body.id);
        fs.unlink(`uploads/${medicine.image}`, () => {})
        await medicineModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Medicine removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing medicine" });
    }
}


export default { addMedicine, listMedicine, removeMedicine };
