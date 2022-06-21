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
                const url = sites.ar.witanime.episodeInfo.url + encodeURIComponent( req.query.title);
                console.log(url);
                axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    }
                }).then(response => {
                    const $ = cheerio.load(response.data);
                    const animeInfo = {
                        title: $(sites.ar.witanime.episodeInfo.titlePath).text().replaceAll(new RegExp(sites.ar.witanime.episodeInfo.replaces.join("|"), "g"), ""),
                        description: $(sites.ar.witanime.animeInfo.descriptionPath).text().replaceAll(new RegExp(sites.ar.witanime.episodeInfo.replaces.join("|"), "g"), ""),
                        stream: [],
                        download: []
                    };

                    // Get the anime stream links
                    $(sites.ar.witanime.episodeInfo.streamPath).each((i, el) => {
                        const name = $(el).find(sites.ar.witanime.episodeInfo.streamNamePath).text();
                        if (name.includes("vivystream")) {
                            return;
                        }
                        animeInfo.stream.push({
                            name: $(el).find(sites.ar.witanime.episodeInfo.streamNamePath).text(),
                            url: $(el).find(sites.ar.witanime.episodeInfo.streamUrlPath).attr(sites.ar.witanime.episodeInfo.streamAttr)
                        });
                    })

                    // Get the anime download links
                    $(sites.ar.witanime.episodeInfo.downloadPath).each((i, el) => {
                        const name = $(el).find(sites.ar.witanime.episodeInfo.downloadNamePath).text();
                        if (name === "") {
                            return;
                        }
                        animeInfo.download.push({
                            name: name,
                            url: $(el).find(sites.ar.witanime.episodeInfo.downloadUrlPath).attr(sites.ar.witanime.episodeInfo.downloadAttr)
                        });
                    });


                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(animeInfo));
                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        error: error.message,
                        url: url
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
