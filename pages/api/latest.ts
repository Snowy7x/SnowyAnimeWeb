// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sites from "./websites.json"
import axios from "axios";
import cheerio from "cheerio";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const page = Math.round(<any>(req.query.page ?? 1) / 2);
    axios.get(sites.ar.animelek.latest.url + page, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
        }
    }).then(response => {
        const $ = cheerio.load(response.data);
        const episodes : any = [];
        let animeCards= $(sites.ar.animelek.latest.path);
        // @ts-ignore
        if (req.query.page % 2 !== 0) {
            console.log("odd");
            animeCards = animeCards.slice(0, animeCards.length / 2);
        }else{
            console.log("even");
            animeCards = animeCards.slice(animeCards.length / 2, animeCards.length);
        }
        animeCards.each((i, el) => {
            const title = $(el).find(sites.ar.animelek.latest.titlePath).text();
            const img = $(el).find(sites.ar.animelek.latest.imgPath).attr("src");
            const episodeNumber = $(el).find(sites.ar.animelek.latest.episodeNumPath).text().replace( /^\D+/g, '')
            const animeUrl = $(el).find(sites.ar.animelek.latest.animeUrlPath).attr("href")?.replace(sites.ar.animelek.animeInfo.url, "");
            const episodeUrl = $(el).find(sites.ar.animelek.latest.episodeUrlPath).attr("href")?.replace(sites.ar.animelek.episodeInfo.url, "");

            episodes.push({
                title,
                img,
                episodeNumber,
                animeUrl,
                episodeUrl
            });
        });
        res.json(episodes);
    }).catch((error) => {
        res.statusCode = 400
        res.json({
            error: error.message
        })
    })
}
