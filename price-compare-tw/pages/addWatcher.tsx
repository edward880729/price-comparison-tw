import { SearchResult } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from 'next/image';

type Props = {
    website: string,
    keyword: string,
    minPrice: number,
    maxPrice: number,
    searchResult: SearchResult[]
  };

const Home = (props: Props) => {
    let { website, keyword, minPrice, maxPrice, searchResult } = props;

    const router = useRouter();
    const search = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.push({
            pathname: '/addWatcher',
            query: {
                website: website,
                keyword: keyword,
                minPrice: minPrice,
                maxPrice: maxPrice,
            },
        })
    }

    const handleChangeWebsite = (e: { preventDefault: () => void; target: { value: string; }; }) => {
        e.preventDefault();
        website = (e.target.value)
    }
    const handleChangeKeyword = (e: { preventDefault: () => void; target: { value: string; }; }) => {
        e.preventDefault();
        keyword = (e.target.value)
    }
    const handleChangeMin = (e: { preventDefault: () => void; target: { value: any; }; }) => {
        e.preventDefault();
        minPrice = (e.target.value) as number 
    }
    const handleChangeMax = (e: { preventDefault: () => void; target: { value: any; }; }) => {
        e.preventDefault();
        maxPrice = (e.target.value) as number
    }

    return (
        <div>
            <form className="m-10">
                <input onChange={handleChangeWebsite} defaultValue={ "shopee" } type="text" placeholder="Website..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={handleChangeKeyword} defaultValue={ keyword } type="text" placeholder="Search..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={handleChangeMin} defaultValue={ 0 } type="number" placeholder="min..." className="outline-none border-2 rounded-md pl-2" />
                <input onChange={handleChangeMax} defaultValue={ 300 } type="number" placeholder="max..." className="outline-none border-2 rounded-md pl-2" />
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
            website: website as string,
            keyword: keyword as string,
            minPrice: minPrice as unknown as number,
            maxPrice: maxPrice as unknown as number,
            searchResult: result
        },
    };
}

export default Home;