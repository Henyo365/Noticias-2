const { Router } = require('express');
const axios = require('axios');

const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();

// Models
const Image = require('../models/Image');

router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index', { images });
});

router.get('/upload', (req, res) => {
    res.render('upload');
});
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/upload', async (req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();
    res.redirect('/');
});
router.get('/news', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'sciences',
        from: 'new',
        sortBy: 'publishedAt',
        language: 'es',
        apiKey: '9283801dfdfa46a09bc7bd521c7b51e3' 
      }
    });

    const news = response.data.articles.map(article => {
      return {
        id : article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        imageUrl: article.urlToImage 
      };
    });

    res.render('news', { news }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('profile', { image });
});

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + imageDeleted.path));
    res.redirect('/');
});
router.get('/libros', async (req, res) => {
  const images = await Image.find();
  res.render('libros', { images });
});

module.exports = router;