import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Anime.module.css'
import styles2 from '../../styles/Episode.module.css'
import {Navbar} from '../../components'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

const Anime: NextPage = () => {
    const [info, setAnimeInfo] = useState<any[any] | undefined | null>(null);
    const [episodes, setEpisodes] = useState<any[] | undefined | null>(null);
    const router = useRouter();

    const [currentServerIndex, setCurrentServerIndex_] = useState(0);
    const [currentServerLink, setCurrentServerLink] = useState("");

    const setCurrentServerIndex = (ind: any, id = null, i = null) => {
        if (id == null) id = info?.stream[ind].id;
        if (i == null) i = info?.stream[ind].i;
        setCurrentServerIndex_(ind)
        setCurrentServerLink("")
        axios.get(`/api/stream?id=${id}&i=${i}`).then(re => {
                setCurrentServerLink(re.data.link)
            }
        ).catch()
    }

    const getEpisodeDetails = async (title: string) => {
        const res = await fetch(`/api/episode/${title}?site=ar`);
        const data = await res.json();
        if (data.error) {
            window.location.href = "/";
            return null;
        }
        console.log(data);
        setAnimeInfo(data);
        setEpisodes(data.episodes);
        return data;
    }

    const getAnimeData = async (title: string) => {
        title = encodeURIComponent(title);
        const res = await fetch(`/api/movie/${title}?site=ar`);
        const data = await res.json();
        if (data.error) {
            window.location.href = "/";
            return null;
        }
        setAnimeInfo(data);
        setCurrentServerIndex(0, data.stream[0].id, data.stream[0].i)
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
                    <div className={styles2.links_container}>
                        <div className={styles2.links_container_header}>
                            <div className={styles2.active}>روابط التحميل</div>
                        </div>
                        <div className={styles2.links_container_body}>
                            <div id={"download"} className={styles2.links}>
                                {/*@ts-ignore*/}
                                {info && info.download.map((stream, index) => {
                                    return (
                                        <a key={index} target={"_blank"} href={stream.url} className={styles2.link} rel="noreferrer">{stream.name}</a>
                                    )})
                                }
                            </div>
                        </div>
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
                        <div className={styles2.watchPanel}>
                            <div className={styles2.watchPanel__links}>
                                {info?.stream.map((stream: any[any], index: any) => {
                                        return (
                                            <div key={index} className={styles2.watchPanel__link + " " + (currentServerIndex == index ? styles2.activeServer : "")}>
                                                <div onClick={()=> {setCurrentServerIndex(index)}}>{stream.name}</div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                            <iframe src={currentServerLink} frameBorder="0" allowFullScreen={true} sandbox={"allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"}></iframe>
                            <div className={styles2.episode_nav}>
                                <div className={info?.next == null ? styles2.hidden : ""} onClick={() => {
                                    window.location.href = `/episode/${info.next}`;
                                }}>الحلقة التالية</div>
                                <div className={info?.prev == null ? styles2.hidden : ""} onClick={() => {
                                    window.location.href = `/episode/${info.prev}`;
                                }}>الحلقة السابقة</div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    )
}

export default Anime
