// Import BayarTelponController
import TransferController from "../controllers/TransferController";
import { Router } from "express";

// Inisialisasi router Express
const TransferRoutes = Router();

// Rute untuk pembayaran telpon
TransferRoutes.post("/transfer", TransferController.transfer);
TransferRoutes.get('/accountInfo/:nomorRekening', TransferController.getAccountInfo);

export default TransferRoutes;
