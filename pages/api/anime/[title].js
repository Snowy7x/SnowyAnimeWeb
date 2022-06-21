// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sites from "../websites.json"
import axios from "axios";
import cheerio from "cheerio";


export default function handler(
    req,
    res
) {
    if (req.method === 'GET') {
        const lang = req.query.lang || "ar";
        if (lang === 'ar') {
            if (req.query.title !== undefined) {
                // Scrap the anime info from the website
                axios.get(sites.ar.witanime.animeInfo.url + req.query.title, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    }
                }).then(response => {
                    const $ = cheerio.load(response.data);
                    const animeInfo = {
                        title: $(sites.ar.witanime.animeInfo.titlePath).text(),
                        img: $(sites.ar.witanime.animeInfo.coverPath).attr("src"),
                        description: $(sites.ar.witanime.animeInfo.descriptionPath).text(),
                        stats: [],
                        genres: [],
                        episodes: []
                    };
                    // Get the anime stats
                    $(sites.ar.witanime.animeInfo.statsPath).slice(0, sites.ar.witanime.animeInfo.statsCount).each((i, el) => {
                        animeInfo.stats.push({
                            name: $(el).find(sites.ar.witanime.animeInfo.statsNamePath + ":nth-child(1)").text(),
                            value: $(el).text().replace($(el).find(sites.ar.witanime.animeInfo.statsNamePath + ":nth-child(1)").text(), "").trim()
                        });
                    });
                    $(sites.ar.witanime.animeInfo.genrePath).each((i, el) => {
                        animeInfo.genres.push($(el).text());
                    });
                    // Scrap the episodes info from the website
                    let img;
                    $(sites.ar.witanime.animeInfo.episodesPath).each((i, el) => {
                        if (i === 0) {
                            img = $(el).find(sites.ar.witanime.animeInfo.ep_imgPath).attr("src");
                        }
                        const episodeNumber = $(el).find(sites.ar.witanime.animeInfo.ep_numPath).text().replace( /^\D+/g, '')
                        const episodeUrl = $(el).find(sites.ar.witanime.animeInfo.ep_urlPath).attr(sites.ar.witanime.animeInfo.ep_urlAttr).replace(sites.ar.witanime.episodeInfo.url, "");
                        animeInfo.episodes.push({
                            img,
                            episodeNumber,
                            episodeUrl
                        });
                    });

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(animeInfo));
                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        error: error.message
                    }));
                })
            }else{
                res.end("No anime specified");
            }
        }else{
            res.end("Invalid site");
        }
    }else{
        res.status(405).end('Method not allowed');
    }
}
