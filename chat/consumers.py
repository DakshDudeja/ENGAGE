from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):

    #Triggerred when client connects to a consumer
    async def connect(self):                             
        self.room_group_name = 'Test-Room'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    #Triggerred when client disconnects to a consumer
    async def disconnect(self, close_code):                 
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        print('Disconnected!')
  
    async def receive(self, text_data):
        receive_dict = json.loads(text_data)
        message = receive_dict['message']
        action = receive_dict['action']

        if (action == 'new-offer') or (action == 'new-answer'):
            # In case its a new offer or answer
            # Send it to the new peer or initial offerer respectively

            receiver_channel_name = receive_dict['message']['receiver_channel_name']

            # Set new receiver as the current sender
            receive_dict['message']['receiver_channel_name'] = self.channel_name

            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'type':'send.sdp',
                    'receive_dict':receive_dict
                }
            )

            return
       
        # Set new receiver as the current sender
        # So that some messages can be sent
        # To this channel specifically
        receive_dict['message']['receiver_channel_name'] = self.channel_name


        # Send to all Peers
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'send.sdp',
                'receive_dict':receive_dict
            }
        )

    async def send_sdp(self,event):
        receive_dict = event['receive_dict']

        await self.send(text_data = json.dumps(receive_dict))