# INFO30005-2019-Go-Blox

Repository for team Go-Blox
Written by Nicola, Raisa, Daphne and Jansen

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

Deliverable 4

We have successfully implemented the front and back-end of our three original functionalities:

1. Get user (get member), which includes:
    - Sign Up
    - Login
    - get the user’s profile page
    - display their data
2. Search Events based on tags which includes:
    - Search events by name
    - Filter events by tag
3. Create events which includes:
    - Create Event
    - Go to the created event page to see the details

Other functionalities with their front end and back end done includes:
4. Add ratings and reviews
5. Join events
6. …

We also started developing the front end on some pages including: 
- about page
- home page: which will direct new users to create a user account and login
- …
