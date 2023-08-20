const allowOnlyAuth = async function(req, res, next){
    if(req.session.user !== undefined){
        return next()
    }
    else{
        return res.redirect('/user/login')
    }
}

const allowOnlyUnauth = async function(req, res, next){
    if(req.session.user !== undefined){
        return res.redirect("/")
    }
    else{
        return next()
    }
}

module.exports = {
    allowOnlyAuth: allowOnlyAuth,
    allowOnlyUnauth: allowOnlyUnauth
}