# :camera: Photogram

App builded with MERN Stack, Typescript and Tailwind CSS.

- Authentication via Email
- Adding photos that are saved in the MongoDB database and on the cloudinary server
- Sending messages between users in real time using socket.io
- Redux-Toolkit to manage user data within components
- Sending notifications when other users react to posts or send message on the chat

You can see a live demo at **https://photogram-app.herokuapp.com/**

## :tipping_hand_man: About

Photogram is a free, online photo-sharing application and social
network platform which allows users to edit and upload posts.
As with other social networking platforms, Photogram users can like, comment
on and bookmark others' photos, as well as send private messages to
their friends. Photogram also allows users to make their accounts private if they don't want to share their photos with everyone!

## :clipboard: Todo

- Add Real-time notifications
- Create a ability to pin any post 

## :gear: Configuring

Before you run the project configure the .env file like on this example(just copy [.env.local](https://github.com/kacperwitkowski/Photogram-App/blob/master/.env) and fill the options with your keys.

## :package: Installing and running locally in development mode

To get started, just clone the repository and run these commands:

    git clone https://github.com/kacperwitkowski/Photogram-App.git
    npm install in the global folder & npm install in the ./frontend folder
    nodemon/node app.js in the global folder & npm run start in the ./frontend folder
