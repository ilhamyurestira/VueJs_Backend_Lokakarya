import { Request, Response } from 'express';
import Authentication from '../utils/Authentication';
const db = require('../db/models');

class AuthController {
  register = async (req: Request, res: Response): Promise<Response> => {
    let { username, password, nama, alamat, email, telp, programName } =
      req.body;
    try {
      if (!username) {
        return res.status(102).send('username belum diisi');
      } else if (!password) {
        return res.status(103).send('password belum diisi');
      } else if (!nama) {
        return res.status(104).send('nama belum diisi');
      } else if (!email) {
        return res.status(105).send('email belum diisi');
      } else if (!telp) {
        return res.status(106).send('nomor telepon belum diisi');
      } else {
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
          programName,
        });
        return res.status(100).send('registrasi sukses !!');
      }
    } catch (err) {
      console.log(err);
      return res.status(101).send('registrasi user gagal');
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    // cari data user by username
    try {
      let { username, password } = req.body;
      if (!username) {
        return res.status(102).send('username belum diisi');
      } else if (!password) {
        return res.status(103).send('password belum diisi');
      } else {
        const user = await db.user.findOne({
          where: { username },
        });

        // check password
        let compare = await Authentication.passwordCompare(
          password,
          user.password
        );

        // generate token
        if (compare) {
          let token = Authentication.generateToken(
            user.id,
            username,
            user.password
          );
          return res.send({
            token,
          });
        }

        return res.send('auth failed');
      }
    } catch (err) {
      console.log(err);
      return res.status(404).send('login error');
    }
  };

  profile = (req: Request, res: Response): Response => {
    return res.send(req.app.locals.credential);
  };
}

export default new AuthController();
