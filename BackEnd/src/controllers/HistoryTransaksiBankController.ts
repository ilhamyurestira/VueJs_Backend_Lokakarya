import { Request, Response } from "express";
import IController from "./Controller_Interface";
import { Op } from "sequelize";
const db = require('../db/models/');

class HistoryTransaksiBankController implements IController {

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const { page, pageSize, limit, keyword, sortBy } = req.body;
            const currentPage = page || 1;
            const pageSizeValue = pageSize || 10;
            const limitValue = limit || pageSizeValue;
            const offset = (currentPage - 1) * limitValue;
            const whereClause: { [key: string]: any } = {};
    
            if (keyword) {
                // Ubah sesuai dengan model dan kolom yang sesuai untuk history_transaksi_bank
                whereClause.nama_kolom = {
                    [Op.iLike]: `%${keyword}%`
                };
            }
    
            const totalCount = await db.history_transaksi_bank.count({ where: whereClause });
            const totalPages = Math.ceil(totalCount / limitValue);
            const order = sortBy ? [[sortBy, 'ASC']] : [['id', 'ASC']];
    
            const historyTransaksi = await db.history_transaksi_bank.findAll({
                where: whereClause,
                offset,
                limit: limitValue,
                order,
            });
    
            const responseData = {
                data: {
                    list: historyTransaksi,
                    currentPage,
                    totalPages,
                    totalElements: totalCount,
                },
                status: {
                    code: "00",
                    message: "success"
                }
            };
    
            return res.status(200).json(responseData);
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
