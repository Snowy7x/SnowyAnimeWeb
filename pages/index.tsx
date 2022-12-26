import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Navbar } from '../components'
import {useEffect, useState} from "react";

const Home: NextPage = () => {
    const [latestAnime, setLatestAnime] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const refreshLatestAnime = async () => {
        const res = await fetch('/api/latest?page=' + currentPage);
        const data = await res.json();
        // append to latestAnime
        console.log(data);
        setLatestAnime(latestAnime.concat(data));
        return data;
    }

    useEffect(() => {
        refreshLatestAnime();
    }, [currentPage])
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Head>
                <title>SnowyAnime</title>
                <meta name="description" content="Made by snowy to prove them wrong :)" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg"/>
            <Navbar path={'./lLogo.svg'} page={"home"} />
            <section id="hero" className={styles.hero}>
                <div className={styles.hero__content}>
                    <h2>SnowyAnime</h2>
                    <h4>
                        SnowyAnime is a website that provides you with the best anime
                        and manga you can find In both <span>Arabic</span> and <span>English</span>.
                    </h4>
                    <a className={styles.btn} href="#latest">Check out the latest episodes :-)</a>
                </div>
                <div className={styles.hero__img} />
            </section>
            <section id="latest">
                {/* - Episode Card [img]
                    - Episode Header [other info]
                    - Episode Body [title]

             */}
                <div className={styles.section_header}>
                    <h2>Latest Episodes</h2>
                </div>
                <div className={styles.episodes_list}>
                    {latestAnime.length > 0 ? latestAnime.slice(0, 12).map((anime, index) => (
                            <div className={styles.episode_card} key={index}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("/api/image/${encodeURIComponent(anime.img)}")`}}/>
                                <div onClick={() => {
                                    window.location.href = (anime.isMovie ? '/movie/' : "/episode/") + anime.episodeUrl;
                                }} className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {anime.episodeNumber}</span>
                                        </div>
                                    </div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        window.location.href = (anime.isMovie ? '/movie/' : "/episode/") + anime.animeUrl;
                                    }} className={styles.episode_card__body}>
                                        <p>{anime.title}</p>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.episode_card}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("https://i.imgur.com/XqQXqQX.png")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.episode_card__body}>
                                        <p>{'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </section>
        </>
    )
}

export default Home
