// import { createUserClient } from '../config/supabase.js';

// export const requireAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || req.header('Authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       console.log('requireAuth rejected: authHeader missing or not Bearer');
//       return res.status(401).json({ 
//         error: 'Authentication failed: No valid Bearer token provided.' 
//       });
//     }

//     const token = authHeader.replace(/^Bearer\s+/i, '').trim();

//     if (!token || token === 'undefined' || token === 'null') {
//       console.log('requireAuth rejected: token string is literal undefined/null');
//       return res.status(401).json({ 
//         error: 'Authentication failed: No valid Bearer token provided.' 
//       });
//     }

//     const supabase = createUserClient(token);

//     const { data: { user }, error } = await supabase.auth.getUser(token);

//     if (error || !user) {
//       console.log('requireAuth rejected by Supabase auth.getUser:', error?.message);
//       return res.status(401).json({ 
//         error: 'Authentication failed: Invalid or expired token.' 
//       });
//     }

//     req.user = user;
//     req.supabase = supabase;
//     next();
//   } catch (err) {
//     console.error('requireAuth crash:', err);
//     return res.status(401).json({ 
//       error: 'Authentication failed: Could not validate session.' 
//     });
//   }
// };

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { createUserClient } from '../config/supabase.js';

const client = jwksClient({
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // Cache signing key for 24 hours
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication failed: No valid Bearer token provided.' });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({ error: 'Authentication failed: No valid Bearer token provided.' });
    }

    jwt.verify(token, getKey, { algorithms: ['ES256'] }, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Authentication failed: Token has expired.' });
        }
        return res.status(401).json({ error: 'Authentication failed: Invalid token signature.' });
      }

      req.user = {
        id: decoded.sub,
        aud: decoded.aud,
        role: decoded.role,
        email: decoded.email,
        phone: decoded.phone,
        app_metadata: decoded.app_metadata || {},
        user_metadata: decoded.user_metadata || {},
        created_at: decoded.created_at,
      };

      req.supabase = createUserClient(token);
      next();
    });
  } catch (err) {
    console.error('requireAuth crash:', err);
    return res.status(401).json({ error: 'Authentication failed: Could not validate session.' });
  }
};