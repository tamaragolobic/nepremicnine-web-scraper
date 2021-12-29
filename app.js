const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function getUrl() {
    try {
        const res = await axios.get(process.env.PARSE_URL);

        const $ = cheerio.load(res.data);

        const data = [];

        $('div.oglas_container').each(function () {
            const price = $('span.cena', this).text();
            const title = $('span.title', this).text();
            const url = `${process.env.BASE_URL}${$('a.slika', this).attr('href')}`;
            data.push({
                title,
                price,
                url
            });
        });

        writeToFile(data);
    } catch (error) {
        console.error(error);
    }
}

const writeToFile = (data) => {
    let fileData = '';

    for (const value of data) {
        fileData = `${fileData}\n ${JSON.stringify(value)}`;
    }
    fs.writeFile('data.txt', fileData, function (err) {
        if (err) {
            throw err;
        }
    });
}

setInterval(getUrl, process.env.PARSE_INTERVAL);