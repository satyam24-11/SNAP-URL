const { getUser } = require('../service/auth');


async function restrictToLoggedinUserOnly(req, res, next) {
    //  console.log(req);
    const userUid = req.headers['Authorization'];
    if (!userUid) {
        return res.redirect('/login');
    }
    const token = userUid.split('Bearer ')[1];
    const user = getUser(token);
    if (!user) {
        return res.redirect('/login');
    }
    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    // const userUid = req.cookies?.uid;
    // const user = getUser(userUid);
    const userUid = req.headers['authorization'];
    const token = userUid.split('Bearer ')[1];
    const user=getUser(token);

    req.user = user;
    next();
}
module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};

//cookie = only valid for browser
//header = valid for all requests  header "authorization" bearer token
//token = valid for all requests
//session = valid for all requests
