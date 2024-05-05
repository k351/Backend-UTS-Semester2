const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { User } = require('../../models');

// Authenticate user based on the JWT token
passport.use(
  'user',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      const user = await User.findOne({ id: payload.user_id });
      return user ? done(null, user) : done(null, false);
    }
  )
);

module.exports = passport.authenticate('user', { session: false });
