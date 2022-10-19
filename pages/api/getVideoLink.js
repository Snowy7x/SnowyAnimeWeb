import puppeteer from "puppeteer";
import cheerio from "cheerio";

export default async function handler(
    req,
    res
) {
    if (req.method === 'GET') {
        const url = req.query.url
        if (url === undefined) {
            res.status(405).end('You must provide: a url');
        } else {
            const browser = await puppeteer.launch({headless: true})
            const page = await browser.newPage()
            await page.goto(url)

            const data = await page.evaluate(() => {
                return document.body.innerHTML;
            })

            const $ = cheerio.load(data)
            const src = $("video").attr("src");
            await browser.close()

            res.end(JSON.stringify({
                code: 200,
                src
            }))
        }
    } else {
        res.status(405).end('Method not allowed');
    }
}
