const router = require("express").Router();
const User = require("../models/User");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");


//register
router.post("/register", async (req,res) => {
    
    try{
        //genrate bcrypted user passoword
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
    
        });
    
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
        console.log(err)
    }

})

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("user not found");

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordCorrect) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json("wrong password");
        }
    } catch (e) {
        return res.status(500).json(e);
    }
});

module.exports = router;
