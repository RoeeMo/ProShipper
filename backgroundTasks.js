const cron = require('node-cron');
const User = require('./models/user');

// Expired "reset password" tokens clenup every 15 minutes
function UnvalidateResetPassTokens() {
    cron.schedule('*/15 * * * *', async () => {
        try {
            const currentTime = new Date();
            await User.updateMany(
                { passwordResetTokenExpires: { $lt: currentTime } }, // if the value is less than the current time
                { $unset: { passwordResetToken: 1, passwordResetTokenExpires: 1 } } // delete the values of this fields
            )
            console.log(`Expired reset tokens have been removed at ${currentTime}.`);
        } catch (error) {
            console.error('Error occurred during Expired "reset password" tokens cleanup:', error);
        }
    })
};

module.exports = UnvalidateResetPassTokens;