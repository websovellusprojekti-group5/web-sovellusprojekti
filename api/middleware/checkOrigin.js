export const checkOrigin = (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) 
    return next();

  const origin = req.get('origin');
  console.log('Origin:', origin);  

  if (origin && origin !== (process.env.APP_ORIGIN || 'http://127.0.0.1:5173')) 
    return res.status(403).json({ message: 'Virheellinen Origin' });
  
  if (!origin && process.env.NODE_ENV === 'production') 
    return res.status(403).json({ message: 'Origin puuttuu' });

  next();
};