import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Episode.module.css'
import {Navbar} from '../../components'
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import FormData from "form-data";
import axios from "axios";

const Episode: NextPage = () => {
    const [info, setAnimeInfo] = useState<any[any] | undefined | null>(null);
    const [episodes, setEpisodes] = useState<any[] | undefined | null>(null);
    const router = useRouter();
    const [currentServerIndex, setCurrentServerIndex] = useState(0);
    const [currentServerLink, setCurrentServerLink] = useState("");

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

    useEffect(() => {
        // Load next server:
        function getStreamLink(i: string, id: string){
            let data = new FormData();
            data.append('id', id);
            data.append('i', i);

            console.log("getting => id:" + id + ", i: " + i)
            const config = {
                method: 'post',
                url: 'https://v.xsanime.com/wp-content/themes/Elshaikh/Inc/Ajax/Single/Server.php',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data : data
            };
            axios(config)
                .then(function (response) {
                    setCurrentServerLink(response.data.split('\"')[1])
                })
                .catch(function (error) {
                    //console.log(error.message);
                });
        }
        getStreamLink(info?.stream[currentServerIndex].i, info?.stream[currentServerIndex].id)
    }, [currentServerIndex, info?.stream])


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
                        <div className={styles.watchPanel__links}>
                            {info?.stream.map((stream: any[any], index: any) => {
                                    return (
                                        <div key={index} className={styles.watchPanel__link + " " + (currentServerIndex == index ? styles.activeServer : "")}>
                                            <div onClick={()=> {setCurrentServerIndex(index)}}>{stream.name}</div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
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
                            <div className={styles.active}>روابط التحميل</div>
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
