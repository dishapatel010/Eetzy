const router = require('express').Router()
const {Home,Homepost, webcreate,createacc, checkuserexists}=require('../views/web')
router.get('/',Home)
router.post('/',Homepost)
router.get('/create',webcreate)
router.post('/createacc',checkuserexists,createacc)
module.exports=router
