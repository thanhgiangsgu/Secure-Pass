var express = require('express')
const router = express.Router()

const user = require('../App/controllers/User.js')


router.post('/check-email', user.checkEmail);
router.get('/show-all-email', user.showAllEmail)
router.post('/add-user', user.addUser)
router.patch('/update-user', user.updateUser)
router.delete('/delete-user/:id', user.deleteUser)
router.post('/login', user.checkLogin)
router.post('/:id', user.getDataUser)
module.exports = router

