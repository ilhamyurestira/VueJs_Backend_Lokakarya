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
            const masterBank = await db.master_bank.findByPk(id);
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
        const { userId, saldo, created_at, updated_at } = req.body;

        try {
            // Generate a random 7-digit account number
            const newAccountNumber = generateRandomAccountNumber();

            if (!newAccountNumber) {
                return res.status(500).send('Gagal menghasilkan nomor rekening baru');
            }

            const user = await db.user.findByPk(userId);

            if (!user) {
                return res.status(400).send(`User dengan id: ${userId} tidak ditemukan`);
            }

            const newMasterBank = await db.master_bank.create({
                userId: user.id,
                nama: user.nama,
                alamat: user.alamat,
                noTlp: user.telp,
                norek: newAccountNumber,
                saldo
            });

            return res.status(200).json(newMasterBank);
            // return res.status(200).send(`Master Bank "${newMasterBank.nama}" telah ditambahkan dengan nomor rekening baru: ${newAccountNumber}`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Gagal menambahkan data master bank');
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId, norek, saldo, nama, alamat, noTlp } = req.body;
    
        try {
            const masterBank = await db.master_bank.findByPk(id);
            if (!masterBank) {
                return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
            }
    
            const user = await db.user.findByPk(userId);
            if (!user) {
                return res.status(400).send(`User dengan id: ${userId} tidak ditemukan.`);
            }
    
            const currentNama = masterBank.nama;
    
            // Update data master_bank, termasuk nama, alamat, dan noTlp dari data user
            await masterBank.update({
                nama,
                alamat,
                noTlp
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
            const masterBank = await db.master_bank.findByPk(id);
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

function generateRandomAccountNumber() {
    // Generate a random 7-digit number
    const min = 1000000;
    const max = 9999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}

export default new MasterBankController();