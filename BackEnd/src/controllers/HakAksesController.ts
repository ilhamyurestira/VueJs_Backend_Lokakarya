'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const dm = require('../db/models/').hak_akses;
const role = db.role;
const user = db.user;

class HakAksesController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const hakAksesList = await dm.findAll({
        attributes: {
          exclude: ['programName'],
        },
        //ambil referensi data dari data model role dan user
        include: [
          { model: role, attributes: ['nama'] },
          { model: user, attributes: ['username'] },
        ],
      });

      if (hakAksesList.length === 0) {
        return res.status(404).send('Belum ada data');
      } else {
        return res.status(200).json(hakAksesList);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan');
    }
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id, {
        exclude: ['programName'],
        include: [
          { model: role, attributes: ['nama'] },
          { model: user, attributes: ['username'] },
        ],
      });
      if (!data) {
        return res.status(404).send(`Data dengan id: ${id} tidak ditemukan`);
      } else {
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan');
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { userId, roleId, programName, createdBy } = req.body;

    try {
      if (!userId) {
        return res.status(400).send('user belum diisi');
      } else if (!roleId) {
        return res.status(400).send('role belum diisi');
      } else {
        const existingUserRole = await dm.findOne({
          where: { userId, roleId },
        });
        if (existingUserRole) {
          return res
            .status(400)
            .send('user yang sama dengan role yang sama telah ada');
        } else {
          const newData = await dm.create({
            userId,
            roleId,
            programName,
            createdBy,
          });
          return res.status(201).send(`Hak akses telah berhasil dibuat`);
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('pendaftaran hak akses gagal');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, roleId, programName, updatedBy } = req.body;

    try {
      if (!userId) {
        return res.status(400).send('user belum diisi');
      } else if (!roleId) {
        return res.status(400).send('role belum diisi');
      } else {
        const data = await dm.findByPk(id);
        if (!data) {
          return res.status(404).send(`Data dengan id: ${id} tidak ditemukan.`);
        }

        const current = data.nama;
        await data.update({
          userId,
          roleId,
          programName,
          updatedBy,
        });
        return res.status(200).send(`Menu "${current}" telah berhasil diubah.`);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Gagal mengubah menu.`);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(404).send(`Menu dengan id: ${id} tidak ditemukan.`);
      }

      const current = data.nama;
      await data.destroy();
      return res.status(200).send(`Menu "${current}" berhasil dihapus.`);
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Gagal menghapus menu.`);
    }
  };
}

export default new HakAksesController();
