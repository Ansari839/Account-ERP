import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export const generateKey = (companyId, fiscalYear) => {
  const hash = crypto.createHmac('sha256', SECRET_KEY)
    .update(companyId + fiscalYear)
    .digest('hex');
  return hash;
};
