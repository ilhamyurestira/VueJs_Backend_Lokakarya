import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class MasterPelangganController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const masterPelanggan = await db.master_pelanggan.findAll();

            if (masterPelanggan.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(masterPelanggan);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const masterPelanggan = await db.master_pelanggan.findByPk(id);
            if (!masterPelanggan) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(masterPelanggan);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { userId, nama, no_telp, alamat } = req.body;

        try {
            const existingMasterPelanggan = await db.master_pelanggan.findOne({ where: { userId } });
            if (existingMasterPelanggan) {
                return res.status(400).send(`Data pelanggan dengan userId: ${userId} sudah ada`);
            }

            let user = await db.user.findByPk(userId);

            if (!user) {
                return res.status(400).send(`Data pelanggan dengan userId: ${userId} belum ada di tabel user`);
            }


            const newMasterPelanggan = await db.master_pelanggan.create({
                userId: userId,
                nama: nama, // Ambil nama dari user
                alamat: alamat, // Ambil alamat dari user
                no_telp: no_telp, // Ambil noTlp dari user
            });

            return res.status(200).send(`Master Pelanggan "${newMasterPelanggan.nama}" berhasil ditambah`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId, nama, no_telp, alamat } = req.body;

        try {
            const masterPelanggan = await db.master_pelanggan.findByPk(id);
            if (!masterPelanggan) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = masterPelanggan.nama;
            await masterPelanggan.update({
                userId,
                nama,
                no_telp,
                alamat,
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
            const masterPelanggan = await db.master_pelanggan.findByPk(id);
            if (!masterPelanggan) {
                return res.status(404).send(`Master Pelangan dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = masterPelanggan.nama;
            await masterPelanggan.destroy();
            return res.status(200).send(`Master Pelangan "${currentNama}" berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data master pelangan.');
        }
    }

}
export default new MasterPelangganController();