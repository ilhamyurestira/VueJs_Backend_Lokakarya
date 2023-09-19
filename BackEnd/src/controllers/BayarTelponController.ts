'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank, transaksi_nasabah, history_transaksi_bank, master_pelanggan_telpon, transaksi_telkom, history_telkom } = require('../db/models/master_bank');

class BayarTelponController implements IController {
  cekTagihanTelpon = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, noTelp } = req.query;

    try {
      // Validasi input
      if (!nomorRekening || !noTelp) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Dapatkan data pemilik rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      // Dapatkan data pelanggan telpon
      const dataPelanggan = await db.master_pelanggan.findOne({
        where: { no_telp: noTelp },
      });

      if (!dataPelanggan) {
        return res.status(404).send('Nomor pelanggan telpon tidak ditemukan.');
      }

      // Dapatkan data transaksi telpon yang belum dibayar (status 1)
      const transaksiBelumDibayar = await db.transaksi_telkom.findOne({
        where: {
          id_pelanggan: dataPelanggan.id,
          status: 1, // 1 adalah status belum dibayar
        },
      });

      if (!transaksiBelumDibayar) {
        return res.status(404).json({ message: 'Tidak ada tagihan telpon yang harus dibayar.', tagihan: 0 });
      }

      return res.status(200).json({
        message: 'Tagihan telpon ditemukan.',
        tagihan: transaksiBelumDibayar.uang,
        nomorRekening: nomorRekening,
        namaPemilikRekening: pemilikRekening.nama,
        saldoPemilikRekening: pemilikRekening.saldo,
        noTelp: pemilikRekening.noTlp
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat memeriksa tagihan.');
    }
  };

  bayarTagihanTelpon = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, noTelp } = req.body;

    try {
      // Validasi input
      if (!nomorRekening || !noTelp) {
        return res.status(400).send('Data yang diperlukan tidak lengkap.');
      }

      // Dapatkan data pemilik rekening
      const pemilikRekening = await db.master_bank.findOne({
        where: { norek: nomorRekening },
      });

      if (!pemilikRekening) {
        return res.status(404).send('Nomor rekening tidak ditemukan.');
      }

      // Dapatkan data pelanggan telpon
      const dataPelanggan = await db.master_pelanggan.findOne({
        where: { no_telp: noTelp },
      });

      if (!dataPelanggan) {
        return res.status(404).send('Nomor pelanggan telpon tidak ditemukan.');
      }

      // Dapatkan data transaksi telpon yang belum dibayar (status 1)
      const transaksiBelumDibayar = await db.transaksi_telkom.findOne({
        where: {
          id_pelanggan: dataPelanggan.id,
          status: 1, // 1 adalah status belum dibayar
        },
      });

      if (!transaksiBelumDibayar) {
        return res.status(404).send('Tidak ada tagihan telpon yang harus dibayar.');
      }

      // Periksa apakah saldo pemilik rekening cukup
      if (pemilikRekening.saldo < transaksiBelumDibayar.uang) {
        return res.status(400).send('Saldo tidak cukup.');
      }

      if (pemilikRekening.saldo - transaksiBelumDibayar.uang < 50000) {
        return res.status(400).send('Saldo tidak boleh kurang dari Rp 50.000.')
      }

      // Lakukan pembayaran
      pemilikRekening.saldo -= transaksiBelumDibayar.uang;

      // Simpan perubahan saldo pemilik rekening
      await pemilikRekening.save();

      // Ubah status transaksi telpon menjadi 2 (sudah dibayar)
      transaksiBelumDibayar.status = 2; // 2 adalah status sudah dibayar
      await transaksiBelumDibayar.save();

      // Update tabel master pelanggan
      dataPelanggan.saldo -= transaksiBelumDibayar.uang; // Mengurangkan saldo pelanggan
      await dataPelanggan.save();

      // Simpan transaksi nasabah
      const tanggalTransaksi = new Date();
      await db.transaksi_nasabah.create({
        norek: pemilikRekening.norek,
        tanggal: tanggalTransaksi,
        status: 'K',
        uang: transaksiBelumDibayar.uang,
        status_ket: 4,
        norek_dituju: dataPelanggan.id.toString(),
        no_tlp: dataPelanggan.no_tlp,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      // Simpan history transaksi bank
      await db.history_transaksi_bank.create({
        norek: pemilikRekening.norek,
        tanggal: tanggalTransaksi,
        uang: transaksiBelumDibayar.uang,
        status_ket: 4,
        norek_dituju: dataPelanggan.id.toString(),
        no_tlp: dataPelanggan.no_tlp,
        nama: pemilikRekening.nama,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      // Simpan history transaksi telkom
      await db.history_telkom.create({
        id_pelanggan: dataPelanggan.id,
        tanggal_bayar: tanggalTransaksi,
        bulan_tagihan: transaksiBelumDibayar.bulan_tagihan,
        tahun_tagihan: transaksiBelumDibayar.tahun_tagihan,
        uang: transaksiBelumDibayar.uang,
      });

      // Kirim respons JSON ke frontend
      return res.status(200).json({
        nomorRekening: nomorRekening,
        namaPemilikRekening: pemilikRekening.nama,
        nomorTelpon: dataPelanggan.no_tlp,
        tagihanTelpon: transaksiBelumDibayar.uang,
        saldoPemilikRekening: pemilikRekening.saldo,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat melakukan pembayaran.');
    }
  };

  getAccountInfo = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, noTlp } = req.params; // Ambil nomor rekening dari parameter URL

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

export default new BayarTelponController();