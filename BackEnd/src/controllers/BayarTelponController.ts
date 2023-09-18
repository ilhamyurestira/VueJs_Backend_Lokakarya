'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const { master_bank, transaksi_nasabah, history_transaksi_bank, master_pelanggan_telpon, transaksi_telkom, history_telkom } = require('../db/models/master_bank');

class BayarTelponController implements IController {
  bayarTelpon = async (req: Request, res: Response): Promise<Response> => {
    const { nomorRekening, nomorPelanggan } = req.body;

    try {
      // Validasi input
      if (!nomorRekening || !nomorPelanggan) {
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
      const dataPelanggan = await db.transaksi_telkom.findOne({
        where: { id_pelanggan: nomorPelanggan },
      });

      if (!dataPelanggan) {
        return res.status(404).send('Nomor pelanggan telpon tidak ditemukan.');
      }

      // Dapatkan data transaksi telpon yang belum dibayar (status 1)
      const transaksiBelumDibayar = await db.transaksi_telkom.findOne({
        where: {
          id_pelanggan: nomorPelanggan,
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

      // Lakukan pembayaran
      pemilikRekening.saldo -= transaksiBelumDibayar.uang;

      // Simpan perubahan saldo pemilik rekening
      await pemilikRekening.save();

      // Ubah status transaksi telpon menjadi 2 (sudah dibayar)
      transaksiBelumDibayar.status = 2; // 2 adalah status sudah dibayar
      await transaksiBelumDibayar.save();

      // Tambahkan saldo rekening telkom
      // const rekeningTelkom = await db.master_bank.findOne({
      //   where: { norek: 'nomor_rekening_telkom' }, // Ganti dengan nomor rekening telkom yang sesuai
      // });

      // if (!rekeningTelkom) {
      //   return res.status(500).send('Nomor rekening telkom tidak ditemukan.');
      // }

      // rekeningTelkom.saldo += transaksiBelumDibayar.uang;
      // await rekeningTelkom.save();

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
        norek_dituju: nomorPelanggan,
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
        norek_dituju: nomorPelanggan,
        no_tlp: dataPelanggan.no_tlp,
        nama: pemilikRekening.nama,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      // Simpan history transaksi telkom
      await db.history_telkom.create({
        id_pelanggan: nomorPelanggan,
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
