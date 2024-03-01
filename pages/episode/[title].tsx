import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Episode.module.css'
import {Navbar} from '../../components'
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

const Episode: NextPage = () => {
    const [info, setAnimeInfo] = useState<any[any] | undefined | null>(null);
    const [episodes, setEpisodes] = useState<any[] | undefined | null>(null);
    const router = useRouter();
    const [currentServerIndex, setCurrentServerIndex_] = useState(0);
    const [currentServerLink, setCurrentServerLink] = useState("");

    const [tab, setTab] = useState(0);
    const [tabs, setTabs] = useState<any[] | undefined | null>([])

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
        let _temp = [{
            title: "روابط التحميل",
            data: data.download,
            download: true,
        },
            {
                title: "جودة خارقة",
                data: data.stream.filter((e: { id: string | string[] }) => e.id.includes("power")),
                download: false,
            },
            {
                title: "جودة مرتفعة",
                data: data.stream.filter((e: { id: string | string[] }) => !e.id.includes("_")),
                download: false,
            },
            {
                title: "جودة متوسطه",
                data: data.stream.filter((e: { id: string | string[] }) => e.id.includes("middle")),
                download: false,
            },
            {
                title: "جودة ضعيفه",
                data: data.stream.filter((e: { id: string | string[] }) => (!e.id.includes("power") && e.id.includes("_") && !e.id.includes("middle"))),
                download: false,
            }
        ]
        let _tabs = []
        for (let i of _temp){
            if (i.data.length > 0){
                _tabs.push(i)
            }
        }

        setTabs(_tabs)
        console.log(_tabs)
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
                setCurrentServerIndex(0, r.stream[0].id, r.stream[0].i)
            });
        }
    }, []);

    return (
        <>
            <Head>
                {/* @ts-ignore */}
                <title> {info && info.title} | Snowy
                    Anime</title>
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

                        <iframe src={currentServerLink} frameBorder="0" allowFullScreen={true} sandbox={"allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"}></iframe>
                        <div className={styles.episode_nav}>
                            <div className={info?.next == null ? styles.hidden : ""} onClick={() => {
                                window.location.href = `/episode/${info.next}`;
                            }}>الحلقة التالية</div>
                            <div className={info?.prev == null ? styles.hidden : ""} onClick={() => {
                                window.location.href = `/episode/${info.prev}`;
                            }}>الحلقة السابقة</div>
                        </div>
                    </div>
                    <div className={styles.links_container}>
                        <div className={styles.links_container_header}>
                            {tabs && tabs?.map((t, index) => {
                                return (
                                    <div key={index} className={tab == index ? styles.active : ""} onClick={() => {setTab(index)}}>{t.title}</div>
                                )})}
                        </div>
                        <div className={styles.links_container_body}>
                            <div id={"download"} className={styles.links}>
                                {/*@ts-ignore*/}
                                {info && tabs[tab].data.map((stream, index) => {
                                        if (!(tabs) || tabs[tab].download) {
                                            return (
                                                <a key={index} target={"_blank"} href={stream.url} className={styles.link} rel="noreferrer">{stream.name}</a>
                                            )
                                        }else{
                                            return (
                                                <a key={index} onClick={()=> {setCurrentServerIndex(index)}} className={styles.link} rel="noreferrer">{stream.name}</a>
                                            )
                                        }
                                    })
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
