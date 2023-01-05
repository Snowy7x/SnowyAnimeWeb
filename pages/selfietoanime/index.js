import Head from 'next/head'
import { Navbar } from '../../components'
import styles from "../../styles/SelfieToAnime.module.css"
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const SearchArgs = () => {
    const [image64, setImage64] = useState("")
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState([])

    const input = useRef();

    useEffect(() => {
        PickImage();
    }, [file])

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    const PickImage = async () => {
        if (!file) return;
        if (file.length <= 0) return;
        if (file['type'].split('/')[0] !== 'image') {
            return;
        }
        setLoading(true)
        const base64 = await convertBase64(file)
        setImage64(base64)
        toast.info("One sec will do it...", {theme: "dark"})
        axios({
            method: 'post',
            url: "http://31.187.75.164:6969/toAnime",
            data: {
                image: base64.replace(/^data:image\/[a-z]+;base64,/, "")
            },
            mode: 'no-cors',
        }).then(res => {
            if (res.data){
                setImage64("data:image/jpeg;base64," + res.data.image)
            }
            setFile([])
            setLoading(false)
            toast.info("Enjoy :), press download to save..", {theme: "dark"})
        }).catch(err => {
            console.log(err)
            setFile([])
            setLoading(false)
            toast.error("Something wrong happened, try again!", {theme: "dark"})
        })
    }

    return (
        <>
            <ToastContainer/>
            <Head>
                <title>SnowyAnime</title>
                <meta name="description" content="Made by snowy to prove them wrong :)" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg"/>
            <Navbar path={'../lLogo.svg'} page="selfietoanime" />
            <div style={{display: loading ? "flex" : "none"}} className={styles.loading}>
                <div className={styles.ldsEllipsis}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h2>Loading...</h2>
                <h4>This process takes some time, please wait</h4>
            </div>
            <section className={styles.container}>
                <img src={image64} className={styles.preview}/>
                <input type="file" accept="image/*" ref={input} style={{display: 'none'}} onChange={e => {
                    setFile(e.target.files[0])
                    input.current.value = null;
                }}/>
                <a className={styles.btn} onClick={() => {
                    input.current.click();
                }}>Choose an Image</a>
            </section>
        </>
    )
}

export default SearchArgs
