import { Request, Response } from 'express';
const db = require('../db/models');

class NasabahController {
  getSaldo = async (req: Request, res: Response): Promise<Response> => {
    const { norek } = req.body;

    console.log('Nilai req.body:', req.body);
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
    // const { jumlah } = req.body;
    console.log('Nilai jumlah:', jumlah);
    try {
      const nasabah = await db.master_bank.findOne({ where: { norek } });

      if (!nasabah) {
        return res.status(404).json({ error: 'Nasabah tidak ditemukan' });
      }

      const updatedSaldo = nasabah.saldo + jumlah;

      // Update saldo nasabah di database
      await db.master_bank.update({ saldo: updatedSaldo }, { where: { norek } });

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
