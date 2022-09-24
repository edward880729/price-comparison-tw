// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SearchResult } from '@prisma/client';
import prisma from '../../lib/prisma';

export default async function getSearchResult(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult[]>
): Promise<void> {
  const { watchProductID } = req.query;
  console.log(watchProductID);
  const searchResultList = await prisma.searchResult.findMany({
    where: {
      watchProductID: Number(watchProductID),
    },
  });
  return res.status(200).json(searchResultList);
}
