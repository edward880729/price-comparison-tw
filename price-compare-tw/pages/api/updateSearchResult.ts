import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    let { watchProductID } = req.query;
    const watchProduct = await prisma.watchProduct.findFirstOrThrow({
        where: {
            watchProductID: Number(watchProductID),
        }
    })
    if (watchProduct != null) {
        console.log(watchProduct.keyword)
        const response = await axios.get('http://' + req.headers.host + '/api/search', {
            params: {
                website: watchProduct.website,
                keyword: watchProduct.keyword,
                minPrice: watchProduct.minPrice,
                maxPrice: watchProduct.maxPrice,
                isSave: true,
            },
        });
        return res.status(response.status).json("");
    }
}
