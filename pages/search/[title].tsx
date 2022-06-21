import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Search.module.css'
import { Navbar } from '../../components'
import {useEffect, useState} from "react";
import {router} from "next/client";
import {useRouter} from "next/router";

const SearchArgs: NextPage = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter()

    const searchAnimes = async (title: string) => {
        const res = await fetch('/api/search/' + title).then(
            // Setting the search results to the response data
            async (res) => {
                const data = await res.json();
                if (data.error) {
                    window.location.href = "/";
                    return null;
                }else {
                    console.log(data);
                    setSearchResults(data);
                    setIsLoading(false);
                }
            }
        );
    }

    useEffect(() => {
        let title = window.location.pathname.split('/')[2];
        if (title) {
            setSearchQuery(decodeURIComponent(title));
            searchAnimes(title);
        }
    }, [router.asPath])

    useEffect(() => {
        return () => {
            console.log("search results:", searchResults);
        };
    }, [searchResults]);



    return (
        <>
            <Head>
                <title>SnowyAnime</title>
                <meta name="description" content="Made by snowy to prove them wrong :)" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg"/>
            <Navbar path={'../lLogo.svg'} />
            <section id="latest">
                {/* - Episode Card [img]
                    - Episode Header [other info]
                    - Episode Body [title]

             */}
                <div className={styles.section_header}>
                    <h2>Search Results For: {searchQuery}</h2>
                </div>
                <div className={styles.animes_list}>
                    {searchResults ? searchResults.map((anime, index) => (
                            <div className={styles.anime_card} key={index}>
                                <div className={styles.anime_card__img}  style={{backgroundImage: `url("/api/image/${encodeURIComponent(anime.img)}")`}}/>
                                <div onClick={() => {
                                    window.location.href = '/anime/' + anime.url;
                                }} className={styles.anime_card__info}>
                                    <div className={styles.anime_card__header}>
                                        <div className={styles.anime_card__header__tag}>
                                            <span>{anime.status}</span>
                                            <span>{anime.type}</span>
                                        </div>
                                    </div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        window.location.href = '/anime/' + anime.url;
                                    }} className={styles.anime_card__body}>
                                        <p>{anime.title}</p>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <div>No results found</div>
                    }
                </div>
            </section>
        </>
    )
}

export default SearchArgs
