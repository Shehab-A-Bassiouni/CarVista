import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messages: any[] = [];
  public newMessage: string = '';
  public senderId: number = 1;
  private receiverId: number = 0;
  public userName: string = '';
  private hubConnection: HubConnection;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5210/chathub?userId=${this.receiverId}`, {
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => `${localStorage.getItem('token')}`,
        withCredentials: true
      })
      .configureLogging(LogLevel.Information)
      .build();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userName = params['username'];
      this.receiverId = +params['receiverId']; // Convert to number
      this.initializeHubConnection();
      this.loadChatHistory();
    });
  }

  private initializeHubConnection(): void {
    this.hubConnection.on('ReceiveMessage', (message:any) => {
      this.messages.push(message);
    });

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected.'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  loadChatHistory(): void {
    this.http.get<any[]>(`http://localhost:5210/api/Chat/${this.senderId}`)
      .subscribe(
        (data) => {
          this.messages = data;
        },
        (error) => {
          console.log('Error loading chat history:', error);
        }
      );
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const chatMessage: ChatMessage = {
        SenderId: this.senderId,
        ReceiverId: this.receiverId,
        Message: this.newMessage,
        DateTime: new Date().toISOString(),
        read: false,
        isActive: true
      };

      // Add the message to the local state immediately
      this.messages.push({
        senderId: this.senderId,
        receiverId: this.receiverId,
        message: this.newMessage,
        dateTime: new Date().toISOString(),
        read: false,
        isActive: true
      });

      // Send the message to the server
      this.hubConnection.invoke('sendmessage', chatMessage)
        .catch(err => console.error(err));

      // Clear the input field
      this.newMessage = '';
    }
  }
}

export class ChatMessage {
  constructor(
    public SenderId: number,
    public ReceiverId: number,
    public Message: string,
    public DateTime: any,
    public read: boolean,
    public isActive: boolean
  ) {}
}
