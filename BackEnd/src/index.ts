import express, { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { config as dotenv } from 'dotenv';

//Router
import UserRoutes from './routers/UserRoutes';
import AuthRoutes from './routers/AuthRoutes';
import TodoRoutes from './routers/TodoRoutes';
import RoleRoutes from './routers/RoleRoutes';
import NasabahRouter from './routers/NasabahRouter';
import BayarTelponRoutes from './routers/BayarTelponRoutes';
import TransferRoutes from './routers/TransferRoutes';
import MasterBankRoutes from './routers/MasterBankRoutes';
import HakAksesRoutes from './routers/HakAksesRoutes';
import MenuRoutes from './routers/MenuRoutes';
import MasterPelangganRoutes from './routers/MasterPelangganRoutes';
import TransaksiTelkomRoutes from './routers/TransaksiTelkomRoutes';
import HistoryTransaksiTelponRoutes from './routers/HistoryTransaksiTelponRoutes';
import HistoryTransaksiBankRoutes from './routers/HistoryTransaksiBankRoutes';
import TransaksiNasabahRoutes from './routers/TransaksiNasabahRoutes';
import RoleMenuRoutes from './routers/RoleMenuRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
    dotenv();
  }

  protected plugins(): void {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  protected routes(): void {
    this.app.route('/').get((req, res) => {
      res.send('ini route menggunakan TypeScript');
    });

    this.app.route('/users').post((req, res) => {
      res.send(req.body);
    });

    this.app.use('/api/v1/auth', AuthRoutes);
    this.app.use('/api/v1/todos', TodoRoutes);
    this.app.use('/api/v1/nasabah', NasabahRouter);
    this.app.use('/api/v1/nasabah', BayarTelponRoutes);
    this.app.use('/api/v1/nasabah', TransferRoutes);
    this.app.use('/api/v1/historyBank', HistoryTransaksiBankRoutes);
    this.app.use('/api/v1/transaksiNasabah', TransaksiNasabahRoutes);
    this.app.use('/api/v1/masterBank', MasterBankRoutes);
    this.app.use('/api/v1/admin/manage/users', UserRoutes);
    this.app.use('/api/v1/admin/manage/roles', RoleRoutes);
    this.app.use('/api/v1/admin/manage/menus', MenuRoutes);
    this.app.use('/api/v1/admin/manage/hakAkses', HakAksesRoutes);
    this.app.use('/api/v1/masterPelanggan', MasterPelangganRoutes);
    this.app.use('/api/v1/transaksiTelkom', TransaksiTelkomRoutes);
    this.app.use('/api/v1/historyTransaksiTelpon', HistoryTransaksiTelponRoutes);
    this.app.use('/api/v1/admin/manage/roleMenu', RoleMenuRoutes);
  }
}

const port: number = 8000;
const app = new App().app;
app.listen(port, () => {
  console.log('Aplikasi ini berjalan di port ' + port);

  console.log(process.env.DB_USER);
});
