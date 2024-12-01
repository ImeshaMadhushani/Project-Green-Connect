const router = require("express").Router();
const Post = require("../models/Post");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post('/', upload.single('image'), async (req, res) => {
  try {
      const newPost = new Post({
          title: req.body.title,
          content: req.body.content,
          username: req.body.username,
          image: req.file ? req.file.filename : null,
      });
      await newPost.save();
      res.redirect('/home');
  } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).send('Error creating post');
  }
});

  
  router.post('/:id/delete', async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.redirect('/account');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.get('/:id/update', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.render('create', { isUpdate: true, post, username: req.session.username });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/:id/update', async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.redirect('/account');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/:id/comment', async (req, res) => {
    const { content } = req.body;
    const username = req.session.username;
  
    if (!username) {
      return res.status(400).send('User not authenticated');
    }
  
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      post.comments.push({ content, username });
      await post.save();
      res.redirect(`/home`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/:postId/comment/:commentId/delete', async (req, res) => {
      try {
          const { postId, commentId } = req.params;
  
          
          const post = await Post.findByIdAndUpdate(
              postId,
              { $pull: { comments: { _id: commentId } } },
              { new: true }
          );
  
          if (!post) {
              console.log(`Post with ID ${postId} not found`);
              return res.status(404).send('Post not found');
          }
  
          res.redirect('/home');
      } catch (err) {
          console.error(`Error deleting comment: ${err}`);
          res.status(500).send('Server error');
      }
  });
  