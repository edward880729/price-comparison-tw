import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    const watchProductList = await prisma.watchProduct.findMany();
    watchProductList.forEach(element => {
        async () => {
            const response = await axios.get('/api/update', {
                params: {
                    watchProductID: element.watchProductID
                },
            });
            console.log(response);
        }
    });
    console.log("update complete");
    return res.status(200).json("update complete");
}