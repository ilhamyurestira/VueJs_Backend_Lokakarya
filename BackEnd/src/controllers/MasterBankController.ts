import { Request, Response } from "express";
import IController from "./Controller_Interface";
const db = require('../db/models/');

class MasterBankController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const masterBanks = await db.master_bank.findAll();

            if (masterBanks.length === 0) {
                return res.status(200).send('Belum ada data.');
            }

            return res.status(200).json(masterBanks);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const masterBank = await db.master_banks.findByPk(id);
            if (!masterBank) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
            } else {
                return res.status(200).json(masterBank);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data tidak ditemukan');
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { userId, norek, saldo, created_at, updated_at } = req.body;

        try {
            const existingMasterBank = await db.master_bank.findOne({ where: { norek } });
            if (existingMasterBank) {
                return res.status(400).send('Nomor rekening sudah terdaftar');
            }

            if (!norek) {
                return res.status(400).send('Nomor rekening perlu diisi');
            }

            const user = await db.user.findByPk(userId);

            if (!user) {
                return res.status(400).send(`User dengan id: ${userId} tidak ditemukan`);
            }

            const newMasterBank = await db.master_bank.create({
                userId: user.id,
                nama: user.nama, // Ambil nama dari user
                alamat: user.alamat, // Ambil alamat dari user
                noTlp: user.telp, // Ambil noTlp dari user
                norek,
                saldo,
                created_at,
                updated_at,
            });

            return res.status(200).send(`Master Bank "${newMasterBank.nama}" berhasil ditambah`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Data gagal ditambahkan');
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId, nama, alamat, norek, noTlp, saldo, created_at, updated_at } = req.body;

        try {
            const masterBank = await db.master_banks.findByPk(id);
            if (!masterBank) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = masterBank.nama;
            await masterBank.update({
                userId,
                nama,
                alamat,
                norek,
                noTlp,
                saldo,
                created_at,
                updated_at,
            });

            return res.status(200).send(`Master Bank "${currentNama}" berhasil diubah.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal mengubah data master bank.');
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const masterBank = await db.master_banks.findByPk(id);
            if (!masterBank) {
                return res.status(404).send(`Master Bank dengan id: ${id} tidak ditemukan.`);
            }

            const currentNama = masterBank.nama;
            await masterBank.destroy();
            return res.status(200).send(`Master Bank "${currentNama}" berhasil dihapus.`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menghapus data master bank.');
        }
    }

}
export default new MasterBankController();