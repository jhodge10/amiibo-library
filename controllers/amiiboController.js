import axios from 'axios';

export const getAllAmiibos = async (req, res) => {
  try {
    const response = await axios.get(
      'https://amiiboapi.org/api/amiibo/'
    );

    const amiibos = response.data.amiibo.slice(0, 50);

    res.render('amiibos/index', {
      title: 'All Amiibos',
      amiibos
    });
  } catch (error) {
    console.error(error);

    res.status(500).send('Error loading amiibos');
  }
};

export const getSingleAmiibo = async (req, res) => {
  try {
    const { head, tail } = req.params;

    const response = await axios.get(
      `https://amiiboapi.org/api/amiibo/?head=${head}&tail=${tail}`
    );

    const amiibo = response.data.amiibo[0];

    res.render('amiibos/details', {
      title: amiibo.name,
      amiibo
    });
  } catch (error) {
    console.error(error);

    res.status(500).send('Unable to load amiibo.');
  }
};