console.log('In main.js');

// Mapp Peer Usernames to Corresponding RTCPeerConnections as Key Value Pairs
var mapPeers = {};

var labelUsername = document.querySelector('#label-username');
var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

var username;
var webSocket;

// Local Video Stream
var localStream = new MediaStream();

const constraints = {
    'video':true,
    'audio':true
};

// Buttons to Toggle self audio and video
const localVideo = document.querySelector('#local-video');
const btnToggleAudio = document.querySelector('#btn-toggle-audio');
const btnToggleVideo = document.querySelector('#btn-toggle-video');

//Initiate Websocket Connection
btnJoin.addEventListener('click',() =>{
    username = usernameInput.value;

    console.log('username: ',username);

    if(username == ''){
        return;
    }
    usernameInput.value = '';
    usernameInput.disabled = true;
    usernameInput.style.visibility = 'hidden';

    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = 'ws://';

    if(loc.protocol == 'https:'){
        wsStart = 'wss://';
    }
    
    var endPoint = wsStart + loc.host + loc.pathname;

    console.log('endPoint: ',endPoint);

    webSocket = new WebSocket(endPoint);

    webSocket.addEventListener('open',(e) => {
        console.log('Connection opened !');

        // Notify other peers
        sendSignal('new-peer',{});
    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('close', (e) => {
        console.log('Connection closed !');
    });
    webSocket.addEventListener('error',(e) => {
        console.log('Error Ocurred !');
    });

});


function webSocketOnMessage(event){
    var parsedData = JSON.parse(event.data);
    
    var peerUsername = parsedData['peer'];
    // Username of other peer

    var action = parsedData['action'];

    if(username == peerUsername){
        return;
    }

    // Channel name of the sender of this message
    // Used to send messages back to that Sender
    // Hence, receiver_channel_name
    var receiver_channel_name = parsedData['message']['receiver_channel_name'];


    // In case of New Peer
    if(action == 'new-peer'){

        // Create new RTCPeerConnection
        createOfferer(peerUsername , receiver_channel_name);
        return;

    }

    if(action == 'new-offer'){

        //Create new RTCPeerConnection
        //Set offer as remote description   
        var offer = parsedData['message']['sdp'];
        createAnswerer(offer ,peerUsername,receiver_channel_name);

        return;
    }
    if(action == 'new-answer'){

        // In case of answer to previous offer
        // Get the corresponding RTCPeerConnection
        // Get the answer
        var answer = parsedData['message']['sdp'];

        var peer= mapPeers[peerUsername][0];

        peer.setRemoteDescription(answer);

        return;
    }
}

var userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
        localVideo.muted = true;

        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        // Unmute audio and video by default
        audioTracks[0].enabled=true;
        videoTracks[0].enabled = true;

        btnToggleAudio.addEventListener('click',() => {
            audioTracks[0].enabled = !audioTracks[0].enabled;

            if(audioTracks[0].enabled){
                btnToggleAudio.innerHTML = 'Audio Mute';

                return;
            }

            btnToggleAudio.innerHTML = 'Audio Unmute';
        });

        btnToggleVideo.addEventListener('click',() => {
            videoTracks[0].enabled = !videoTracks[0].enabled;

            if(videoTracks[0].enabled){
                btnToggleVideo.innerHTML = 'Video Off';

                return;
            }

            btnToggleVideo.innerHTML = 'Video On';
        });

    })                                                                                         
    .catch(error => {
        console.log('Error accessing media devices.',error);
    });

    var btnSendMsg = document.querySelector('#btn-send-msg');
    var messageList = document.querySelector('#message-list');
    var messageInput = document.querySelector('#msg');
    btnSendMsg.addEventListener('click', sendMsgOnClick);

function sendMsgOnClick(){
    var message = messageInput.value;
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('Me: '+ message));
    messageList.append(li);

    var dataChannels = getDataChannels();

    message = username + ': ' + message;

    for(index in dataChannels){
        dataChannels[index].send(message);
    }
    messageInput.value = '';
}


btnSendMsg.addEventListener('click', sendMsgOnClick);


// Send the given action and message
// Over the websocket connection
function sendSignal(action,message){
    var jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message,
    });

    webSocket.send(jsonStr);
}

// Create RTCPeerConnection as Offerer
// and store it and its Data Channel
// Send sdp to remote peer after gathering is complete
function createOfferer(peerUsername, receiver_channel_name){
    
    var peer = new RTCPeerConnection(null);

    // Add local user media stream tracks
    addLocalTracks(peer);
    
    // Create and Manage an RTCDataChannel
    var dc = peer.createDataChannel('channel');
    dc.addEventListener('open', () => {
        console.log('Connection opened!');
    });
    dc.addEventListener('message',dcOnMessage);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, remoteVideo);

    // Store the RTCPeerConnection
    // and the corresponding RTCDataChannel
    mapPeers[peerUsername] = [peer, dc];

    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState;

        if(iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];

            if(iceConnectionState != 'closed'){
                peer.close();
            }

            removeVideo(remoteVideo);
        }
    });

    peer.addEventListener('icecandidate', (event) => {
        if(event.candidate){
            console.log('New ice candidate: ', JSON.stringify(peer.localDescription));

            return;
        }

        sendSignal('new-offer' , {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        }); 
    });
    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(() => {
            console.log('Local Description set Successfully. ');
        });
}

// Create RTCPeerConnection as answerer
// and store it and its datachannel
// Send sdp to remote peer after gathering is complete

function createAnswerer (offer,peerUsername,receiver_channel_name){
    var peer = new RTCPeerConnection(null);

    addLocalTracks(peer);
    
    //Set Remote Video
    var remoteVideo = createVideo(peerUsername);
            
    // and Add tracks to remote video
    setOnTrack(peer, remoteVideo);


    peer.addEventListener('datachannel', e => {
        peer.dc = e.channel;
        peer.dc.addEventListener('open', () => {
            console.log('Connection opened!');
        });
        peer.dc.addEventListener('message',dcOnMessage);

        // Store the RTCPeerConnection
        mapPeers[peerUsername] = [peer, peer.dc];
    });

   
    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectionState = peer.iceConnectionState;

        if(iceConnectionState === 'failed' || iceConnectionState === 'disconnected' || iceConnectionState === 'closed'){
            delete mapPeers[peerUsername];

            if(iceConnectionState != 'closed'){
                peer.close();
            }

            removeVideo(remoteVideo);
        }
    });

    peer.addEventListener('icecandidate', (event) => {
        if(event.candidate){
            console.log('New ice candidate: ', JSON.stringify(peer.localDescription));

            return;
        }

        // Send answer to offering peer
        // After ice candidate gathering is complete
        sendSignal('new-answer' , {
            'sdp': peer.localDescription,
            'receiver_channel_name': receiver_channel_name
        }); 
    });
    
    peer.setRemoteDescription(offer)
        .then(() => {
            console.log('Remote Description Set Successfully for person %s.',peerUsername);

            return peer.createAnswer();
        })
        .then(a => {
            console.log('Answer Created!');

            peer.setLocalDescription(a);
        })
}

function addLocalTracks(peer){
    localStream.getTracks().forEach(track =>  {
        peer.addTrack(track, localStream);

    });

    return;
}

var messageList = document.querySelector('#message-list');

function dcOnMessage(event){
    var message = event.data;

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);
}

// For every New Peer
// Create a new video element
// and its corresponding user gesture button
// Assign ids corresponding to the username of the remote peer
function createVideo(peerUsername){
    var videoContainer = document.querySelector('#video-container');

    // create the new video element
    // and corresponding user gesture button
    var remoteVideo = document.createElement('video');

    remoteVideo.className = "opclass";

    remoteVideo.id = peerUsername + '-video';
    remoteVideo.autoplay = true; 
    remoteVideo.playsInline = true;

    // wrapper for the video and button elements
    var videoWrapper = document.createElement('div');

    // add the wrapper to the video container
    videoContainer.appendChild(videoWrapper);

    // add the video and button to the wrapper
    videoWrapper.appendChild(remoteVideo);

    return remoteVideo;
}

// Set onTrack for RTCPeerConnection
// To add remote tracks to remote stream
// To show video through corresponding remote video element
function setOnTrack(peer, remoteVideo){

    // Create new MediaStream for remote tracks
    var remoteStream = new MediaStream();

    // Assign remoteStream as the source for remoteVideo
    remoteVideo.srcObject = remoteStream;

    peer.addEventListener('track',async (event) =>{
        remoteStream.addTrack(event.track , remoteStream)
    }); 
}

function removeVideo(video){
    // Get the video wrapper
    var videoWrapper = video.parentNode;
    
    // Remove it
    videoWrapper.parentNode.removeChild(videoWrapper);
}

// Get all stored data channels
function getDataChannels(){
    var dataChannels =[];

    for(peerUsername in mapPeers){
        var dataChannel = mapPeers[peerUsername][1];

        dataChannels.push(dataChannel);
    }

    return dataChannels;
}
