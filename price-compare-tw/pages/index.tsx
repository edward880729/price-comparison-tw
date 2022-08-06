import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import { WatchProduct, SearchResult } from '@prisma/client';

type Props = {
  //feed: WatchProduct[];
  feed: SearchResult[];
}; 

const Home: React.FC<Props> = ({feed}) => {
  return (
    <div className={styles.container}>
      {feed.map(x => (
        <div>
          <p>{x.title}</p>
          <p>{x.price}</p>
          <p>{x.createDate.toString()}</p>
        </div>
      ))}
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.searchResult.findMany({
    where: {},
  });
  return {
    props: { feed: JSON.parse(JSON.stringify(feed)) },
    //revalidate: 10,
  };
};

export default Home