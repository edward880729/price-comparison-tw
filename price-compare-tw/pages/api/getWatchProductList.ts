// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, WatchProduct } from '@prisma/client';

const prisma = new PrismaClient()

export default async function getWatchProductList(
  req: NextApiRequest,
  res: NextApiResponse<WatchProduct[]>
): Promise<void> {
  const watchProductList = await prisma.watchProduct.findMany();
  return res.status(200).json(watchProductList);
}
