'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');

class RoleController implements IController{
      index = async (req: Request, res: Response): Promise<Response> => {
            try{
                  const roleList = await db.role.findAll();

                  if (roleList.length === 0){
                        return res.status(200).json(roleList)
                  }
                  else{
                        return res.status(200).send('Belum ada data')
                  }
            }
            catch (err){
                  console.error(err);
                  return res.status(500).send('Data tidak ditemukan')
            }
      }

      show = async (req: Request, res: Response): Promise<Response> => {
            const { id } = req.params;

            try{
                  const data = await db.role.findByPk(id);
                  if(!data){
                        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan`);
                  }
                  else{
                        return res.status(400).json(data);
                  }
            }
            catch (err){
                  console.error(err);
                  return res.status(500).send('Data tidak ditemukan')
            }
      }

      create = async (req: Request, res: Response): Promise<Response> => {
            const { nama, programName, createdBy } = req.body;

            try{
                  const existingName = await db.role.findOne({where: {nama}});
                  if(existingName){
                        return res.status(500).send('Role dengan nama yang sama sudah terdaftar.');
                  }
                  else{
                        const newData = await db.role.create({
                              nama,
                              programName,
                              createdBy
                        });
                        return res.status(500).send(`Role "${nama}" telah berhasil ditambahkan.`);
                  }
            }
            catch(err){
                  return res.status(500).send('Role gagal ditambahkan.');
            }
      }

      update = async (req: Request, res: Response): Promise<Response> => {
            const { id } = req.params;
            const { nama, updatedBy } = req.body;

            try{
                  const data = await db.role.findByPk(id);
                  if(!data){
                        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`)
                  }

                  const current = data.nama;
                  await data.update({ nama, updatedBy });
                  return res.status(500).send(`Role "${current}" telah berhasil diubah.`);
            }
            catch(err){
                  return res.status(500).send(`Gagal mengubah role.`)
            }
      }

      delete = async (req: Request, res: Response): Promise<Response> => {
            const { id } = req.params;

            try{
                  const data = await db.role.findByPk(id);
                  if(!data){
                        return res.status(404).send(`Role dengan id: ${id} tidak ditemukan.`);
                  }

                  const current = data.nama;
                  await data.destroy();
                  return res.status(200).send(`Role "${current}" berhasil dihapus.`)
            }
            catch(err){
                  return res.status(200).send(`Gagal menghapus role.`)

            }
      }

}

export default new RoleController();