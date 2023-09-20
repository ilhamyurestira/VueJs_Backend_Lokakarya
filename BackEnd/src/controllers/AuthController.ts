import { Request, Response } from 'express';
import Authentication from '../utils/Authentication';
const db = require('../db/models');

class AuthController {
  register = async (req: Request, res: Response): Promise<Response> => {
    let { username, password, nama, alamat, email, telp } = req.body;
    try {
      if (!username) {
        return res.status(400).send('username belum diisi');
      } else if (!password) {
        return res.status(400).send('password belum diisi');
      } else if (!nama) {
        return res.status(400).send('nama belum diisi');
      } else if (!email) {
        return res.status(400).send('email belum diisi');
      } else if (!telp) {
        return res.status(400).send('nomor telepon belum diisi');
      }

      const hashedPassword: string = await Authentication.passwordHash(
        password
      );

      await db.user.create({
        username,
        password: hashedPassword,
        nama,
        alamat,
        email,
        telp,
        programName: 'System',
        createdBy: 'System',
      });

      console.log('new user registered');
      return res.status(201).send('registrasi sukses !!');
    } catch (err) {
      console.log(err);
      return res.status(500).send('registrasi user gagal');
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    // cari data user by username
    try {
      const { username, password } = req.body;

      if (!username) {
        return res.status(400).send('username belum diisi');
      } else if (!password) {
        return res.status(400).send('password belum diisi');
      } else {
        //check for username in database
        const user = await db.user.findOne({
          where: { username },
        });
        if (user) {
          const compare = await Authentication.passwordCompare(
            password,
            user.password
          );
          if (compare) {
            const token = Authentication.generateToken(
              user.id,
              username,
              user.password
            );
            const hakAkses = await db.hak_akses.findOne({
              where: { userId: user.id },
            });
            console.log(hakAkses);
            const access = {
              token: token,
              roleId: hakAkses.roleId,
              userId: hakAkses.userId,
            };
            console.log(access);
            return res.status(200).json({
              access,
            });
          }
          return res.status(401).send('Authentication failed, Wrong Password');
        } else if (!user) {
          const noRek: number = parseInt(username);
          const nasabah = await db.master_bank.findOne({
            where: { norek: noRek },
          });
          const alternate = await db.user.findOne({
            where: { id: nasabah.userId },
          });
          const compare = await Authentication.passwordCompare(
            password,
            alternate.password
          );
          if (compare) {
            const token = Authentication.generateToken(
              alternate.id,
              username,
              alternate.password
            );
            return res.status(200).send({
              token,
            });
          }
          return res.status(401).send('Authentication failed, Wrong Password');
        } else {
          return res.status(404).send('User not found');
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Login authentication error');
    }
  };

  profile = (req: Request, res: Response): Response => {
    return res.send(req.app.locals.credential);
  };
}

export default new AuthController();
