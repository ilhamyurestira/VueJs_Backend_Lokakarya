// Import BayarTelponController
import BayarTelponController from "../controllers/BayarTelponController";
import { Router } from "express";

// Inisialisasi router Express
const BayarTelponRoutes = Router();

// Rute untuk pembayaran telpon
BayarTelponRoutes.post("/bayar-telpon", BayarTelponController.bayarTagihanTelpon);
BayarTelponRoutes.get("/cek-tagihan", BayarTelponController.cekTagihanTelpon);

export default BayarTelponRoutes;
