![!\[applogo\](Quiz_App_REST-API.png)](doc/images/Quiz_App_REST-API.png)

# Quiz-App-REST-API-TS-Mongoose
This is Backend - REST API for a Quiz App build using TypeScript and Mongoose.
### Backend playlist: [Quiz App Backend](https://www.youtube.com/playlist?list=PLIfcYFqzDXHlHjNyVs5J5KCe6B1NYZ7WK)

## Dependencies:
![Static Badge](https://img.shields.io/badge/express-v4.18.2-1?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAAAbFBMVEX%2F%2F%2F%2F8%2FPz09PT19fX4%2BPjd3d2ampoAAAAzNDWoqKno6Oh0dHRcXFzIycm5ubktLi4hIiN7e3yLi4tmZ2fi4uI9Pj7S0tIHCQuzs7NJSkru7u6goKB%2Bf3%2FW1taNjo69vb1PT1BsbW0VFRc3ODhehn9TAAAA30lEQVR4Ad3QhXHEMBBA0W8QmAVmTq7%2FHjOeDdSQewNiLfBukjRNM4A0TeCR%2F0wSpY0xtiihMgWPsraNnLWd8yFEE3vyOIwAeprhMQ5Lm8O6uT3hWPwKjQspj%2BzsLvlBuwNmV1DaukS%2Bt3sqs8MWkAU7ejMiGnMhkjoCqnZmQ3CZPwM8Hy%2F8Hd7xF7BWzjQIxulCsJaQbG6r7xXR2zNHrn1s0AwhUdNPjunejTLxTlHedS89EOMwFAkobzR4ewFptRyI9tPY18uZkFIYzUO5akWU22BflYKx2xGX1Rn%2Fyxf%2BuwzyBt%2FvSwAAAABJRU5ErkJggg%3D%3D)
![Static Badge](https://img.shields.io/badge/typescript-v5.2.2-1?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAAANlBMVEUxdsQwd8UxeMYudsQwd8UodMUVbcIfcMOlv%2BPY4%2FNfkdCzyefr8fn%2F%2F%2F9DgsqEqdrO3PDE1uzY59dZAAAABXRSTlMKqv8F%2BjSKPNsAAACwSURBVHgB5Y4BCsUgCECrTXWWVfe%2F7DeGjUE7wX8ERM9XhRDTB%2FFwt7UhfXNupfNnEtCBlIjsgJYkvhyBlEvRctUlszqS9GZJaMysWphztbku0ro8bxJZMZAIL4sIAF%2B%2FrVbYCQ7VUhHSToKo0eVVwi2nLWpk2pRmoU3dYFfawqw6aPNmAyQUl%2B8Suw7Ofq3zyMkMlzSYG8yhlvtgsbkzxCWJzBlAeG9jOOKZtpzx%2BAFmeg3cx68a3wAAAABJRU5ErkJggg%3D%3D)
![Static Badge](https://img.shields.io/badge/mongoose-v7.5.0-1?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAAAb1BMVEX%2F%2F%2F%2F99%2Ff57%2B%2F%2B%2FPzlysq3c3PSpaWdNjaHAACBAADVq6uvYGCMAACPAAC1bW16AACwZGShQECZLCyQEBB%2BAADCh4eAAACSGRmWJibz5eXHkpLZsrLevr6jSUmoUVHKmJju3t768%2FO8fX2aNTXn0dGi5lwOAAAAsklEQVR4AeXOURqCIBBF4UFUZ1QVFUkw0qz9r7HAUL%2BWUPeFA%2F8LEMYiFpJHUcg4SYGnGRJmub8XJVFVb542grUNdllPsgYYlLpkI6pKe5RCkHknm5CuqbQxB9A3ZT1SiTH4zTSWgvuMerV4JAPbdIlj%2BEstc4%2B4wLZ7Ryt8ZqRxqEYI%2BKAp9CxXh9IeiM8DE4%2FFCZdvFP%2BBTbFjd8LG4dQO4YEJq0PnrXEHh3383PBLewEQBBA5C4H39wAAAABJRU5ErkJggg%3D%3D)
![Static Badge](https://img.shields.io/badge/nodemailer-v6.9.4-1?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAAAolBMVEX%2F%2F%2F%2Fx%2BvXn9u%2Fi8fjl8%2Fj1%2B%2F3c8eaCzKXU7uDF5vZzxenG5PCAxuBewI50x51Os%2BJXstVtutk2sXSIz6s3rN%2Bd1e8inMqV1bWs2%2FF5v9srn8s8s3eu4MeUyuBMuYO95dFfuuWl0eNDpMpjwZEtpdah2t%2BX1c2DyOnw%2Bf3o6Oisq6vPz8%2F19fXv7%2B%2FBwcHY2NiCgoKRkZG6urqjo6Obm5tra2s7HR5QAAAA0klEQVR4AWIYaoCRCUAFPWABDANRFK1t29r%2FBqs%2FRV4b3sNwSJS4L0m%2BF0XVcNaNT01LBNqOAHQNmUz0fIkwCHlgFEMlP%2FkwSAnd7FI5L%2F5YVsDI1U%2Brkz%2BWQdMCo07n%2BqJgsAxsDRgZ9ZCweOqoAKPptD%2FeObMbQX8opCpaVio%2Fqzd6PyTwGyWdg57jqF6qCQAGYFjllHn%2BpQ1VLE%2BYWEQNyElBXwjc6isji5udh7fbRTzcW%2BJrY7Z2tyqPlfBh8Rmn76lkRKIRFKZqQWoWBr%2FDBSQFHq4LXtBcAAAAAElFTkSuQmCC)

# What you can learn by exploring
- There is JWT authentication in this app
- There is express validator and express error routes
- There is custom error class.
- There is nodemailer used in this.

## How to Start ?
- Step 1: Clone this repository.
- Step 2: To install all the required packages run command:
    ```sh
    yarn install
    ```
- Step 3: Add environment configuration details to nodemon.json for development. 
![!\[config\](carbon.png)](doc/images/carbon.png)
- Step 4: Replace `<DATABASE_CONNECTION_STRING>` with appropriate connection string.
- Step 5: To apply JWT authentication, replace `<ENCRYPTION_SECRET>` with appropriate key.
- Step 6: To use the emailer functionality, replace `<USER_EMAIL>` with an actual email and enable 2-step Verification on it.
- Step 7: Visit manage account of the email and search for **App passwords**![!\[Alt text\](<Screenshot 2023-10-02 191641.png>)](<doc/images/Screenshot 2023-10-02 191641.png>)
and create new app specific password and replace `<USER_PASSWORD>` with that new password.
- Step 8: Replace `<SERVICE_PROVIDER>` with the service provider you wish to use and in this case **smtp.gmail.com** is used.
- Step 9: Replace `<SERVER_BASE_URL>` with **localhost:3000**
- Step 10: To execute this project on localhost run command: 
    ```sh
    yarn start:dev
    ```
