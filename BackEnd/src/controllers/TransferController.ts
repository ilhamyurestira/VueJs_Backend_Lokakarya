'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank, transaksi_nasabah, history_transaksi_bank } = require('../db/models/master_bank');

class TransferController implements IController {
  transfer = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekeningPengirim, nomorRekeningPenerima, jumlahTransfer } = req.body;

    try {
      // Validasi input
      if (!nomorRekeningPengirim || !nomorRekeningPenerima || !jumlahTransfer) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Dapatkan data pemilik rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekeningPengirim },
      });


  // Dapatkan data penerima transfer
  const penerimaTransfer = await db.master_bank.findOne({
    where: { norek: nomorRekeningPenerima },
  });


  if (!pemilikRekening) {
    return res.status(404).send('Nomor rekening pengirim tidak ditemukan.');
  }

  if (!penerimaTransfer) {
    return res.status(404).send('Nomor rekening penerima tidak ditemukan.');
  }

//   if (!pemilikRekening && !penerimaTransfer ) {
    // return res.status(404).send('Nomor rekening pengirim dan penerima tidak ditemukan.');
//   }

      // Validasi bahwa nomor rekening pengirim dan penerima tidak sama
      if (nomorRekeningPengirim === nomorRekeningPenerima) {
        return res.status(400).send('Tidak dapat mentransfer ke nomor rekening yang sama.');
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
  

      // Simpan transaksi dan history
      const tanggalTransaksi = new Date();
      const transaksiBaru = await db.transaksi_nasabah.create({
        norek: pemilikRekening.norek,
        tanggal: tanggalTransaksi,
        status: 'K',
        uang: jumlahTransfer,
        status_ket: 3,
        norek_dituju: penerimaTransfer.norek,
        no_tlp: pemilikRekening.no_tlp,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      const historyTransaksiBaru = await db.history_transaksi_bank.create({
        norek: pemilikRekening.norek,
        tanggal: tanggalTransaksi,
        uang: jumlahTransfer,
        status_ket: 3,
        norek_dituju: penerimaTransfer.norek,
        no_tlp: pemilikRekening.no_tlp,
        nama: pemilikRekening.nama,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });


      // Kirim respons JSON ke frontend
      return res.status(200).json({
        nomorRekening: nomorRekeningPengirim,
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
  getAccountInfo = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening } = req.params; // Ambil nomor rekening dari parameter URL

    try {
      // Dapatkan data pemilik rekening berdasarkan nomor rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      // Kirim informasi rekening sebagai respons JSON
      return res.status(200).json({
        nomorRekening: pemilikRekening.norek,
        namaPemilikRekening: pemilikRekening.nama,
        saldo: pemilikRekening.saldo,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat mengambil informasi rekening.');
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
