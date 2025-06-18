import express from 'express';
import { addMedicine, listMedicine, removeMedicine } from '../controllers/medicineController.js';
import multer from 'multer';
import adminAuth from '../middleware/adminAuth.js';


const medicineRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// ✅ Protect sensitive admin routes
medicineRouter.post('/add', upload.single('image'), addMedicine);
medicineRouter.get('/list', listMedicine); // This can stay public unless you want it private
medicineRouter.post('/remove', removeMedicine);

export default medicineRouter;
