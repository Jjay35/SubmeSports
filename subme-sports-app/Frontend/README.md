# Packages installed (will be updated to include more packages)
- Tailwind css v3.3.2
- nativewind
- react native paper UI library
- Clerk expo (used for authentication)

# Installation and setup
1. Make sure node js is installed on your local machine
2. Run the "npm install" command to install packages and dependecies for this project
3. Once packages are installed, run the expo program via the "npm start" command
4. Since Clerk has been added as a form of authentication, a .env file has to be created locally on your development pc (Ask Andy about this for more information), failing to add a .env file with the CLERK KEY will cause compilation issues.

# Running via mobile devices
1. Install the expo app on your IOS or android devices
2. Run the program via the "npm start" command
3. Scan QR code displayed in the terminal and the application will be displayed on your intended device

# High level layout of folder structure
1. App directory contains the screens for the application
2. App directory contains 2 main folders, auth and public
    - auth folder contains screens that user can see after log in
    - public folder contains logic for screens that deals with authentication



