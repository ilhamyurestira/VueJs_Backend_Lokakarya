import TransaksiNasabahController from "../controllers/TransaksiNasabahController";
import BaseRoutes from "./BaseRouter";

class TransaksiNasabahRoutes extends BaseRoutes {

    public routes(): void {
        this.router.post("/", TransaksiNasabahController.index);
        this.router.post("/tambah", TransaksiNasabahController.create);
        this.router.get("/:id", TransaksiNasabahController.show);
        this.router.put("/:id", TransaksiNasabahController.update);
        this.router.delete("/:id", TransaksiNasabahController.delete);
    }
}

export default new TransaksiNasabahRoutes().router;