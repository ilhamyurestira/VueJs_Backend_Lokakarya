import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class HistoryTransaksiBankController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const historyTransaksi = await db.history_transaksi_bank.findAll();

            if (historyTransaksi.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(historyTransaksi);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const historyTransaksi = await db.history_transaksi_bank.findByPk(id);
            if (!historyTransaksi) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(historyTransaksi);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { norek, tanggal, uang, status_ket, norek_dituju, no_tlp, created_at, updated_at } = req.body;

        try {
            const masterBank = await db.master_bank.findOne({ where: { norek } });
            if (!masterBank) {
                return res.status(400).send('Data master bank tidak ditemukan berdasarkan norek');
            }

            const newHistoryTransaksi = await db.history_transaksi_banks.create({
                norek: masterBank.norek, // Gunakan norek dari master_bank
                tanggal,
                uang,
                status_ket,
                norek_dituju,
                no_tlp,
                nama: masterBank.nama, // Ambil nama dari master_bank
                created_at,
                updated_at,
            });

            return res.status(200).json(newHistoryTransaksi);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { norek, tanggal, uang, status_ket, norek_dituju, no_tlp, nama, created_at, updated_at } = req.body;
    
        try {
            const historyTransaksi = await db.history_transaksi_bank.findByPk(id);
            if (!historyTransaksi) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }
    
            await historyTransaksi.update({
                norek,
                tanggal,
                uang,
                status_ket,
                norek_dituju,
                no_tlp,
                nama,
                created_at,
                updated_at,
            });
    
            return res.status(200).json(historyTransaksi);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal mengubah data history transaksi bank.');
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const historyTransaksi = await db.history_transaksi_bank.findByPk(id);
            if (!historyTransaksi) {
                return res.status(404).send(`History Transaksi Bank dengan id: ${id} tidak ditemukan.`);
            }

            await historyTransaksi.destroy();
            return res.status(200).send(`History Transaksi Bank berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data history transaksi bank.');
        }
    }
}

export default new HistoryTransaksiBankController();
