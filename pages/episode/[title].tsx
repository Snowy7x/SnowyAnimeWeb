import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Episode.module.css'
import {Navbar} from '../../components'
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

const Episode: NextPage = () => {
    const [info, setAnimeInfo] = useState<any[] | undefined | null>(null);
    const [episodes, setEpisodes] = useState<any[] | undefined | null>(null);
    const router = useRouter();
    const [currentServerIndex, setCurrentServerIndex] = useState(0);

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

    /*    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // filter episodes
            // @ts-ignore
            const filteredEpisodes = info.episodes?.filter((episode) => {
                return episode.episodeNumber.toLowerCase().includes(e.target.value.toLowerCase());
            });
            setEpisodes(filteredEpisodes);
        }*/

    useEffect(() => {
        console.log(window.location.pathname);
        let title = window.location.pathname.split('/')[2];
        if (title) {
            getEpisodeDetails(title).then((r) => {
                console.log("info:", r);
            });
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
            <Navbar path={"../lLogo.svg"}/>

            <div className="bg"/>
            <div className={styles.container}>
                <div className={styles.bottom}>
                    <div className={styles.descPanel}>
                        {/*@ts-ignore*/}
                        <h1 className={styles.descPanel__header}> {info && info.title}</h1>
                        {/*@ts-ignore*/}
                        <p>{info && info.description}</p>
                    </div>
                </div>
                <div className={styles.top}>
                    <div className={styles.watchPanel}>
                        {/*@ts-ignore*/}
                        <iframe src={info?.stream[currentServerIndex].url} frameBorder="0"></iframe>
                        <div className={styles.watchPanel__links}>
                            {/*@ts-ignore*/}
                            {info?.stream.map((stream, index) => {
                                return (
                                    <div key={index} className={styles.watchPanel__link + " " + (currentServerIndex == index ? styles.activeServer : "")}>
                                        <div onClick={()=> {setCurrentServerIndex(index)}}>{stream.name}</div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                    <div className={styles.links_container}>
                        <div className={styles.links_container_header}>
                            <div className={styles.active}>Download Links</div>
                        </div>
                        <div className={styles.links_container_body}>
                            <div id={"download"} className={styles.links}>
                                {/*@ts-ignore*/}
                                {info && info.download.map((stream, index) => {
                                    return (
                                        <a key={index} target={"_blank"} href={stream.url} className={styles.link} rel="noreferrer">{stream.name}</a>
                                    )})
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Episode
