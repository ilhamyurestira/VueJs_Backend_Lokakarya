'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank } = require('../db/models/master_bank');

class TransferController implements IController {
  transfer = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, nomorRekeningPenerima, jumlahTransfer } = req.body;

    try {
      // Validasi input
      if (!nomorRekening || !nomorRekeningPenerima || !jumlahTransfer) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Dapatkan data pemilik rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      // Dapatkan data penerima transfer
      const penerimaTransfer = await db.master_bank.findOne({
        where: { norek: nomorRekeningPenerima },
      });

      if (!penerimaTransfer) {
        return res.status(404).send('Nomor rekening penerima tidak ditemukan.');
      }

      // Periksa apakah saldo pemilik rekening cukup
      if (pemilikRekening.saldo < jumlahTransfer) {
        return res.status(400).send('Saldo tidak cukup.');
      }

      // Lakukan transfer
      pemilikRekening.saldo -= jumlahTransfer;
      penerimaTransfer.saldo += jumlahTransfer;

      // Simpan perubahan saldo
      await pemilikRekening.save();
      await penerimaTransfer.save();

      // Simpan transaksi dan history (Anda perlu menyesuaikan ini dengan struktur tabel Anda)
      // ...

      // Kirim respons JSON ke frontend
      return res.status(200).json({
        nomorRekening: nomorRekening,
        namaPemilikRekening: pemilikRekening.nama,
        nomorRekeningPenerima: nomorRekeningPenerima,
        jumlahTransfer: jumlahTransfer,
        namaPemilikPenerima: penerimaTransfer.nama,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat melakukan transfer.');
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

export default new TransferController();
