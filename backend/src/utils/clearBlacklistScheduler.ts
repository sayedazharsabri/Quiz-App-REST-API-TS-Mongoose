import cron from 'node-cron';
import {clearBlacklist} from '../controllers/blacklistedToken';

// Schedule a daily cleanup task
const clearBlacklistScheduler =   cron.schedule('* * * * *', () => {
    clearBlacklist();
});

export default clearBlacklistScheduler ;