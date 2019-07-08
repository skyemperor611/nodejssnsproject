const NaverStrategy = require('passport-naver').Strategy;

const { User } = require('../models');
module.exports = (passport) => {
    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try{
    const exUser = await User.findOne({ where: { snsId: profile.displayName, provider: 'naver'}});
    if (exUser) {
        done(null, exUser);
    } else {
      const newUser = await User.create({
        name: profile.displayName,
        nick: profile.emails[0].value,
        username: profile.displayName,
        provider: 'naver',
        naver: profile._json
            });
            done(null, newUser)
            
        }
    } catch (error) {
        console.error(error);
        done(error);
    } 
    }));
}
