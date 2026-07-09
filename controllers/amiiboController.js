import axios from "axios";

const API_URL = "https://amiiboapi.org/api/amiibo/";

export const getAllAmiibos = async (req, res) => {

    try {

        const response = await axios.get(API_URL);

        let amiibos = response.data.amiibo;

        // Search
        const search = req.query.search?.toLowerCase() || "";

        if (search) {

            amiibos = amiibos.filter(amiibo =>

                amiibo.name.toLowerCase().includes(search) ||

                amiibo.character.toLowerCase().includes(search)

            );

        }

        // Game Series Filter
        const gameSeries = req.query.gameSeries || "";

        if (gameSeries) {

            amiibos = amiibos.filter(

                amiibo => amiibo.gameSeries === gameSeries

            );

        }

        // Type Filter
        const type = req.query.type || "";

        if (type) {

            amiibos = amiibos.filter(

                amiibo => amiibo.type === type

            );

        }

        // Dropdown Values
        const gameSeriesList = [...new Set(
            response.data.amiibo.map(a => a.gameSeries)
        )].sort();

        const typeList = [...new Set(
            response.data.amiibo.map(a => a.type)
        )].sort();

        res.render("amiibos/index", {

            title: "Browse Amiibos",

            amiibos,

            gameSeriesList,

            typeList,

            selectedGameSeries: gameSeries,

            selectedType: type,

            search

        });

    }

    catch (error) {

        console.error(error.message);

        res.status(500).send("Unable to load Amiibos.");

    }

};