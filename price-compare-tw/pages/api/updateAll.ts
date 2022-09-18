import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    const watchProductList = await prisma.watchProduct.findMany();
    watchProductList.forEach(async element => {
        await axios.get('http://' + req.headers.host + '/api/updateSearchResult', {
            params: {
                watchProductID: element.watchProductID
            },
        });
    });
    return res.status(200).json("update complete");
}