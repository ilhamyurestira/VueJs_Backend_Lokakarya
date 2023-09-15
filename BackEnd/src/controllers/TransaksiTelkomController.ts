import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class TransaksiTelkomController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const transaksiTelkom = await db.transaksi_telkom.findAll();

            if (transaksiTelkom.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(transaksiTelkom);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const transaksiTelkom = await db.transaksi_telkom.findByPk(id);
            if (!transaksiTelkom) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(transaksiTelkom);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { id_pelanggan, bulan_tagihan, tahun_tagihan, uang, status } = req.body;

        const pelanggan = await db.master_pelanggan.findByPk(id_pelanggan);

        if (!pelanggan) {
            return res.status(400).send(`Data pelanggan dengan userId: ${id_pelanggan} belum ada di tabel Master Pelanggan`);
        }

        try {
            const newTransaksiTelkom = await db.transaksi_telkom.create({
                id_pelanggan: pelanggan.id,
                bulan_tagihan: bulan_tagihan,
                tahun_tagihan: tahun_tagihan,
                uang: uang,
                status: status
            });

            return res.status(200).send(`Transaksi Telpon berhasil ditambah`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { id_pelanggan, bulan_tagihan, tahun_tagihan, uang, status } = req.body;

        try {
            const transaksiTelkom = await db.transaksi_telkom.findByPk(id);
            if (!transaksiTelkom) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = transaksiTelkom.nama;
            await transaksiTelkom.update({
                id_pelanggan,
                bulan_tagihan,
                tahun_tagihan,
                uang,
                status
            });

            return res.status(200).send(`Transaksi Telpon berhasil diubah.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal mengubah data master pelanggan.');
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const transaksiTelkom = await db.transaksi_telkom.findByPk(id);
            if (!transaksiTelkom) {
                return res.status(404).send(`Transaksi Telpon dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = transaksiTelkom.nama;
            await transaksiTelkom.destroy();
            return res.status(200).send(`Transaksi Telpon berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data Transaksi Telpon.');
        }
    }

}
export default new TransaksiTelkomController();