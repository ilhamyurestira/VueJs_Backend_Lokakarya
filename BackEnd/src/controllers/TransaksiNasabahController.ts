import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class TransaksiNasabahController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const transaksiNasabahs = await db.transaksi_nasabah.findAll();

            if (transaksiNasabahs.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(transaksiNasabahs);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const transaksiNasabah = await db.transaksi_nasabah.findByPk(id);
            if (!transaksiNasabah) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(transaksiNasabah);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { norek, tanggal, status, uang, status_ket, norek_dituju, no_tlp, created_at, updated_at } = req.body;

        try {
            const newTransaksiNasabah = await db.transaksi_nasabah.create({
                norek,
                tanggal,
                status,
                uang,
                status_ket,
                norek_dituju,
                no_tlp,
                created_at,
                updated_at,
            });

            return res.status(200).json(newTransaksiNasabah);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { norek, tanggal, status, uang, status_ket, norek_dituju, no_tlp, created_at, updated_at } = req.body;

        try {
            const transaksiNasabah = await db.transaksi_nasabah.findByPk(id);
            if (!transaksiNasabah) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            await transaksiNasabah.update({
                norek,
                tanggal,
                status,
                uang,
                status_ket,
                norek_dituju,
                no_tlp,
                created_at,
                updated_at,
            });

            return res.status(200).json(transaksiNasabah);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal mengubah data transaksi nasabah.');
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const transaksiNasabah = await db.transaksi_nasabah.findByPk(id);
            if (!transaksiNasabah) {
                return res.status(404).send(`Transaksi Nasabah dengan id: ${id} tidak ditemukan.`);
            }

            await transaksiNasabah.destroy();
            return res.status(200).send(`Transaksi Nasabah berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data transaksi nasabah.');
        }
    }
}

export default new TransaksiNasabahController();
