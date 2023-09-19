import HistoryTransaksiBankController from "../controllers/HistoryTransaksiBankController";
import BaseRoutes from "./BaseRouter";

class HistoryTransaksiBankRoutes extends BaseRoutes {

    public routes(): void {
        this.router.post("/", HistoryTransaksiBankController.index);
        this.router.post("/tambah", HistoryTransaksiBankController.create);
        this.router.get("/:id", HistoryTransaksiBankController.show);
        this.router.put("/:id", HistoryTransaksiBankController.update);
        this.router.delete("/:id", HistoryTransaksiBankController.delete);
    }
}

export default new HistoryTransaksiBankRoutes().router;