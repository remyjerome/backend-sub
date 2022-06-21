const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {

    const { username, password } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashPassword
        })

        const sess = req.session
        sess.user = newUser
        res.status(201).json({
            status: 'sucess',
            data: {
                newUser
            }
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            const sess = req.session
            sess.user = user
            res.status(200).json({
                status: 'sucess'
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorect username or password'
            })
        }
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}