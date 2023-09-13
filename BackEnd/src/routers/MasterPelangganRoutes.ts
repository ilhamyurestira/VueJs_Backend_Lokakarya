import MasterPelanggan from "../controllers/MasterPelangganController";
import BaseRoutes from "./BaseRouter";

class MasterPelangganRoutes extends BaseRoutes {

    public routes(): void {
        this.router.get("/", MasterPelanggan.index);
        this.router.post("/", MasterPelanggan.create);
        this.router.get("/:id", MasterPelanggan.show);
        this.router.put("/:id", MasterPelanggan.update);
        this.router.delete("/:id", MasterPelanggan.delete);
    }
}

export default new MasterPelangganRoutes().router;