# INFO30005-2019-Go-Blox

Repository for team Go-Blox
Written by Nicola, Raisa, Daphne and Jansen

GET PEOPLE SOCIALIZING

## FUNCTIONALITIES
All functionalities listed below are using the mongooseController.js as their controller to interact with the database.

### Create member (sign up page)
Create member functionality allows users to create their own account to be able to access the other functionalities. They are to input some personal information, a description of themselves and can create customised interest tags. After the form is filled in, an email would be sent to the user’s email address  for verification.

Models: Member

Routes: /members/register, /members/signup, /members/verify

Views:  signup.pug, profileTags.pug


### Log in

Users are able to login after verifying their email. Login involves inputting the user’s username and password. Allows users to use more of the website’s functionality.

Models: Member

Routes: /members/authenticate, /members/logout, /members/login, /members/storeInfo

Views: login.pug

### Find members

Users are are able to search other users by searching a keyword that match with their username, first name, or last name. This is allows users to follow other users and track what they are doing.

Models: Member

Routes: /members/userProfile, /members/profile/:user, /members/followUser, /members/unfollowUser, /members/searchUser

Views: profile.pug

### Update member (settings)
#### Update images
Users are able to change their profile picture which is displayed in their profile. This is to give the profile a page abit of personal touch that the user wants.
#### Update password
Users can change their password at any time via the profile page. This is in case if their original password is in danger, or is hard to memorize.
#### Update interests
Users can add or remove interests which is similar to tags for events. This is a quick way for other users to see what you like.
#### Update description
Users can change what they want to display in their profile page. This adds a level of personality which any users can appreciate.

Models: Member

Routes: /members/updatePassword, /members/updateUser, /members/userProfile

Views: profile.pug

### Add event
Users are able to create and add an event to the database. They fill in the various details about the event, while also being able to add customised tags so that their event can be more likely to appear in future searches.

Models: Events

Routes: /events/addEvent, /events/createEvent

Views: createEvent.pug

### Get event
When a user searches for an event, the user can get results based on 3 ways: through looking through a map,  by searched keywords or by tags.
#### By map
Users can look around the map for markers that indicate an event a specific location. They can then click on the markers to see a popup, which they can click to an event details page.
#### By text
Users can search up keywords in the search bar, which can allow users to look up events that includes the keywords.
#### Filtered by tags
Users can further filter their searches by clicking on the tags that would narrow their searches by showing only those that have that tag.

Models: Events

Routes: /events/getEvent/:id, /events/findEvent, /events/getEvent, /events/getEventById

Views: homeMap.pug, maps.pug, loadEvents.pug, loadEventsFirst.pug, eventDetails.pug

### Join Events
In the event detail page users can join events. Once they joined events, user can see events in their profile that they joined (under the events tag). The organizer of the event can see the list of users who joined the events. Users cannot join an event that happened in the past. Users can also unjoin an event.

Models: Events

Routes: /events/joinEvent, /events/declineEvent, /events/addUser/:name

Views: eventDetails.pug, profile.pug

### Add places
#### Add category
Each place is associated with one category which is done during place creation. This is to make searching specific places easier for the user.

Models: Places

Routes: /places/addPlace, /places/createPlace

Views: createPlace.pug

### Get places
When a user searches for an places, the user can get results based on 3 ways: through looking through a map,  by searched keywords or by categories.
#### By map
Users can look around the map for markers that indicate a place’s specific location. They can then click on the markers to see a popup, which they can click to a place details page.
#### By text
Users can search up keywords in the search bar, which can allow users to look up places that includes those keywords.
#### Filtered by Category
Users can further filter their searches by selecting a category to narrow their searches by showing only places in those categories.

Models: Places

Routes: /places/getPlaces, /places/getPlace/:id, /places/getPlacesByCategory

Views: loadPlaces.pug, loadPlacesFirst.pug, placeDetails.pug, map.pug, homeMap.pug

### Bookmark places
Users can bookmark places that they wish to visit. This is through clicking on the the bookmark button on the places page, and they can view their bookmarks under the bookmark option in their profile page.

Models: Members

Routes: /members/bookmark, /members/stopBookmark

Views: placeDetails.pug, profile.pug

### Add ratings
Users can add ratings through by adding a description and give a rating by selecting the number of stars (out of 5). They can then press submit, and it will be placed.

Models: Ratings

Routes: /ratings/addRating

Views: eventDetails.pug

### Get ratings
Users are able to see their own and other ratings from users. This is so users can delete their own ratings and see other people’s opinion on an event.

Models: Ratings, Events

Routes: /events/getEvent/:id

Views: eventDetails.pug

### Delete ratings
Users are able to delete their own reviews that they have posted on any place or event. This can be done through selecting the ratings option on their own profile and clicking the cross beside each rating.

Models: Ratings, Events

Routes: /ratings/deleteRating/:id

Views: profile.pug



_________________
OUR PROGRESS

DELIVERABLE 3:

Currently there are 16 RESTful routes for our 3 core functionalities,
- Create Events
- Get User (get member) 
- Search Events (get events by tag)

However, we added more routes for other functionalities including:
- Create user
- Update member
- Delete member
- Add event
- Get event by name
- Update event
- Delete event
- Add places
- Get places
- Update place
- Delete place
- Add ratings
- Get rating


Currently all routes that involves requesting and deleting data are data from a separate file called db.js.

All routes that involves adding data are added to the group's MLab. Routes for updating data are the data in the MLab.

The first core functionality is about the user. The functionality consists of:
  - user signup
  - user login
  - user profile

Temporarily, the website starts at user login, a failed login will open a failure page. A successful login will open the user profile of that particular user. The database is stored in mLab. The user profile page is currently just a template but it does display the sign up information of that user. A button in user login will open the signup page where the user must fill in their information. Any errors such as leaving blank spaces, improper email, or incorrect password typed will open a failure page. Otherwise it will send the json page of that user meaning it is stored inside mLab.


__________________________
DELIVERABLE 4: 

We have successfully implemented the front and back-end of our three original functionalities:

1. Get user (get member), which includes:
    - Sign Up
        - enter their details
        - upload profile picture
        - add their interest
    - Login
    - get the user’s profile page
    - display their data

First, the user will be directed to the login page, where if they don't have an account, they must create a new account. Once they've filled in their details and created their new account, they will be sent an email confirmation tp confirm their account has been made. Then they will be directed to a login page, where they can now see their profile with the details they've entered from signing up. They can also upload their profile picture and add their interests.

2. Search Events based on tags which includes:
    - Search events by name
    - Filter events by tag

From their profile page, the user have access to the find events from the menu bar on the top left corner. They can search the name of the event they want to attend and the search page will display a list of events. They can also filter the list of events by tags and only the events with the corresponding tag will show.

3. Create events which includes:
    - Create Event
    - Go to the created event page to see the details

The user also has access to create a new event from their profile page using the menu bar on the left of the screen. First they must fill in the details about the event (time, date, place, organizer, pictures). Then they can create their new event and they can search their event in the search page and see the details they've entered.

Other functionalities with their front end and back end done includes:
4. Add ratings and reviews
5. Maps
6. users can add events their interested in to their profile page
7. Join user (a button on the event page and their response is recorded in the database)

We also started developing the front end on some pages including: 
- about page
- home page: which will direct new users to create a user account and login.

Some backend functionalities we've created: