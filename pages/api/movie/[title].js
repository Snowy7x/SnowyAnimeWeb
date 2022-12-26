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
                axios.get(sites.ar.xsanime.animeInfo.murl + req.query.title, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    }
                }).then(response => {
                    const $ = cheerio.load(response.data);
                    const animeInfo = {
                        title: $(sites.ar.xsanime.animeInfo.titlePath).text(),
                        img: $(sites.ar.xsanime.animeInfo.coverPath).attr("src"),
                        description: $(sites.ar.xsanime.animeInfo.descriptionPath).text(),
                        stats: [],
                        genres: [],
                        stream: [],
                        download: []
                    };
                    // Get the anime stats
                    $(sites.ar.xsanime.animeInfo.statsPath).slice(1, sites.ar.xsanime.animeInfo.statsCount).each((i, el) => {
                        animeInfo.stats.push({
                            name: $(el).find(sites.ar.xsanime.animeInfo.statsNamePath).text(),
                            value: $(el).text().replace($(el).find(sites.ar.xsanime.animeInfo.statsNamePath).text(), "").trim()
                        });
                    });
                    $(sites.ar.xsanime.animeInfo.genrePath).each((i, el) => {
                        animeInfo.genres.push($(el).text());
                    });
                    // Scrap the episodes info from the website

                    // Get the anime stream links
                    for (let el of $(sites.ar.xsanime.episodeInfo.streamPath)) {
                        animeInfo.stream.push({
                            name: $(el).find(sites.ar.xsanime.episodeInfo.streamNamePath).text(),
                            i: $(el).attr("data-i"),
                            id: $(el).attr("data-id"),
                        });
                    }

                    // Get the anime download links
                    $(sites.ar.xsanime.episodeInfo.downloadPath).each((i, el) => {
                        const name = $(el).find(sites.ar.xsanime.episodeInfo.downloadNamePath).text();
                        if (name === "") {
                            return;
                        }
                        animeInfo.download.push({
                            name: name,
                            url: $(el).attr(sites.ar.xsanime.episodeInfo.downloadAttr)
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
