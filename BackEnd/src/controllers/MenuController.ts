'use strict';
import { Request, Response } from 'express';
import IController from './Controller_Interface';

const db = require('../db/models/');

class MenuController implements IController{
      index = async (req: Request, res: Response): Promise<Response> => {
            try{
                  const roleList = await db.menu.findAll();

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
            const { nama, icon, url, programName, createdBy } = req.body;

            try{
                  const existingName = await db.role.findOne({where: {nama}});
                  if(existingName){
                        return res.status(500).send('Menu dengan nama yang sama sudah terdaftar.');
                  }
                  else{
                        const newData = await db.role.create({
                              nama,
                              icon,
                              url,
                              programName,
                              createdBy
                        });
                        return res.status(500).send(`Menu "${nama}" telah berhasil ditambahkan.`);
                  }
            }
            catch(err){
                  return res.status(500).send('Menu gagal ditambahkan.');
            }
      }

      update = async (req: Request, res: Response): Promise<Response> => {
            const { id } = req.params;
            const { nama, icon, url, updatedBy } = req.body;

            try{
                  const data = await db.role.findByPk(id);
                  if(!data){
                        return res.status(400).send(`Data dengan id: ${id} tidak ditemukan.`)
                  }

                  const current = data.nama;
                  await data.update({ 
                        nama,
                        icon,
                        url,
                        updatedBy 
                  });
                  return res.status(500).send(`Menu "${current}" telah berhasil diubah.`);
            }
            catch(err){
                  return res.status(500).send(`Gagal mengubah menu.`)
            }
      }

      delete = async (req: Request, res: Response): Promise<Response> => {
            const { id } = req.params;

            try{
                  const data = await db.role.findByPk(id);
                  if(!data){
                        return res.status(404).send(`Menu dengan id: ${id} tidak ditemukan.`);
                  }

                  const current = data.nama;
                  await data.destroy();
                  return res.status(200).send(`Menu "${current}" berhasil dihapus.`)
            }
            catch(err){
                  return res.status(200).send(`Gagal menghapus menu.`)

            }
      }

}

export default new MenuController();