// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import websites from "./websites.json"
import axios from "axios";
import cheerio from "cheerio";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const lang = req.query.lang || "ar";
    const site = (lang == "en") ? websites.en["gogoanime.onl"] : websites.ar.xsanime;
    const url = site.latest.url || "";
    if (!url) {
        res.status(400).json({
            statusCode: 400,
            message: "Invalid language 2: " + lang
        });
        return;
    }

    const page = site.latest.hasNum ? Math.round(<any>(req.query.page ?? 1) / 2) : "";
    const urlWithPage = url + page;
    axios.get(urlWithPage).then(response => {
            const $ = cheerio.load(response.data);
            const episodes : any = [];
            let animeCards= $(site.latest.path);
            // @ts-ignore
            if (req.query.page % 2 !== 0) {
                animeCards = animeCards.slice(0, animeCards.length / 2);
            }else{
                animeCards = animeCards.slice(animeCards.length / 2, animeCards.length);
            }
            animeCards.each((i, el) => {
                const title = $(el).find(site.latest.titlePath).text();
                const img = $(el).find(site.latest.imgPath).attr("src");
                const episodeNumber = $(el).find(site.latest.episodeNumPath).text().replace( /^\D+/g, '')
                const animeUrl = $(el).find(site.latest.animeUrlPath).attr("href")?.replace(site.animeInfo.url, "");
                const episodeUrl = $(el).find(site.latest.episodeUrlPath).attr("href")?.replace(site.episodeInfo.url, "");

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
                error: error.message,
                url: urlWithPage
            })
    });

}
