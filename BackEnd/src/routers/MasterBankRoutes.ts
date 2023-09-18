import MasterBankController from "../controllers/MasterBankController";
import BaseRoutes from "./BaseRouter";

class MasterBankRoutes extends BaseRoutes {

    public routes(): void {
        this.router.post("/", MasterBankController.index);
        this.router.post("/tambah", MasterBankController.create);
        this.router.get("/:id", MasterBankController.show);
        this.router.put("/:id", MasterBankController.update);
        this.router.delete("/hapus/:id", MasterBankController.delete);
    }
}

export default new MasterBankRoutes().router;