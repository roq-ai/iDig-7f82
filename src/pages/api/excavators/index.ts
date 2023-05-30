import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { excavatorValidationSchema } from 'validationSchema/excavators';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getExcavators();
    case 'POST':
      return createExcavator();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getExcavators() {
    const data = await prisma.excavator.findMany(convertQueryToPrismaUtil(req.query, 'excavator'));
    return res.status(200).json(data);
  }

  async function createExcavator() {
    await excavatorValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.project?.length > 0) {
      const create_project = body.project;
      body.project = {
        create: create_project,
      };
    } else {
      delete body.project;
    }
    const data = await prisma.excavator.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
