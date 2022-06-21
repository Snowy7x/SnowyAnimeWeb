// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sites from "./websites.json"
import axios from "axios";
import cheerio from "cheerio";


export default function handler(
    req,
    res
) {
    if (req.method === 'GET') {
        const lang = req.query.lang || "ar";
        if (lang === 'ar') {
            // Scrap the anime info from the website
            const url = sites.ar.witanime.url;
            axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                }
            }).then(response => {
                const $ = cheerio.load(response.data);
                const seasonalUrl = $("#menu-item-107 a").attr("href");
                axios.get(seasonalUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    }
                }).then(response => {
                    const $ = cheerio.load(response.data);
                    const season = $(sites.ar.witanime.seasonal.seasonPath).text().replace($(sites.ar.witanime.seasonal.seasonPath).first().text(), "");
                    const searchResults = [];

                    // Loop through the search results
                    $(sites.ar.witanime.seasonal.animePath).each((i, el) => {
                        searchResults.push(
                            {
                                title: $(el).find(sites.ar.witanime.seasonal.titlePath).text(),
                                url: $(el).find(sites.ar.witanime.seasonal.animeUrl).attr(sites.ar.witanime.seasonal.urlAttr).replace(sites.ar.witanime.animeInfo.url, ""),
                                img: $(el).find(sites.ar.witanime.seasonal.imgPath).attr('src'),
                                status: $(el).find(sites.ar.witanime.seasonal.statusPath).text(),
                                type: $(el).find(sites.ar.witanime.seasonal.typePath).text(),

                            }
                        )
                    });

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        season: season,
                        animes: searchResults
                    }));
                }).catch(error => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        error: error.message,
                        url: seasonalUrl
                    }));
                })
            })
        }else{
            res.end("Invalid site");
        }
    }else{
        res.status(405).end('Method not allowed');
    }
}
