import BlacklistedToken from "../models/blacklistedToken";

// Function to clear the blacklist
export const clearBlacklist = async () => {

    try {
        const currentDate = Math.floor(Date.now() / 1000);

        const tokens = await BlacklistedToken.deleteMany({
            expiryAt: { $lt: currentDate },
        }).exec();

        if (tokens) {
            console.log('Blacklist Cleared!');
        }

        else {
            console.log("Something went wrong while clearing blacklist!")
        }

    } catch (error) {
        console.log(error)
    }

}
