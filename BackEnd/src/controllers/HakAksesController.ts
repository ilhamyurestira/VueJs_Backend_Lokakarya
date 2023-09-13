'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const dm = require('../db/models/').hak_akses;

class HakAksesController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const hakAksesList = await dm.findAll({
        include: [
          { model: db.user, attributes: ['username'] },
          { model: db.roles, attributes: ['nama'] },
        ],
      });

      if (hakAksesList.length === 0) {
        return res.status(200).send('Belum ada data');
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
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
      } else {
        return res.status(400).json(data);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan');
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { userId, roleId, programName, createdBy } = req.body;

    try {
      const existingUserRole = await dm.findOne({ where: { userId, roleId } });
      if (existingUserRole) {
        return res
          .status(500)
          .send('user yang sama dengan role yang sama telah ada');
      } else {
        const userName = await db.user.findbyPk(userId).username;
        const roleName = await db.role.findByPk(roleId).nama;
        const newData = await dm.create({
          userId,
          roleId,
          programName,
          createdBy,
        });
        return res.status(500).send(`Hak akses telah berhasil dibuat`);
      }
    } catch (err) {
      return res.status(500).send('pendaftaran hak akses gagal');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId, roleId, programName, updatedBy } = req.body;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`);
      }

      const current = data.nama;
      await data.update({
        userId,
        roleId,
        programName,
        updatedBy,
      });
      return res.status(500).send(`Menu "${current}" telah berhasil diubah.`);
    } catch (err) {
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
      return res.status(200).send(`Gagal menghapus menu.`);
    }
  };
}

export default new HakAksesController();
