const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token || req.headers['authorization'];
    req.user = null;
    if (!tokenCookie) {
        return next();
    }
    const token = tokenCookie;
    const user = getUser(token);
    req.user = user;
    return next();
}

function restrictTo(roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        if (!roles.includes(req.user.role)) {
            return res.end('You are not authorized to access this resource');
        }

        return next();
    }
}
// async function restrictToLoggedinUserOnly(req, res, next) {
//     //  console.log(req);
//     const userUid = req.headers['Authorization'];
//     if (!userUid) {
//         return res.redirect('/login');
//     }
//     const token = userUid.split('Bearer ')[1];
//     const user = getUser(token);
//     if (!user) {
//         return res.redirect('/login');
//     }
//     req.user = user;
//     next();
// }

// async function checkAuth(req, res, next) {
//     // const userUid = req.cookies?.uid;
//     // const user = getUser(userUid);
//     const userUid = req.headers['authorization'];
//     const token = userUid.split('Bearer ')[1];
//     const user=getUser(token);

//     req.user = user;
//     next();
// }
module.exports = {
    //restrictToLoggedinUserOnly,
    checkForAuthentication,
    restrictTo,
};

//cookie = only valid for browser
//header = valid for all requests  header "a"
//token = valid for all requests
//session = valid for all requests
