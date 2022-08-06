import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import { WatchProduct, SearchResult } from '@prisma/client';
import axios from 'axios';

type Person = {
  name: string[];
};

type Props = {
  //feed: WatchProduct[];
  //feed: SearchResult[];
  feed: Person
}; 

const Home: React.FC<Props> = ({feed}) => {
  return (
    <div className={styles.container}>
      {feed.name.filter(x => !x.includes("小霖")).map(x => (<p>{x}</p>))  }
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  if (typeof sessionStorage != "undefined" && sessionStorage.getItem("test"))
    return {
      props: { feed: JSON.parse(sessionStorage.getItem("test") as string) },
    }
  const response = await axios('http://localhost:3000/api/hello', {
    params: {
      keyword: 'ㄅㄆㄇ'
    }
  })
  const result = await response.data

  const feed = await prisma.searchResult.findMany({
    where: {},
  });
  return {
    props: { feed: result },
  };
};


export default Home