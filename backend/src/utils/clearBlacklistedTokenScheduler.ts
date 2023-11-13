import cron from 'node-cron';
import {clearBlacklist} from '../controllers/blacklistedToken';

// Schedule a daily cleanup task
const clearBlacklistedTokenScheduler =   cron.schedule('0 0 * * *', () => {
    clearBlacklist();
});

export default clearBlacklistedTokenScheduler ;