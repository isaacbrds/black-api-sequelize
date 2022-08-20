import {Request, Response} from 'express'
import {Job} from '../models'

export const jobsController = {
  index: async (req: Request, res: Response) => {
    try {
      const jobs = await Job.findAll( { include: 'company'})
      return res.status(200).json(jobs)
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },

  save: async(req: Request, res: Response) => {
    const { title, description, limitDate, companyId} = req.body
    try {
      const job = await Job.create({
        title,
        description,
        limitDate,
        companyId
      })

      res.status(201).json(job)
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },

  show:  async (req: Request, res: Response) => {
    const {id} = req.params
    try {
      const job = await Job.findByPk(id, {include: [ 'company', 'candidates'] })
      res.status(200).json(job)
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },
  
  update:  async (req: Request, res: Response) => {
    const {id} = req.params
    const { title, description, limitDate, companyId} = req.body
    try {
      const [affectedRows, jobs ] = await Job.update({
        title, 
        description, 
        limitDate, 
        companyId
      }, { 
          where: {id},
          returning: true
      })
      res.status(200).json(jobs[0])
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },

  delete:  async (req: Request, res: Response) => {
    const {id} = req.params
    try {
      await Job.destroy({where: {id}})
      res.status(204).send()
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },

  addCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const {candidateId} = req.body
    try {
      const job = await Job.findByPk(jobId)
      if (job === null) {
        return res.status(404).json({message: 'Vaga não encontrda'})
      }

      await job.addCandidate(candidateId)
      return res.status(201).send()
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  },

  removeCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const {candidateId} = req.body
    try {
      const job = await Job.findByPk(jobId)
      if (job === null) {
        return res.status(404).json({message: 'Vaga não encontrda'})
      }

      await job.removeCandidate(candidateId)
      return res.status(204).send()
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message })
      }
    }
  }
}