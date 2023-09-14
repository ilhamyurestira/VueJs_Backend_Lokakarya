import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class HistoryTransaksiTelponController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const historyTransaksiTelpon = await db.history_telkom.findAll();

            if (historyTransaksiTelpon.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(historyTransaksiTelpon);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const historyTransaksiTelpon = await db.history_telkom.findByPk(id);
            if (!historyTransaksiTelpon) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(historyTransaksiTelpon);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { id_pelanggan, tanggal_bayar, bulan_tagihan, tahun_tagihan, uang } = req.body;

        try {
            const newHistoryTransaksiTelpon = await db.history_telkom.create({
                id_pelanggan,
                tanggal_bayar,
                bulan_tagihan,
                tahun_tagihan,
                uang
            });

            return res.status(200).json(newHistoryTransaksiTelpon);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { id_pelanggan, tanggal_bayar, bulan_tagihan, tahun_tagihan, uang } = req.body;

        try {
            const historyTransaksiTelpon = await db.history_telkom.findByPk(id);
            if (!historyTransaksiTelpon) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            await historyTransaksiTelpon.update({
                id_pelanggan,
                tanggal_bayar,
                bulan_tagihan,
                tahun_tagihan,
                uang
            });

            return res.status(200).json(historyTransaksiTelpon);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal mengubah data history transaksi bank.');
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const historyTransaksiTelpon = await db.history_telkom.findByPk(id);
            if (!historyTransaksiTelpon) {
                return res.status(404).send(`History Transaksi Bank dengan id: ${id} tidak ditemukan.`);
            }

            await historyTransaksiTelpon.destroy();
            return res.status(200).send(`History Transaksi Bank berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data history transaksi bank.');
        }
    }
}

export default new HistoryTransaksiTelponController();
