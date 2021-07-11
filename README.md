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

Copy and paste this link on your browser https://127.0.0.1:8000/
```


## AGILE METHODOLOGY :

Scrum - A sprint of 4 weeks

Week 1\
-Documented the structure of an Video Calling Application.\
-Explored different open source libraries , SDK such as WebRTC , Jetsy , Agora and Twilio used for Video Calling services.\
-Traversed over different documentations of API,SDK and Libraries.\
-Chose WebRTC and Read about it's connection requests.

Week 2\
-Dived into MS teams documentation and learnt about structure and design of different features.\
-Learned React from it's documentation ,Youtube Videos and designed an basic app for testing.\
-Tried to Build UI for Teams Clone app.\
-Added an ``Extra Feature`` of News(Which gets updated after every hour) and deployed on heroku and added in My App.

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

## Methodoly used while implementing Feature (WebRTC) :

Session Description Protocol (SDP): Information about a peer that the other peer needs in order to make p2p connection.

->Signalling Using( Django server) required to exchange SDPs.\
->Both peers connect to signalling servers using WebSocket.\
->After SDPs are exchanged from both sides, p2p connection can be established.\
->Signalling (Django) server not required afterwards

1. Peer joins room.
2. Sends message to all other peers indicating its entry.
3. All other peers get notified of new peer through this message 4. each existing peer initiates peer connection with new peer (offer).
5. New peer receives each offer sdp.
7. New peer sends response (answer sdp) for each offer sdp.
8. Other peers receive respective answer sdps .
9. New peer connected with each existing peer (mesh).

## APP
![image](https://user-images.githubusercontent.com/61489137/125207593-cefdf680-e2aa-11eb-8755-3759329c74f4.png)



