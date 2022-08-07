import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import { WatchProduct, SearchResult,Filter } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  searchResult: SearchResult[] 
}; 

const Home: React.FC<Props> = ({searchResult}) => {
  console.log(searchResult)
  return (
    <div className={styles.container}>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  if (typeof sessionStorage != "undefined" && sessionStorage.getItem("test"))
    return {
      props: { searchResult: JSON.parse(sessionStorage.getItem("searchResult") as string) },
    }
  const response = await axios('http://localhost:3000/api/search', {
    params: {
      website: 'shopee',
      keyword: 'mx anywhere2',
      minPrice: 100,
      maxPrice: 600
    }
  })
  const result = await response.data

  return {
    props: { searchResult: result },
  };
};


export default Home