import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Anime.module.css'
import {Navbar} from '../../components'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const Anime: NextPage = () => {
    const [info, setAnimeInfo] = useState<any[] | undefined | null>(null);
    const [episodes, setEpisodes] = useState<any[] | undefined | null>(null);
    const router = useRouter();
    const getAnimeData = async (title: string) => {
        title = encodeURIComponent(title);
        const res = await fetch(`/api/movie/${title}?site=ar`);
        const data = await res.json();
        if (data.error) {
            window.location.href = "/";
            return null;
        }
        setAnimeInfo(data);
        setEpisodes(data.episodes);
        return data;
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // filter episodes
        // @ts-ignore
        const filteredEpisodes = info.episodes?.filter((episode) => {
            return episode.episodeNumber.toLowerCase().includes(e.target.value.toLowerCase());
        });
        setEpisodes(filteredEpisodes);
    }

    useEffect(() => {
        console.log(window.location.pathname);
        let title = window.location.pathname.split('/')[2];
        if (title) {
            getAnimeData(title);
        }
    }, []);


    return (
        <>
            <Head>
                {/* @ts-ignore */}
                <title> {info && info.title} | SnowyAnime</title>
                <meta name="description" content="Made by snowy to prove them wrong :)"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className="bg"/>
            <Navbar path={"../lLogo.svg"}/>
            <div className={styles.container}>
                <div className={styles.right}>
                    <div className={styles.img_container}>
                        {/* @ts-ignore */}
                        <img src={info && `/api/image/${encodeURIComponent(info.img)}`} alt={info && info.title}/>
                    </div>
                    <div className={styles.stats_container}>
                        {/* @ts-ignore */}
                        {info && info.stats.map((stat, index) => (
                            <div className={styles.stats_item} key={index}>
                                <small>{stat.name}</small>
                                <span>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.left}>
                    <div className={styles.info_container}>
                        <div className={styles.info_header}>
                            {/* @ts-ignore */}
                            <h1>{info && info.title}</h1>
                        </div>
                        <div className={styles.info_genre}>
                            {/* @ts-ignore */}
                            {(info && info.genres) && info.genres.map((genre, index) => (
                                <span key={index}>{genre}{" "}</span>
                            ))}
                        </div>
                        <div className={styles.info_body}>
                            {/* @ts-ignore */}
                            <p>{info && info.description}</p>
                        </div>
                    </div>
                    <div className={styles.episodes_container}>
                        <div className={styles.episodes_header}>
                            <h2>Episodes</h2>
                            <input onChange={onSearchChange} placeholder={"Enter an episode number"} type={"number"}/>
                        </div>
                        <div className={styles.episodes_list}>
                        {/* @ts-ignore */}
                        {episodes && episodes.map((episode, index) => (
                            <div  onClick={
                                () => {
                                    {/* @ts-ignore */}
                                    router.push(`/episode/${episode.episodeUrl}`);
                                }
                            } className={styles.episode_card} key={index}>
                                <div className={styles.episode_card__img}  style={{backgroundImage: `url("/api/image/${encodeURIComponent(episode.img)}")`}}/>
                                <div className={styles.episode_card__info}>
                                    <div className={styles.episode_card__header}>
                                        <div className={styles.episode_card__header__tag}>
                                            <span>Episode {episode.episodeNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Anime
