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
        const { userId, nama, no_telp, alamat } = req.body;

        try {
            const existingTransaksiTelkom = await db.transaksi_telkom.findOne({ where: { userId } });
            if (existingTransaksiTelkom) {
                return res.status(400).send('User ID sudah terdaftar');
            }

            // if (!norek) {
            //     return res.status(400).send('Nomor rekening perlu diisi');
            // }

            const user = await db.user.findByPk(userId);

            if (!user) {
                return res.status(400).send(`User dengan id: ${userId} tidak ditemukan`);
            }

            const newTransaksiTelkom = await db.transaksi_telkom.create({
                userId: user.id,
                nama: user.nama, // Ambil nama dari user
                alamat: user.alamat, // Ambil alamat dari user
                no_telp: user.telp, // Ambil noTlp dari user
            });

            return res.status(200).send(`Master Pelanggan "${newTransaksiTelkom.nama}" berhasil ditambah`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId, nama, alamat, norek, noTlp, saldo, created_at, updated_at } = req.body;

        try {
            const transaksiTelkom = await db.transaksi_telkom.findByPk(id);
            if (!transaksiTelkom) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = transaksiTelkom.nama;
            await transaksiTelkom.update({
                userId,
                nama,
                alamat,
                norek,
                noTlp,
                saldo,
                created_at,
                updated_at,
            });

            return res.status(200).send(`Master Pelanggan "${currentNama}" berhasil diubah.`);
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
                return res.status(404).send(`Master Pelangan dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = transaksiTelkom.nama;
            await transaksiTelkom.destroy();
            return res.status(200).send(`Master Pelangan "${currentNama}" berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data master pelangan.');
        }
    }

}
export default new TransaksiTelkomController();