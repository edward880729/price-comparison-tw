// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { WatchProduct } from '@prisma/client';
import prisma from '../../lib/prisma'


export default async function getWatchProductList(
  req: NextApiRequest,
  res: NextApiResponse<WatchProduct[]>
): Promise<void> {
  const watchProductList = await prisma.watchProduct.findMany();
  return res.status(200).json(watchProductList);
}
