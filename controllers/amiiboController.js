import axios from "axios";

export async function getAllAmiibos(req, res) {

    try {

        const response = await axios.get(
            "https://amiiboapi.org/api/amiibo/"
        );

        const amiibos = response.data.amiibo.slice(0, 60);

        res.render("amiibos/index", {

            title: "Amiibo Vault",

            amiibos

        });

    }

    catch (err) {

        console.error(err);

        res.send("Unable to load amiibos.");

    }

}