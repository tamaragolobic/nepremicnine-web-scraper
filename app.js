import {DatabaseController} from "./DatabaseController.js";
import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const db = DatabaseController();

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

        db.insert({
            table: 'Ads',
            data: data
        });

    } catch (error) {
        console.error(error);
    }
}

const writeToFile = (data) => {
    let fileData = '';

    for (const value of data) {
        fileData = `${fileData}${JSON.stringify(value)}\n`;
    }
    fs.writeFile('data.txt', fileData, function (err) {
        if (err) {
            throw err;
        }
    });
}

setInterval(getUrl, Number(process.env.PARSE_INTERVAL));