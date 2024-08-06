import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from authApp.models import Employee

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.adminId = int(self.scope['url_route']['kwargs']['admin_id'])
        # self.userId = int(self.scope['url_route']['kwargs']['employee_id'])
        self.userId = 11
        print(f"chat_{max(self.adminId ,self.userId )}")     
        self.room_group_name =f"chat_{max(self.adminId ,self.userId )}"
        print(self.adminId, self.userId )
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        message = data['message']
        senerId = data['senderId']
        recipientId = data['recipientId']

        await self.save_message(senerId,recipientId,message)
        # if recipientId  == self.get_hr_id():
        #     print(f"chat_{max(senerId,recipientId)}")
        #     await self.channel_layer.group_send(
        #         f"chat_{max(senerId,recipientId)}",
        #         {
        #         'type': 'chat_message',
        #         'message': message,
        #         'recipientId': recipientId,
        #         "senderId" : senerId
        #         }

        #     )
        # recipient = await database_sync_to_async(Employee.objects.get)(id=recipientId)
        # sender = await database_sync_to_async(Employee.objects.get)(id=senderId)
        
        # new_message =await database_sync_to_async(Message.objects.create)(
        #     sender=sender,
        #     recipient=recipient,
        #     content=message
        # )

        await self.channel_layer.group_send(
            f"chat_{self.userId}",
            {
                'type': 'chat_message',
                'message': message,
                'recipientId': recipientId,
                "senderId" : senerId
            }
        )


        await self.send(text_data=json.dumps({
            'message': message,
            'recipient': recipientId,
            'sender': self.userId
        }))     

    async def chat_message(self, event):
        message = event['message']       
        senderId = event['senderId']
        recipientId = event['recipientId']
      

        await self.send(text_data=json.dumps({
            'message': message,
            'senderId': senderId,
            'recipientId' : recipientId
        }))

    @database_sync_to_async
    def save_message(self,user_id,receiver_id,message):
        Message.objects.create(sender_id=user_id,recipient_id=receiver_id,content=message)

    # @database_sync_to_async
    # def get_hr_id(self):
    #     return Employee.objects.get(username = 'krishna').id

