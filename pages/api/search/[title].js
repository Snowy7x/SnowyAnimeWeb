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
                const url = sites.ar.animelek.searchInfo.url + encodeURIComponent( req.query.title);
                axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
                    }
                }).then(response => {
                    const $ = cheerio.load(response.data);
                    const searchResults = [];

                    // Loop through the search results
                    $(sites.ar.animelek.searchInfo.resultPath).each((i, el) => {
                       searchResults.push(
                           {
                               title: $(el).find(sites.ar.animelek.searchInfo.result.titlePath).text(),
                               url: $(el).find(sites.ar.animelek.searchInfo.result.url).attr(sites.ar.animelek.searchInfo.result.urlAttr).replace(sites.ar.animelek.animeInfo.url, ""),
                               img: $(el).find(sites.ar.animelek.searchInfo.result.imgPath).attr('src'),
                               status: $(el).find(sites.ar.animelek.searchInfo.result.statusPath).text(),
                               type: $(el).find(sites.ar.animelek.searchInfo.result.seasonPath).text(),

                           }
                       )
                    });

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(searchResults));
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
