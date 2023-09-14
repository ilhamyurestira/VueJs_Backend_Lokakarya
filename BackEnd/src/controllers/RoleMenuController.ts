'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');
const dm = require('../db/models/').role_menu;
const Role = require('../db/models').role;
const Menu = require('../db/models').menu;

class RoleController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const roleList = await dm.findAll({
        include: [
          { model: Role, attributes: ['nama'] },
          { model: Menu, attributes: ['nama'] },
        ],
      });

      if (roleList.length === 0) {
        return res.status(200).send('Belum ada data');
      } else {
        return res.status(200).json(roleList);
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
        include: [
          { model: Role, attributes: ['nama'] },
          { model: Menu, attributes: ['nama'] },
        ],
      });
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
    const { roleId, menuId, isActive, programName, createdBy } = req.body;

    try {
      const exists = await dm.findOne({
        where: { roleId, menuId },
      });
      if (exists) {
        return res.status(500).send('Role menu sudah terdaftarkan di role');
      } else {
        const newData = await dm.create({
          roleId,
          menuId,
          isActive,
          programName,
          createdBy,
        });

        return res.status(500).send('Role menu berhasil dibuat');
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Role menu gagal dibuat.');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { roleId, menuId, isActive, programName, updatedBy } = req.body;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res
          .status(400)
          .send(`Role menu dengan id: ${id} tidak ditemukan.`);
      }
      await data.update({ roleId, menuId, isActive, programName, updatedBy });
      // const role = await db.role.findByPk(roleId);
      const menu = await db.menu.findByPk(menuId);
      if (!menu) {
        console.log('tidak menemukan nama menu');
      }
      return res
        .status(500)
        .send(`berhasil mengupdate role menu "${menu.nama}"`);
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Gagal mengubah role menu.`);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res
          .status(404)
          .send(`Role Menu dengan id: ${id} tidak ditemukan.`);
      }

      const current = data.nama;
      await data.destroy();
      return res.status(200).send(`Role "${current}" berhasil dihapus.`);
    } catch (err) {
      return res.status(200).send(`Gagal menghapus role menu.`);
    }
  };
}

export default new RoleController();
