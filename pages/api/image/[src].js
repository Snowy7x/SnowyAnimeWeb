// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";


export default function handler(
    req,
    res
) {
    let url = decodeURIComponent(req.query.src);
    // encode url after last slash
    //const encodedUrl = url.substring(url.lastIndexOf("/") + 1);
    //url = url.replace(encodedUrl, encodeURIComponent(encodedUrl));
    axios.get(url, {
        responseType: "arraybuffer",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
        }
    }).then(response => {
        const file = response.data;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        res.end(file);
    }).catch(error => {
        res.statusCode = 500;
        res.end(error.message);
    })
}
