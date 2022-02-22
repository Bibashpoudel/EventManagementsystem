
import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport'
import User from './model/userModel.js';


const GOOGLE_CLIENT_ID = process.env_GOOGLE_CLIENT_ID || '989451052098-q7repal42gdlau7hgstenv11bhe6n3u6.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = process.env_GOOGLE_CLIENT_SECRET || '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';


passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
          
          console.log(profile);
          const user = User.findOne({ where: { id: profile.id } })
          if (!user) {
            const newUser = new User({
                id: profile.id,
                fullName: profile.name.givenName + ' ' + profile.name.familyName,
                email: profile.emails[0].value
            });
              newUser.save();
              console.log(newUser);
          }
          done(null, profile);
          
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });



