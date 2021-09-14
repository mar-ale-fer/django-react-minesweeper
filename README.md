# django-react-minesweeper

## Priority and order of tasks:
The priority is to reveal the risks early. The first tasks for me are the riskiest.
* First, quarantine a backend with REST Services an authentication
* Second, to have a basic front end connected with the REST Endpoints (Security, CRUD)
* Third, to create the game logic.
* Final, deploy

## Technologies and libraries
* Backend: Django, Django Rest Framework, Django Token Authentication
* FrontEnd: React.js, Axios, styled-components
* Cloud infrastructure: 
    * Backend in a DigitalOcean Droplet with Nginx and gUnicorn
    * Frontend using AWS Amplify with a basic CI/CD schema based on a GitHub repo.

## Instructions for use the application
1.  Create a user with de Signup option.
2.  After created, the user is redirected to the Games page.
3.  Create a game
4.  In the list of game, select the newly created game, clic on the link with text like "Play game #13"
5.  The user is redirected to the Board, and can play!
6.  The match is saved in every action of the user. Al all times the user can leave the game, closing the brower tab, or going back in the browser, or using the "Games" option in the upper left corner.
7.  Back on the game list, the user can play another game. Also can delete a game.

## Bug
In the signup, please use a Medium level password, like Marcelo12345, as the weak password error catch is missing.

## Test the game!!
https://main.drvznpngbg4y4.amplifyapp.com/
