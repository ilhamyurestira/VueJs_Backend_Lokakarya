import HistoryTransaksiTelponController from "../controllers/HistoryTransaksiTelponController";
import BaseRoutes from "./BaseRouter";

class HistoryTransaksiTelponRoutes extends BaseRoutes {

    public routes(): void {
        this.router.get("/", HistoryTransaksiTelponController.index);
        this.router.post("/", HistoryTransaksiTelponController.create);
        this.router.get("/:id", HistoryTransaksiTelponController.show);
        this.router.put("/:id", HistoryTransaksiTelponController.update);
        this.router.delete("/:id", HistoryTransaksiTelponController.delete);
    }
}

export default new HistoryTransaksiTelponRoutes().router;