# ENGAGE

## Stack Used :
React -Frontend (folder named -Teamsfront)\
Django and JS - Backend
 
## TO RUN APPLICATION (DJANGO)
```bash
Installation: Go to your desired folder.

Run the command: git clone https://github.com/Tauhid-UAP/django-channels-webrtc.git

Go to the directory with requirements.txt.

Run the command: python -m venv venv

After a venv directory is created, run the command for windows: venv\Scripts\activate.bat run the command for Unix or MacOS: source venv/bin/activate

Install the dependencies by running the command: pip install -r requirements.txt

To start the development server, run the command: python manage.py runserver

Copy and paste this link on your browser https://127.0.0.1:8000/

Once the page is loaded, type a username and click join room from each device. Be sure to use different usernames for now.
```

## DEMO LINK 

https://youtu.be/VCaXJaio-9A

## AGILE METHODOLOGY :

Daily scrum - 15 mins\
->What did you do yesterday?\
->What are you going to do today?\
->any blockers?

Retrospective-\
->What did we do well\
->What has to improve\
->What need to stop

Sprint (4 weeks)

Week 1\
-Documented the structure of an Video Calling Application.\
-Explored different open source libraries, SDK such as WebRTC, Jetsy, Agora and Twilio used for Video Calling services.\
-Traversed over different documentations of API, SDK and Libraries.\
-Chose WebRTC and Read about it's connection requests.

Week 2\
-Dived into MS teams documentation and learnt about structure and design of different features.\
-Learned React from it's documentation, Youtube Videos and designed an basic app for testing.\
-Tried to Build UI for Teams Clone app.\
-Added an ``Extra Feature`` of News (which gets updated after every hour) and deployed on Heroku and added in My App.

Week 3\
-Started building the Video Functionality of the app\
-Used Django and Javascript for the same.\
-Achieved the Minimum functionality of the Program.\
-Expanded the peer to peer connection to N number of Participants.\
-Added the Chat functionality with the meeting room

Week 4\
-Connected React app with the Django backend app.\
-New functionality announced was already added .\
-Tried adding Screen sharing , but was not able to resolve the error on time.\
-Tried Deploying on Heroku but due to lack of implementation of STUN/TURN server it was not able to deploy.\
-Explored Microsoft Azure Communication , learnt about swift deployment and it's features.


## APPLICATION
#Interface (video+chat)

![image](https://user-images.githubusercontent.com/61489137/125316563-dcbc8600-e355-11eb-995c-807af92deee5.png)

# 2 Participants in a Call

USER 1

![image](https://user-images.githubusercontent.com/61489137/125318089-29549100-e357-11eb-9fc6-f9bc9b8c509c.png)

USER 2

![image](https://user-images.githubusercontent.com/61489137/125318357-6456c480-e357-11eb-9ec2-cca4751ed3cf.png)


# 3 participants in a Meet 

Daksh

![image](https://user-images.githubusercontent.com/61489137/125317738-dd095100-e356-11eb-90aa-86e6c77f0841.png)


Yash

![image](https://user-images.githubusercontent.com/61489137/125317219-73894280-e356-11eb-8a20-d665bbd04860.png)


# NEWS FEATURE
![image](https://user-images.githubusercontent.com/61489137/125207593-cefdf680-e2aa-11eb-8755-3759329c74f4.png)

![image](https://user-images.githubusercontent.com/61489137/125318490-82bcc000-e357-11eb-8c41-0b0ad998c54a.png)


## Methodoly used while implementing Feature (WebRTC) :

Session Description Protocol (SDP): Information about a peer that the other peer needs in order to make p2p connection.

![image](https://user-images.githubusercontent.com/61489137/125315246-8bf85d80-e354-11eb-8692-54b29bcd8407.png)
![image](https://user-images.githubusercontent.com/61489137/125315316-9f0b2d80-e354-11eb-8016-49c50e178df9.png)


1. Peer joins room.
2. Sends message to all other peers indicating its entry.
3. All other peers get notified of new peer through message sent.
4. Each existing peer initiates peer connection with new peer (offer).
5. New peer receives each offer sdp.
6. New peer sends response (answer sdp) for each offer sdp.
7. Other peers receive respective answer sdps .
8. New peer connected with each existing peer (mesh).

