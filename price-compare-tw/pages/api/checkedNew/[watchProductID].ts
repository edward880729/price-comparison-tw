// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { WatchProduct } from '../../../classes/WatchProduct';

export default async function disableWatchProduct(
    req: NextApiRequest,
    res: NextApiResponse<string>
): Promise<void> {
    const { watchProductID } = req.query;
    let watchProduct = new WatchProduct(Number(watchProductID))
    const searchResultList = await watchProduct.getSearchResult();
    searchResultList.forEach(searchResult => {
        prisma.searchResult.update({
            data: {
                isNew: false,
            },
            where: {
                searchResultID: searchResult.searchResultID,
            }
        });
    });
    return res.status(200).json("");
}