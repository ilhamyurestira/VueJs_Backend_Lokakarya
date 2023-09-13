import { Request, Response } from 'express';
import Authentication from '../utils/Authentication';
import IController from './Controller_Interface';

const db = require('../db/models');
const dm = require('../db/models').user;

class UserController implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userList = await dm.findAll({
        attributes: {
          exclude: ['password'],
        },
      });

      if (userList.length === 0) {
        return res.status(200).send('Belum ada data.');
      } else {
        return res.status(200).json(userList);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Data tidak ditemukan.');
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      let {
        username,
        password,
        nama,
        alamat,
        email,
        telp,
        programName,
        createdBy,
      } = req.body;
      const hashedPassword: string = await Authentication.passwordHash(
        password
      );

      await dm.create({
        username,
        password: hashedPassword,
        nama,
        alamat,
        email,
        telp,
        programName,
        createdBy,
      });

      return res.send('registrasi user sukses!');
    } catch (err) {
      return res.status(404).send('registrasi user gagal.');
    }
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id, {
        attributes: { exclude: ['password'] },
      });

      if (!data) {
        return res.status(200).send('user tidak ditemukan.');
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).send('pencarian user gagal.');
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { nama, alamat, email, telp, programName, updatedBy } = req.body;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(304).send('data user tidak ditemukan.');
      }

      const userName = data.username;
      await data.update({
        nama,
        alamat,
        email,
        telp,
        programName,
        updatedBy,
      });
      return res.status(300).send(`update data user "${userName}" sukses.`);
    } catch (err) {
      console.log(err);
      return res.status(300).send('update data gagal.');
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const data = await dm.findByPk(id);
      if (!data) {
        return res.status(404).send('data user tidak ditemukan.');
      }

      const userName = data.username;
      await dm.destroy(data);
      return res
        .status(500)
        .send(`data user "${userName}" telah berhasil dihapus.`);
    } catch (err) {
      return res.status(500).send('gagal menghapus user.');
    }
  };
}
export default new UserController();
