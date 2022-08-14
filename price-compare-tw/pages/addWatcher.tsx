import { SearchResult } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from 'next/image';
import { SetStateAction, useState } from "react";

type Props = {
    searchResult: SearchResult[]
  };

const Home = (props: Props) => {
    let { searchResult } = props;

    const [inputWebsite, setWebsite] = useState("shopee");
    const [inputKeyword, setKeyword] = useState("");
    const [inputMinPrice, setMinPrice] = useState(0);
    const [inputMaxPrice, setMaxPrice] = useState(600);

    const router = useRouter();
    const search = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.push({
            pathname: '/addWatcher',
            query: {
                website: inputWebsite,
                keyword: inputKeyword,
                minPrice: inputMinPrice,
                maxPrice: inputMaxPrice,
            },
        })
    }

    return (
        <div>
            <form className="m-10">
                <input onChange={e => setWebsite(e.target.value)} defaultValue={ inputWebsite } type="text" placeholder="Website..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={e => setKeyword(e.target.value)} defaultValue={ inputKeyword } type="text" placeholder="Search..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={e => setMinPrice(e.target.valueAsNumber)} defaultValue={ inputMinPrice } type="number" placeholder="min..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={e => setMaxPrice(e.target.valueAsNumber)} defaultValue={ inputMaxPrice } type="number" placeholder="max..." className="outline-none border-2 rounded-md pl-2" />
                <button onClick={search}>Search</button>
            </form>
            <div className="grid gap-2 grid-cols-4">
                {searchResult.map((data, index) => (
                    <div className="max-w-[300px] border rounded-md" key={index}>
                        <div>
                            <Image src={data.imageUrl} width={300} height={300} />
                        </div>
                        <p>{data.name}</p>
                        <p>{data.price}</p>
                    </div>
                ))}
            </div>
        </div>
  );
};


export const getServerSideProps: GetServerSideProps<Props> = async context => {
    let { website, keyword, minPrice, maxPrice } = context.query;
    website = website == undefined? "shopee": website
    keyword = keyword == undefined? "": keyword
    minPrice = minPrice == undefined? "0": minPrice
    maxPrice = maxPrice == undefined? "1000": maxPrice

    const response = await axios('http://localhost:3000/api/search', {
        params: {
            website: website,
            keyword: keyword,
            minPrice: minPrice,
            maxPrice: maxPrice
        }
    })
    const result: SearchResult[] = await response.data
    return {
        props: {
            searchResult: result
        },
    };
}

export default Home;