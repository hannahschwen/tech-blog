const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/login', async (req, res) => {
//   try {

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/dashboard', async (req, res) => {
//   try {
//     res.send('on dashboard');
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Use withAuth middleware to prevent access to route
// router.get('/dashboard', withAuth, async (req, res) => {
router.get('/dashboard', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    // this isn't gonna work yet cause I don't have login done
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    // res.render('dashboard', {
    //   ...user,
    //   logged_in: true
    // });

    res.render('dashboard')
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// // does this route make sense for individual posts?
// router.get('post/:post', async (req, res) => {
//   try {

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router; 