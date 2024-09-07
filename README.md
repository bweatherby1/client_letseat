# React/Next.js Django Auth Template

## Topics
- [Get Started](#getting-started)
- [Starting the Project](#starting-the-project)
___
## Getting Started
### Use Template
#### 1. To get started, click the GREEN "Use this Template" button at the top of the repo
<img width="915" alt="Screen Shot 2022-07-06 at 12 54 01 PM" src="https://user-images.githubusercontent.com/29741570/177612998-4aac9237-5a1e-4f13-8ae0-468587521564.png">

#### 2. Make sure YOUR github account is selected in the dropdown and name your project
<img width="763" alt="Screen Shot 2022-07-06 at 12 54 48 PM" src="https://user-images.githubusercontent.com/29741570/177613126-dd38f678-7553-4f27-8a4a-75680f14d71e.png">

#### 3. Clone your new repo to your local machine
#### 4. Go to the **NEXT** section

## Starting the Project
1. Create a Firebase project and set up authentication. Use [these videos](https://vimeo.com/showcase/codetracker-firebase) as a refresher if needed.
1. Create a `.env` file at the root of the project
1. Copy/Paste the contents of the `.env.sample` file to your newly created `.env` file.
1. Copy over all of your Firebase values into the `.env` file.
1. Open the `package.json` file and change the `name` property to the name of your application, and `author` to  your name.
1. From your command line, be in the root directory and run `npm install` OR `npm i` for short.
1. Next, run `npm run prepare`. This command sets up husky to track eslint errors on commit that will make your deploy fail on Netlify.
1. To start your application, run `npm run dev`. THIS IS THE COMMAND YOU WILL USE TO RUN YOUR DEVELOPMENT SERVER FROM NOW ON.
1. Open [http://localhost:3000](http://localhost:3000) with your browser.

### If you see this, you are set to go!
<img width="450" alt="Screen Shot 2022-07-06 at 1 07 27 PM" src="https://user-images.githubusercontent.com/29741570/177615077-9b6a75bc-0260-4d29-bb88-bd95a3140687.png">


You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

**NOTES:** 





## LETS EAT!!
Let's Eat is an application designed to solve the problem of where to eat in the simplest way possible, WITH A SPINNER!!!!
In the application a user can combine with another users selected restaurants and lets the Spinner spit one out for you to both accept or reject.

## ERD

https://dbdiagram.io/d/Lets-Eat-66ba16668b4bb5230ee36c56
![Let's Eat (2)](https://github.com/user-attachments/assets/52901b36-a751-435a-9a74-ee40788a9867)


## Wireframe

https://miro.com/app/board/uXjVKK0JvAU=/
![Screenshot 2024-09-03 174222](https://github.com/user-attachments/assets/d8bfe7e8-e775-46f6-b060-d0408c376bd8)





## Deployed Link


## Project Board
https://github.com/orgs/bweatherby1-let-s-eat/projects/1

This link is for the project board for the back end of the "Let's eat" application, it will include the simple to do's for this repo.

## User Description
In this application the user will have a username and password to login with, where they will be able to add restaurants to the database, edit their own added restaurants, select/deselect restaurants from the entire database for their spinner, spin for a random restaurant, add other users choices to that spinner, and give a 'yes' or 'no' for the restaurant spit out by the spinner.

## Postman Documentation

Full CRUD for Spinners, Users, Categories, and Restaurants.

Categories - [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/29723472-0063ce35-8db4-4c42-a60b-4e911a38baa5?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29723472-0063ce35-8db4-4c42-a60b-4e911a38baa5%26entityType%3Dcollection%26workspaceId%3D962c356d-e65c-4d78-a0f5-fe0c9d4cecf9)

Restaurants - [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/29723472-1a212c47-fa7d-4f1c-9996-49c9ef6c55b1?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29723472-1a212c47-fa7d-4f1c-9996-49c9ef6c55b1%26entityType%3Dcollection%26workspaceId%3D962c356d-e65c-4d78-a0f5-fe0c9d4cecf9)

Spinners - [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/29723472-f3d9dd21-982d-447a-8940-acd968d8ffb7?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29723472-f3d9dd21-982d-447a-8940-acd968d8ffb7%26entityType%3Dcollection%26workspaceId%3D962c356d-e65c-4d78-a0f5-fe0c9d4cecf9)

Users - [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/29723472-a0335fb6-2d24-482b-bcb1-a1f5776237c3?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29723472-a0335fb6-2d24-482b-bcb1-a1f5776237c3%26entityType%3Dcollection%26workspaceId%3D962c356d-e65c-4d78-a0f5-fe0c9d4cecf9)


## Tech Stack/contributions

Python

Django

Postman

NSS BE Py/Django template

## Loom - Postman Documentation

https://www.loom.com/share/49849ad36a314d1394f0e49b4aada101

- If you see the following error, you did not follow all the setup steps correctly and failed to add your Firebase creds. Go back and do that NOW.

<img width="1043" alt="Screen Shot 2022-07-06 at 11 18 45 AM" src="https://user-images.githubusercontent.com/29741570/177612501-c2628f18-4bbd-4de9-aae6-27ffba1172d6.png">
        
## Learn More about Next.js
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
