![Node.Js](https://img.shields.io/badge/node.js-2210w0?style=for-the-badge&logo=node.js&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MONGODB](https://img.shields.io/badge/mongodb-%23E34F26.svg?style=for-the-badge&logo=mongodb&logoColor=ffdd54)
![NODEMAILER](https://img.shields.io/badge/nodemailer-%23E34F26.svg?style=for-the-badge&logo=node.js&logoColor=ffdd54)

# Auth_API
This is an authentication Api. 

## Description
- This authentication Api test the main functionlities of creating account, assigning roles to users, protecting user access based on the user role in the system with the use of jwt(jsonwebtoken), hashing of user password to protect user information using bcrypt and password recovery. more functionality to aid this task involves using of sessions to keep the user logged in at will and logging out.

## How it Works
- To access the system, user has to create account and choose its role, the system accepts specified roles which include ['admin', 'manager', 'staff', 'users'], these roles are been strictly verifed to avoid unauthorized user accessing sensitive information, the Admin is the first user been created and has all the available access to the system, the Manager role is a sensitive role that the manager creates an account and on creation will include a request in the request model, then the admin has the access through the request list to verify the manager account to be used,the staff account has to be verifed either by the admin or the manager for their account to be used, while the user receives a verification email to verify is account through link sent.

## Access per roles

`Register` ['admin', 'manager', 'staff', 'users'].

`Login` ['admin', 'manager', 'staff', 'users'].

`verify account` ['admin', 'manager', 'staff', 'users'].

`forget password` ['admin', 'manager', 'staff', 'users'].

`verify password` ['admin', 'manager', 'staff', 'users'].

`approve manager` ['admin'].

`approve staff` ['admin', 'manager'].

`add blog` ['admin', 'manager'].

`update blog` ['admin', 'manager', 'staff'].

`delete blog` ['admin', 'manager'].

`request list` ['admin', 'manager'].

`blog list` ['admin', 'manager', 'staff', 'users'].

`logout` ['admin', 'manager', 'staff', 'users'].

## Tech Stack

**Server:** Javascript language, Node.js framework, MONGODB


## Features

`SignUp` Enables users to register with their  email, fullname, mobile, gender, password and role.

`Login` Accesses user details and enables authenticated users to gain full access to the platform.

`Verify account` Allows users to verify their account for use, by obtaining the link sent to their gmail to verify.

`Forget password` Allows users to activate a recovering link to chnage their password to be sent to their mail.

`Verify password` Allows users to change their account password if forgotten, by providing the new password.

`Approve manager` Enables authenticated users as an admin to verify an account created as a manager account.

`Approve staff` Enables authenticated users as an admin or manager to verify an account created as a staff account.

`Add blog` Enables authenticated users as an admin or manager to insert a blog post to the system.

`Update blog` Enables authenticated users as an admin, manager or staff to update a blog post already created in the system.

`Delete blog` Enables authenticated users as an admin or manager to delete a blog post already created in the system.

`Delete blog` Enables authenticated users as an admin or manager to delete a blog post already created in the system.

`Request list` Enables authenticated users as an admin or manager to view all the request list of the manager and staff already created in the system.

`Blog list` Enables authenticated users as an admin, manager, staff or users to view all the blog post already created in the system.

`Logout` Enables authenticated users to be logged out of the system.



## Available Routes
  You can test with these routes:
  
  1. `localhost:3000/api/v1/login` `body{ email and password }` : `POST`
  
  2. `localhost:3000/api/v1/register` `body{ email, fullname, mobile, gender, password and role }` `POST`
  
  3. `localhost:3000/api/v1/verify/account/:id` `params{ userId }` `POST`
  
  4. `localhost:3000/api/v1/forget/password` `body{ email }` `POST`
  
  5. `localhost:3000/api/v1/verify/password` `params{ id } && body{ newPassword and confirmPassword }` `POST` 
  
  6. `localhost:3000/api/v1/approve/managers` `body{ userId }` : `POST`
  
  7. `localhost:3000/api/v1/approve/staff` `body{ userId }` : `POST`
  
  8. `localhost:3000/api/v1/add/blog` `body{ title, description }` `POST`

  9. `localhost:3000/api/v1/update/blog` `body{ description, blogId }` `PATCH`
 
  10. `localhost:3000/api/v1/delete/blog` `body{ blogId }` `DELETE`
  
  11. `localhost:3000/api/v1/list/request` `GET`

  10. `localhost:3000/api/v1/list/blog` `GET`
  
  11. `localhost:3000/api/v1/logout` `POST`
  
## Available Routes

#### Create Account
<img src="https://www.linkpicture.com/q/register_5.png" width="500" height="200">





