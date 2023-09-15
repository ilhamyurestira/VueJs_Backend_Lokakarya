import TransaksiTelkom from "../controllers/TransaksiTelkomController";
import BaseRoutes from "./BaseRouter";

class TransaksiTelkomRoutes extends BaseRoutes {

    public routes(): void {
        this.router.get("/", TransaksiTelkom.index);
        this.router.post("/tambah", TransaksiTelkom.create);
        this.router.get("/:id", TransaksiTelkom.show);
        this.router.put("/:id", TransaksiTelkom.update);
        this.router.delete("/:id", TransaksiTelkom.delete);
    }
}

export default new TransaksiTelkomRoutes().router;