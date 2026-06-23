## MY ENGINEERING JOURNAL 

## DAY 1 AUDIT: 06/18/2026

### 1. What I am trying to fix/build right now:
* Rewriting the  /jobs route using official node-postgres documentation as my source and MDN JS.

## GET
## 2. WHAT I DID 
* I used await and pool.query to get the data from the jobs table in database and stored it in a variable result
* Then return the result.rows as JSON 
* Then added a error handling using try and catch

### 3. INTENTIONTIONAL BREAKDOWN 
*  I intentionally broke the code and queried from jobzzz table which does not exist in the database 
*  I then used postman to test if the error handling was working i did a get request for /jobs and i got back a 500 status code with message something went wrong meaning the problem is internal and on my side not the client side.

### POST 
### 1. WHAT I DID 
* I first assigned the incoming data requests  (req.body) to variables company, position, status
* I then validated the data using if statement to check if the required fields are missing
* If the required fields are missing error gets returned with HTTP 400 status code
* Then I used error handling with try / catch to try storing the data into the database with await & pool.query
* I used insert statement to post the data in the database and then used place holders to avoid sql injection for better security and prevent easy hacking and used returning * so i can get back and see the data that was stored and returned to me with status 201 created as json message
* If the validation passes and the post fails then i have a catch statement that will throw an error with status code 500 Internal Service error which will likely be a problem from my end rather than the user 

### 2. INTENTIONAL BREAKDOWN & TESTING 
---VALIDATION---
1. I intentionally tried to post without filling company and i got a 400 error message saying "Please fill the required fields"
--- ERROR HANDLING--
2. I intentionally typed RETURNING without '*' at the end  and tried POST request on postman and I got an error status code 500 internal service error meaning the problem is on my end not the client/user's end


### PUT 
* I assigned the incoming req.params.id into a variable id and converted it to a number since url comes in string 
* I assigned the incoming req.body.status into a variable status
* I then validated the id to check if is the right format if not then 400 status code error
* If format is valid then it continues to the  UPDATE query 
* I then added a validation to check if the job exists in the database if not then return 404 job not found 
* If job exists then the update is done and returned with status code 200
* I then added a catch incase code breaks down that tells client/postman problem is on my end with 500 status code 

### INTENTIONAL BREAKDOWN & TESTING 
* I first tried to update the  job id banana and I got an error message saying invalid job id so my validation is working correctly
* I then tried to update job id 99 which does not exist in the database I received error message 404 job does not exist
* I then tried to break down the code by mispelling return as rturn and  I received error saying Internal Service error 505 
* I then proceeded to update Job id 5 to ACCEPTED and i got the updated job details as JSON with status code 200 meaning job was updated





### DELETE 
### 1. WHAT I DID 
* I assigned the incoming req.params.id into id variable and converted it to a number since the url comes in a string 
* I then validated the id to check if it is the right format if not valid then error 400 status code
* If the format is valid then i proceed to query with DELETE command
* I then validate to check if the ID does not exist in database if it doesnt returns error 404 job not found
* If job found then it is successfully deleted
* Then I added a catch incase something breaks down tells client / Postman the problem is on my end with 500 status code

### 2. INTENTIONAL BREAKDOWN & TESTING 
* I first tried to delete job id banana and I got an error message saying invalid job id so my validation is working correctly
* I then tried to delete job id 99 which does not exist in the database I received error message 404 job does not exist
* I then decided to break the code down on the validation code mispelt status as statas then I received error saying Internal Service error
* I then proceeded to delete job id 7 which exists and i received job id Successfully deleted meaning it was deleted from the database

### ERRORS I FACED 
* After finishing on the route.put i was getting an error with 400 bad request showcasing error in html format 
* I read the errer and I saw it says reference error rq is not defined and pin pointed the line where my code broke line 72 
* I then went to my code and i looked at line 72 it looked good but thats when i looked above it and realized i didnt put req and res in my function paraameters it was just empty
* I put in the parameters and boom the put request was working 

### PROBLEM FIXED BUT NOW NEW CONCERN
* I know I have error handling in my code but this was error handling inside the routes so outside the routes if something breaks 
* The client will just get a html error that shows too much information
* My goal is to just show a simple json message if something breaks outside 

### DAY 2 06/22/2026
## 1. POST /auth/register

1. The client will send username and password
2. If the username and password are missing then status code 400 bad request please fill in the required fields
3. The password must be hashed before postgres receives it 
4. The username and hashed password should be stored in the users table 
5. Postman should receive a 201 status code and json message stating account created successfully 

### 2. WHAT I DID 
1. I imported express pool bcrypt and router
2. I then stored the req.body.username and req.body.password into variable username and password
3. I then did a validation to make sure username and password are both filled and if not filled then status code 400 with message to fill the required fields 
4. Then Inside try I hashed the password before i run the INSERT query because the original password should not be stored in the database for security
5. After the password is hashed I then ran the INSERT query using place holders to avoid sql injections 
6. Then returned the username only as json with status code 201 to confirm account created successfully
7. Then inside catch i caught error code 23505 username already  exists as HTTP status code 409
8. Else anything broke in the code it would return error 500 with json message Internal Service error meaning problem is on my side 

### 3.INTENTIONAL BREAKDOWN AND TESTING WITH POSTMAN
1. I tried to only send username field without password and I got status code 400 saying please fill all the required fields 
2. I then filled both in and got a 201created successfully  with username returned as json 
3. I then tried to refill with same username and password and got a 409 status code meaning username already exists in the database 
4. I then broke down the code by changing username inside INSERT statement to usename and i got error code 500 internal Service Error 

### ERRORS I FACED 
1. I also figured that I can create duplicate account by just having same username but one in capital one in small 
2. So i figured i need a function that will transform the incoming username from client into lowercase before the username even hits the database 
`

### DAY 3 06/23/2026
## 1. POST /auth/login

1.  Postman/Client will send username & password
2. If username and password missing then 400 status code with message please fill in required fields 
3. Then submitted username will be searched in the username column in users table 
4. Postgres returns username found so username matches 
5. If username does not exist then a 401 Unauthorized  status code with message invalid username or password  
6. If username exists then the  hashed password gets pulled from db and  bycrypt.compare is used  to compare if the password matches the hashed password in the db
7. If the bbcrypt function is false then 401 unauthorized status code with message saying "invalid username or password" 
8. If bcrypt function is true meaning password matches then a 200 ok message saying signed in 
9. Then JWT token is created as well to allow the  the user to get in  so that they dont have to provide username and password when they come again

### WHAT I DID 
1. I stored the body username and password in variable username and password
2. I then did defensive coding to check if the username and password are filled if not then 400 bad request with message 
3. I then queried the DB to pull the id, username, and hashed password from DB
4. Then defensive coding to check if the username sent by client/postman exists in DB if it doesnt then 401 status code error with message 
5. If username found then the data gets stored in variable called founduser 
6. Then I proceed to compare the password with bcrypt.compare sent with the hashed password in database
7. If password dont match then error 401 status code with message 
8. If password matched then i proceed token creation with jwt
9. I imported jwt and used jwt.sign() to create token 
10. Then a success message with status 200 and token created 

### INTENTIONAL BREAKDOWN & TESTING 
1. I tried to send a post request to /auth/login with blank username and password and i got 400 status code with message
2. I then typed a random username that doent exist in database and password and got a 401 status code with message
3. I then typed a username that exist in database but wrong password and i got a 401 status code with message 
4. I then typed a username that exist in database with the right password and i got a 200 status code with message and created token 
5. I then broke down the code intentionally by smispelling jwt.sign to jwt.sin and got 500 status code with message Internal Server error 

