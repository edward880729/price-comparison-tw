import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import { WatchProduct } from '../../../classes/WatchProduct';

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    let { watchProductID } = req.query;
    const watchProduct = new WatchProduct(Number(watchProductID));
    if (watchProduct) {
        const update = async () => {
            const response = await axios.get('/api/search', {
                params: {
                    website: watchProduct.website,
                    keyword: watchProduct.keyword,
                    minPrice: watchProduct.minPrice,
                    maxPrice: watchProduct.maxPrice,
                },
            });
            return res.status(response.status).json("");
        }
    }
}
