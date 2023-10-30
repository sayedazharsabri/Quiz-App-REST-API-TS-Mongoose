[33mcommit 1c968a32c1ec8de402869ea8c189049bb143b3d7[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Merge: dd95874 f6e1b59
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Fri Oct 27 20:47:26 2023 +0530

    chages after pulling latests commits

[33mcommit f6e1b5931e23f4653319146fae71f7cebd943a05[m
Merge: 69f3c75 028d58a
Author: Rakshit Mehta <114852204+rakshit0960@users.noreply.github.com>
Date:   Fri Oct 27 20:42:58 2023 +0530

    Merge branch 'sayedazharsabri:master' into master

[33mcommit dd958747974c6848af867294191d16483b6b2b2b[m
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Fri Oct 27 20:41:01 2023 +0530

    updated postman_collection

[33mcommit 028d58a20230f0d42280c1a23df2e0673964e638[m
Merge: 9dfe89d cf8eddb
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Fri Oct 27 20:17:42 2023 +0530

    Merge pull request #17 from Faiz0developer/changepassword
    
    Implemented password change functionality.

[33mcommit cf8eddb43821edde60c9644096daf9fe5dec6820[m
Author: Faizan Siddiqui <109781488+Faiz0developer@users.noreply.github.com>
Date:   Fri Oct 27 11:19:24 2023 +0530

    Update- Updated error message
    
    Co-authored-by: Sayed Azhar Sabri <azhar.sabri@gmail.com>

[33mcommit 93751240bae580f8eab4d33b37a2a9ac1842e8fb[m
Merge: 72383ff 9dfe89d
Author: Faizan Siddiqui <faizansiddiquirmr@gmail.com>
Date:   Thu Oct 26 21:15:26 2023 +0530

    Merge branch 'master' of https://github.com/Faiz0developer/Quiz-App-REST-API-TS-Mongoose into changepassword

[33mcommit 72383ff585af2a1e3347416a3b538e0a6d6f7a20[m
Author: Faizan Siddiqui <faizansiddiquirmr@gmail.com>
Date:   Thu Oct 26 15:46:40 2023 +0530

    replace - replace new postman file with old one

[33mcommit 4c7b5129e9f5dec675a823c14e894ece675b61ae[m
Author: Faizan Siddiqui <faizansiddiquirmr@gmail.com>
Date:   Thu Oct 26 15:30:55 2023 +0530

    Add - Added change password functionality in controller

[33mcommit d674d697b5b5a3226b5b147c60f31af7ae925946[m
Author: Faizan Siddiqui <faizansiddiquirmr@gmail.com>
Date:   Thu Oct 26 15:29:06 2023 +0530

    Add - Added changePassword route and added validation to new password

[33mcommit 69f3c7505e91010b21c1b635250dc86ab02faa7b[m
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Wed Oct 18 20:31:15 2023 +0530

    added express valation for category field

[33mcommit 80371df8173151ced0cd7bae59dcfef0c69bc3b8[m
Merge: ea1f44b 9dfe89d
Author: Rakshit Mehta <114852204+rakshit0960@users.noreply.github.com>
Date:   Wed Oct 18 19:56:14 2023 +0530

    Merge branch 'sayedazharsabri:master' into master

[33mcommit ea1f44bb336a6bae9274b24a407cb79b86428be5[m
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Wed Oct 18 19:54:22 2023 +0530

    add category as one more item in getQuiz projection

[33mcommit be6fe6db848a997559c14d65ab226a1b558a3320[m
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Wed Oct 18 19:51:02 2023 +0530

    added category as required field in request body of create quiz controller and passing catagory as one more field while creating new quiz

[33mcommit fd293b0d53ffef28b0862fd1eb92a5483ccc2844[m
Author: Rakshit Mehta <rakshit0960@gmail.com>
Date:   Wed Oct 18 19:47:16 2023 +0530

    added category field in quizSchema

[33mcommit 9dfe89d01cfe3eac3c3940840e009037ad9ba666[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sun Oct 15 16:12:03 2023 +0530

    Changed main function implementation as per ES6 rule (#14)
    
    * Removed extra validator logic from activate user route
    
    * Changed main function implementation as per ES6 rule
    
    ---------
    
    Co-authored-by: Aakarsh Verma <developer.aakarshverma@gmail.com>

[33mcommit 781b4137a2b7f766e5593de85153ed047d14e577[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Oct 2 22:48:55 2023 +0530

    Removed extra validator logic from activate user route (#13)
    
    Co-authored-by: Aakarsh Verma <developer.aakarshverma@gmail.com>

[33mcommit 0fa68e7d860c2c46860259969cbb401fe3d4d7d4[m
Author: Aarushkashyap <71922989+Aarushkashyap@users.noreply.github.com>
Date:   Mon Oct 2 20:04:04 2023 +0530

    Updated Readme  (#12)
    
    * Updated Readme files for Quiz App and it's backend folder
    
    * Changed static badges to simple links.
    
    * Changed alignment in connect

[33mcommit bc439706836781ef2c002e253f4ad98f19df3c38[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Oct 2 16:00:52 2023 +0530

    Fixed bugs and removed redundant logic (#11)
    
    * Corrected varibale names to follow camelCase and formatted the import order
    
    * Added functionality to fetch all quizzes of a user if id is not provided
    
    * Added proper http status code to response
    
    * Removed userId param from user get route
    
    * Formatted all documents
    
    * Removed dummy data from error response of get user route
    
    * Moved encryption secret to env file from code
    
    * Made isAuth async to enable it to verify if a user is active or not
    
    * Moved activate user callback to more appropriate place, from user contoller to auth controller
    
    * Updated email message sent while activating account
    
    * Added updated postman collection
    
    ---------
    
    Co-authored-by: Aakarsh Verma <developer.aakarshverma@gmail.com>

[33mcommit 52aa4f7bd1b494e163584173684644cce818359c[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Mon Sep 18 21:57:48 2023 +0200

    Seprated backend code and created a folder for frontend

[33mcommit 8468628238665bde7d11021b66d60acefee7d42e[m
Author: Aarushkashyap <71922989+Aarushkashyap@users.noreply.github.com>
Date:   Thu Sep 7 00:14:49 2023 +0530

    Resolved bugs, upgraded dependencies and added working mailer service. (#10)
    
    * Removed the .normalizeEmail() from auth route to retrieve or locate email accurately.
    
    * Upgraded all dependencies to their latest versions
    
    * Configured mongoose.connect logic with respect to the version update of mongoose
    
    * Checked for quiz possibly null through conditionals and previous comment deletion in app.ts
    
    * Checked for report possibly null through conditionals and projected error accordingly
    
    * Corrected isActiveUser if condition to implement getUser functionality and checked user routes
    
    * Changed the service parameter to host in createTransport along with nodemon and logged the messageId of the email sent for cross-checking

[33mcommit 336b6ff1b122a0bfa99305a8d6bc8aee5dfacf7e[m
Author: Sayed Azhar Sabri <azhar.sabri@gmail.com>
Date:   Fri Apr 29 18:11:29 2022 +0200

    Update README.md

[33mcommit f9fe89d2e732b7fda7a75fdba20c5436b9911a3d[m
Author: Anagha <73607059+Melon888@users.noreply.github.com>
Date:   Sat Mar 12 15:20:52 2022 +0530

    Email verification to activate a deactivated user account. (#9)
    
    * added start script
    
    * adding email verification to activate a deactivated user account
    
    * Made the requested changes
    
    * Made a separate route to deactivate and some changes
    
    Co-authored-by: Sayed Azhar Sabri <afzal.sayed26@gmail.com>

[33mcommit 356c05ebf1ad48b374713758dfb7ea97869c427c[m
Merge: 5816e60 aed879a
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Tue Mar 8 18:18:04 2022 +0100

    Merge pull request #8 from vermaaakarsh/aakarsh
    
    Aakarsh

[33mcommit aed879a4dbe6a69d55ff74bbe416344498f69031[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Mar 7 23:08:49 2022 +0530

    Added custom validator on submit exam route to check for valid attempt.

[33mcommit 7a833e578a6fa58a1a9da7bce064100e55321f82[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Mar 7 22:40:44 2022 +0530

    Removed duplicate code of validate request.

[33mcommit 10c28c2a6f71c5e1f698e90f19cf43993f70f7db[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Mar 7 22:37:21 2022 +0530

    Removed trim() from attempted question check on submit exam validator.

[33mcommit df7159ef00d77f100c8ef3dba3f2c0b8a75124bf[m
Merge: cdf430b 5816e60
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Mar 7 14:04:40 2022 +0530

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose into aakarsh

[33mcommit cdf430b913143a3c088b7a01b19c1ffd9d8c4976[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Mon Mar 7 14:04:04 2022 +0530

    Added validator on submit exam route.

[33mcommit 5816e60b65ccfb4110f52eb7b17cf67b5a298c90[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sun Mar 6 22:18:21 2022 +0100

    Added separate file to handle validation - Removed duplicate codes

[33mcommit f6ef26eb0d70daab52b3ff107fcb5751732213c0[m
Merge: 227fbc7 56c670c
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Tue Mar 1 19:21:59 2022 +0100

    Merge pull request #6 from vermaaakarsh/aakarsh
    
    Aakarsh

[33mcommit 56c670cd576818d8843dd607a23160c624e11c75[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 22:48:25 2022 +0530

    Handled duplicate name error on quiz update route.

[33mcommit fa81a6b84b654340e2ef2ec5c6036f6b20a3f8de[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 21:13:24 2022 +0530

    Handled error on quiz delete route when quiz not found and restricted republishing of the published quiz.

[33mcommit 11510c400d267aa4c131a012b8bfb6d3e200a83c[m
Merge: bcaaa17 227fbc7
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 20:06:02 2022 +0530

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose into aakarsh

[33mcommit 227fbc7e14c95f603fd9510278870a8e8558fcf4[m
Merge: 58d932b b5de827
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Tue Mar 1 07:48:24 2022 +0100

    Merge pull request #4 from vermaaakarsh/aakarsh
    
    Aakarsh

[33mcommit bcaaa17fee15f3a66a50a0525666abcfe94dc30e[m
Merge: 798055e 58d932b
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 04:33:03 2022 +0530

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose into aakarsh

[33mcommit b5de8272186219a4efca57cb14d6b5ef62ffc6ae[m
Merge: 798055e 58d932b
Author: Aakarsh Verma <54892142+vermaaakarsh@users.noreply.github.com>
Date:   Tue Mar 1 04:32:42 2022 +0530

    Merge branch 'sayedazharsabri:master' into aakarsh

[33mcommit 798055ea9361afc8e8bca7f12f4084ee7f415872[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 04:31:55 2022 +0530

    Added custom validator to check whether given answer is present in the options or not on quiz creation route.

[33mcommit c2616c425f5a24da3245f4251c852129d7134787[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 01:29:44 2022 +0530

    Added validator for unique quiz name check on quiz creation route.

[33mcommit 909058655442fd73e62bc45eb9c184d29c321dbb[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Tue Mar 1 01:09:18 2022 +0530

    Formatted every file.

[33mcommit 58d932b0829322a7e784a2afe5e5c3a3933670ca[m
Merge: 3e58c67 a709482
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Mon Feb 28 19:03:50 2022 +0100

    Merge pull request #3 from vermaaakarsh/aakarsh
    
    Aakarsh

[33mcommit a70948250991120a2062cbcccf61d6288879737f[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sun Feb 27 14:26:32 2022 +0530

    Modified rejection message while validation fail on the user registration route.

[33mcommit c0dbdff67da71c40e9d6c8eb6216a2606711cf17[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sun Feb 27 14:23:08 2022 +0530

    Removed nodemon.json from .gitignore file.

[33mcommit 34e2f1c22320630ba993a3960ef6c18dfa73e104[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sun Feb 27 14:22:04 2022 +0530

    Modified validator on the quiz creation route.

[33mcommit bf6d2305107bf77ca6943524a40fba47d66bf666[m
Merge: 2165720 3e58c67
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sun Feb 27 00:41:55 2022 +0530

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose into aakarsh

[33mcommit 3e58c67d143248283fc666b350cdff620e8ac712[m
Merge: dbe30ed d0ac098
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sat Feb 26 20:10:26 2022 +0100

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose

[33mcommit dbe30ed42ddadfa2ddb4ee0fe5d8719476f454bf[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sat Feb 26 20:10:16 2022 +0100

    Added postman collection and environment

[33mcommit 2165720ce7cc26994a616ff95903863012a6ad32[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sat Feb 26 23:33:06 2022 +0530

    Added email validator and custom password validator on login route.

[33mcommit df38498b52a41fe3af6da60b9edc3136310f231c[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sat Feb 26 14:46:05 2022 +0530

    Added custom validatior for password on registration route.

[33mcommit 307f744a387b99c45f5d35977a2b550306d9aaa0[m
Merge: 62e46a0 d0ac098
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Sat Feb 26 14:26:23 2022 +0530

    Merge branch 'master' of https://github.com/sayedazharsabri/Quiz-App-REST-API-TS-Mongoose into aakarsh

[33mcommit d0ac098e3afca850d77d67f36e77a55aa44e0c57[m
Author: Aakarsh Verma <54892142+vermaaakarsh@users.noreply.github.com>
Date:   Fri Feb 25 23:50:25 2022 +0530

    Added how to start in readme. (#2)
    
    Added commit

[33mcommit 62e46a0e4c9d5ce751cd18344533e02f4921de8b[m
Author: Aakarsh Verma <myselfmrv@gmail.com>
Date:   Fri Feb 25 23:38:52 2022 +0530

    Added how to start in readme.

[33mcommit c58d212025069017483a54ebd156308fdeea9551[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Thu Feb 24 18:31:07 2022 +0100

    Transferred interface to one place

[33mcommit 20691436edc335bac07d2d228337f348a8b5fc31[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Thu Feb 24 18:22:58 2022 +0100

    Added RequestHanlder

[33mcommit 93197951bbc70fef35eeac7c813d1409c45c2328[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Thu Feb 24 18:14:39 2022 +0100

    Added report module, renamed result to report

[33mcommit 8c25d58b2c70b3532ae00675fc0f152717414477[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Wed Feb 23 20:07:21 2022 +0100

    Added exam module

[33mcommit 1189e061882d9378ccd4d776f44cb82b1d84b5a1[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Wed Feb 23 17:35:23 2022 +0100

    Added validation over quiz route

[33mcommit 743893d763330283cf7a27f40f3b02fa8fc41118[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Mon Feb 21 18:56:36 2022 +0100

    added quiz get update delete publish functionality with authorization

[33mcommit 01991e4d6cba781db788b369f537028fad911f90[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sat Feb 19 18:45:47 2022 +0100

    Added basic structure for Quiz module

[33mcommit c93958803eb5eae9b7018182138fb5f4527cbf76[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sat Feb 19 18:01:17 2022 +0100

    added password and confirm password validation

[33mcommit 2638241383a4eca0d84578ca96c998871c80c374[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sat Feb 19 07:37:27 2022 +0100

    Added Express-Validator

[33mcommit f97d432d66d8183032b3e268ebeda7ed1a28c01c[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Fri Feb 18 17:53:54 2022 +0100

    Added express error route with custom TypeScript Error

[33mcommit d8247b74cd94ed8cae2e5c41295ed7652070f320[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Wed Feb 16 19:47:43 2022 +0100

    Break user module into auth and user, added isAuth middleware and added express routes

[33mcommit b3a450696cca91654f48b99f450023bea1c98e20[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Mon Feb 14 20:36:04 2022 +0100

    jwt, brcryptjs and login functionality added

[33mcommit 411b1e3a18a1f7b2e2626b1b7fcafeadeca9a1b4[m
Author: Sayed Azhar Sabri <afzal.sayed26@gmail.com>
Date:   Sun Feb 13 23:20:45 2022 +0530

    Initial commit with user module and mongoose integration and nodemon

[33mcommit a57aa400f90a4a5ab9bd9218c060f11bafdb97ea[m
Author: Sayed Azhar Sabri <azhar.sabri@gmail.com>
Date:   Sun Feb 13 01:56:23 2022 +0530

    Initial commit
