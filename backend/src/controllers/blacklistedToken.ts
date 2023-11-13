import BlacklistedToken from "../models/blacklistedToken";
import ProjectError from "../helper/error";

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


 // Check if the token is in the Blacklist

export const blacklistedTokenCheck = async ( token : any) =>{
    
    const blacklistItem = await BlacklistedToken.findOne({ token });

    if (blacklistItem) {
      const err = new ProjectError("Not authenticated!");
      err.statusCode = 403;
      throw err;
    }
 
}