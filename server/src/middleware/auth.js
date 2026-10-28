import { createUserClient } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('requireAuth rejected: authHeader missing or not Bearer');
      return res.status(401).json({ 
        error: 'Authentication failed: No valid Bearer token provided.' 
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token || token === 'undefined' || token === 'null') {
      console.log('requireAuth rejected: token string is literal undefined/null');
      return res.status(401).json({ 
        error: 'Authentication failed: No valid Bearer token provided.' 
      });
    }

    const supabase = createUserClient(token);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('requireAuth rejected by Supabase auth.getUser:', error?.message);
      return res.status(401).json({ 
        error: 'Authentication failed: Invalid or expired token.' 
      });
    }

    req.user = user;
    req.supabase = supabase;
    next();
  } catch (err) {
    console.error('requireAuth crash:', err);
    return res.status(401).json({ 
      error: 'Authentication failed: Could not validate session.' 
    });
  }
};