
 This is the back end part for a centralized online system for a recently accredited university known as CorpU, which will enhance and simplify the hiring process for sessional staff each semester which could be quite hectic for permanent staff to manage due to the complexity and time-consuming process involved.
Node JS and TypeScript are using for this development.

# *Features*
>User authentication and authorization
>CRUD operations for tasks
>User account management

# *Technologies Used*
Node.js
Express
MongoDB

# *Getting Started*
To run the TIP Backend locally, you will need to have Node.js and MongoDB installed on your machine. Then, follow these steps:

1.Clone the repository:
[GitHub Pages](git clone https://github.com/JKirito/tip_backend.git).

2.Navigate to the project directory:
cd tip_backend

3.Install the dependencies:
npm install

4.Start the development server:
npm run dev

This will start the server on http://localhost:8000 using nodemon, which will automatically reload the server whenever changes are made to the code.

5.Create a .env file in the project root directory with the following environment variables:
PORT=8000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret key>
 
6.You can now test the API endpoints using a tool such as Postman or curl.
 
# *Deployment*
 To deploy the TIP Backend to a production server, you can use a platform such as Heroku or AWS Elastic Beanstalk. You will need to set the environment variables mentioned above in the server configuration.
 
 # *Contributing*
 
 Contributions to the TIP Backend are welcome! If you find a bug or have an idea for a new feature, please open an issue or submit a pull request.
 
 
 
 


 
