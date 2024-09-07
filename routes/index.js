const { Router } = require("express");
const mongoose = require("mongoose");

const User = mongoose.model("users");
const Post = mongoose.model("posts");

const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { ensureSignUp, ensureNewUser } = require("../middleware/user");

const router = new Router();

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/signup", ensureAuth, ensureNewUser, (req, res) => {
  res.render("signup");
});
router.get('/profile' , ensureAuth, (req,res)=>{
  res.locals.user = req.user;
  res.render("profile-settings")
})
router.patch(
  "/user/update/role",
  ensureAuth,
  ensureNewUser,
  async (req, res) => {
    try {
      const { role } = req.body;
      const user = req.user;
      user.role = Number(role);
      await user.save();
      res.status(200).send({});
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  }
);
// ...

router.patch(
  "/user/update/profile",
  ensureAuth,
  async (req, res) => {
    try {
      const { image, gender, cover,about ,birthdate,lastName } = req.body;
      const user = req.user;
      // console.log("Here ", user)
      // user.image = name;
      // user.email = email;

      if (image) {
        user.image = image;
      }
      if (gender) {
        user.gender = gender;
      }
      if (cover) {
        user.cover = cover;
      }
      if (about) {
        user.about = about;
      }
      if (birthdate) {
        user.birthdate = birthdate;
      }
      if (lastName) {
        user.lastName = lastName;
      }
      await user.save();
      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  }
);



router.get("/dashboard", ensureAuth, ensureSignUp, async (req, res) => {
  try {
    const posts = await Post.find({});

    res.locals.user = req.user;
    res.locals.posts = posts;
    res.render("dashboard");
  } catch (error) {
    console.log(error);
    res.redirec("/internal-server-error");
  }
});

module.exports = router;
