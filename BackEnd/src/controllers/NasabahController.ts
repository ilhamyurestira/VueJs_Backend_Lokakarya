import { Request, Response } from 'express';
const db = require('../db/models');
const { master_bank, transaksi_nasabah, history_transaksi_bank } = require('../db/models/master_bank')

class NasabahController {

  //get data nasabah by norek 
  getNasabah = async (req: Request, res: Response): Promise<Response> => {
    const { norek } = req.params;

        try {
            const nasabah = await db.master_bank.findOne({where: {norek}});
            if (!nasabah) {
                return res.status(404).send(`nasabah dengan nomor rekening ${norek} tidak ditemukan`);
            }
            return res.status(200).json(nasabah);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
  }
  
  
  //get db jumlah saldo
  getSaldo = async (req: Request, res: Response): Promise<Response> => {
    const { norek } = req.query;

    console.log('Nilai req.query:', req.query);
    console.log('Nilai norek:', norek);

    try {
      const nasabah = await db.master_bank.findOne({ where: { norek } });

      if (!nasabah) {
        return res.status(404).send(`Nasabah dengan nomor rekening: ${norek} tidak ditemukan.`);
      } else {
        return res.status(200).json({ norek: nasabah.norek, nama: nasabah.nama, saldo: nasabah.saldo });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat memeriksa saldo nasabah.');
    }
  }

  // Setor saldo nasabah
  tambahSaldo = async (req: Request, res: Response): Promise<Response> => {
    const { norek, jumlah } = req.body;
    console.log('Nilai jumlah:', jumlah);

    try {
      const nasabah = await db.master_bank.findOne({ where: { norek } });

      if (!nasabah) {
        return res.status(404).json({ error: 'Nasabah tidak ditemukan' });
      }

      const updatedSaldo = nasabah.saldo + jumlah;

      // Update saldo nasabah di database
      await db.master_bank.update({ saldo: updatedSaldo }, { where: { norek } });

      //input history ke tabel transaksi nasabah 
      const tanggalTransaksi = new Date();
      const setorNasabah = await db.transaksi_nasabah.create({
        norek: nasabah.norek,
        tanggal: tanggalTransaksi,
        status: 'D',
        uang: jumlah,
        status_ket: 1,
        norek_dituju: null,
        no_tlp: nasabah.no_tlp,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      //input history ke history transasksi 
      const setorHistory = await db.history_transaksi_bank.create({
        norek: nasabah.norek,
        tanggal: tanggalTransaksi,
        uang: jumlah,
        status_ket: 1,
        norek_dituju: null,
        no_tlp: nasabah.no_tlp,
        nama: null,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      return res.status(200).json({ message: `Saldo ${nasabah.nama} berhasil ditambahkan` });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan saldo nasabah' });
    }
  }

  // Tarik saldo nasabah
  tarikSaldo = async (req: Request, res: Response): Promise<Response> => {
    const { norek, jumlah } = req.body;
    // const { jumlah } = req.body;

    try {
      const nasabah = await db.master_bank.findOne({ where: { norek } });

      if (!nasabah) {
        return res.status(404).send(`Nasabah dengan nomor rekening: ${norek} tidak ditemukan.`);
      }

      if (nasabah.saldo >= jumlah) {
        // Mengurangkan saldo nasabah di database
        nasabah.saldo -= jumlah;
        await nasabah.save();

        //input history ke tabel transaksi nasabah 
      const tanggalTransaksi = new Date();
      const setorNasabah = await db.transaksi_nasabah.create({
        norek: nasabah.norek,
        tanggal: tanggalTransaksi,
        status: 'K',
        uang: jumlah,
        status_ket: 2,
        norek_dituju: null,
        no_tlp: nasabah.no_tlp,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

      //input history ke history transasksi 
      const setorHistory = await db.history_transaksi_bank.create({
        norek: nasabah.norek,
        tanggal: tanggalTransaksi,
        uang: jumlah,
        status_ket: 2,
        norek_dituju: null,
        no_tlp: nasabah.no_tlp,
        nama: null,
        created_at: tanggalTransaksi,
        updated_at: tanggalTransaksi,
      });

        return res.status(200).json({ message: `Saldo ${nasabah.nama} berhasil ditarik` });
      } else {
        return res.status(400).json({ error: 'Saldo tidak mencukupi' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Terjadi kesalahan saat menarik saldo nasabah.');
    }
  }
}

export default new NasabahController();
