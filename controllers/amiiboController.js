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