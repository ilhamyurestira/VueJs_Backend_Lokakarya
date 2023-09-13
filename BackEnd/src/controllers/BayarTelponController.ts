'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank} = require ('../db/models/master_bank')

class BayarTelponController implements IController {
  bayarTelpon = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, nomorTelpon, jumlahPembayaran } = req.body;

    try {
      // Validasi input
      if (!nomorRekening || !nomorTelpon) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Gantilah logika validasi dan pembayaran ini sesuai dengan kebutuhan Anda
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      if (pemilikRekening.saldo < jumlahPembayaran) {
        return res.status(400).send('Saldo tidak cukup.');
      }

      const transaksi = await db.transaksi_telkom.create({
        noTlp: nomorTelpon,
        jumlah_pembayaran: jumlahPembayaran
      });

      // Perbarui saldo pemilik rekening
      pemilikRekening.saldo -= jumlahPembayaran;
      await pemilikRekening.save();

      // Simpan transaksi dan history
      const history = await db.history.create({
        transaksi_id: transaksi.id,
        // Anda bisa menambahkan data history lainnya sesuai kebutuhan
      });

     // Kirim data respons JSON ke frontend
     return res.status(200).json({
        nomorPelanggan: nomorTelpon,
        namaPelanggan: pemilikRekening.nama,
        jumlahPembayaran: jumlahPembayaran,
        saldoPemilikRekening: pemilikRekening.saldo,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat melakukan pembayaran.');
    }
  };

  // Metode-metode berikut ini dapat dibiarkan kosong atau dihapus jika tidak relevan
  index = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    return res.status(404).send('Not Found');
  };
}

export default new BayarTelponController();
