// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import { WatchProduct } from '../../../classes/WatchProduct';

const prisma = new PrismaClient()

export default async function disableWatchProduct(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    const { watchProductID } = req.query;
    let watchProduct = new WatchProduct(Number(watchProductID))
    watchProduct.delete();
    return res.status(200).json("");
}