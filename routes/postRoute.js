const router = require('express').Router()
const authentication = require('../middleware/authentication')
const postController = require('../controllers/postController')

router.route('/post')
    .post(authentication, postController.createPost)
    .get(authentication, postController.getPosts)

router.route('/post/:id')
    .patch(authentication, postController.updatePost)
    .get(authentication, postController.getPostById)
    .delete(authentication, postController.deletePostById)

router.patch('/post/:id/like', authentication, postController.likePost)

router.patch('/post/:id/unlike', authentication, postController.unlikePost)

router.get('/user_posts/:id', authentication, postController.getUserPosts);

router.get('/posts_discover', authentication, postController.getPostsDiscover);

module.exports = router