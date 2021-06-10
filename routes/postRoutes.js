const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect); // Only anthenticated users will access the endpoints below

router
  .route('/')
  .post(
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(
    postController.deletePost
  );
module.exports = router;