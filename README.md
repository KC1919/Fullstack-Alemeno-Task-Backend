#Backend Deployment

https://alemeno-api-backend.onrender.com

#Authentication APIs

#Login
https://alemeno-api-backend.onrender.com/auth/login

takes email and password as input.

#Register
https://alemeno-api-backend.onrender.com/auth/register
takes Name, Email, Password as input

#Logout

https://alemeno-api-backend.onrender.com/auth/logout

#Course APIs

#Fectch all courses
https://alemeno-api-backend.onrender.com/course/allCourses

#Fetch detail of a particular course
https://alemeno-api-backend.onrender.com/course/api/{course_id}

course_id = pass course id of the course

#Search course
https://alemeno-api-backend.onrender.com/course/search?search=value&filter=value

takes search and value as query parameters

#Student APIs

#Enroll student in a course
https://alemeno-api-backend.onrender.com/student/enroll

takes course id as a body parameter

#Mark course completed
https://alemeno-api-backend.onrender.com/student/updateStatus

takes course id as body parameter

#Fetch enrolled courses
https://alemeno-api-backend.onrender.com/student/enrolledCourses


Dockerized the whole application along with the database(MongoDb) and deployed it on a web server
Used cachijg for quick response from the server. Used the node-cache module of node js.

Used JsonWebToken for authentication and aurhorization also madr use of the cookies for access to protected routes.


