import { Router } from 'express';
import NasabahController from '../controllers/NasabahController'; 
import BaseRoutes from "./BaseRouter";

class NasabahRoutes extends BaseRoutes {

    public routes(): void {
        this.router.get("/allData/:norek", NasabahController.getNasabah);
        this.router.get("/cekSaldo", NasabahController.getSaldo);
        this.router.post("/tambah", NasabahController.tambahSaldo);
        this.router.post("/tarik", NasabahController.tarikSaldo);
    }
}

export default new NasabahRoutes().router;

