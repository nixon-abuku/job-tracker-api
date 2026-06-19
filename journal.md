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