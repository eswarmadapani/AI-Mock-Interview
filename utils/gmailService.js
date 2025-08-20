import { google } from 'googleapis';

class GmailService {
  constructor() {
    this.auth = null;
    this.gmail = null;
  }

  async initialize(auth) {
    this.auth = auth;
    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  async getRecordings(query = 'has:attachment filename:mp3 OR filename:wav OR filename:webm') {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50
      });

      const messages = response.data.messages || [];
      const recordings = [];

      for (const message of messages) {
        const messageDetail = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        const attachments = this.extractAttachments(messageDetail.data);
        recordings.push({
          id: message.id,
          threadId: messageDetail.data.threadId,
          subject: this.getHeader(messageDetail.data, 'Subject'),
          date: this.getHeader(messageDetail.data, 'Date'),
          attachments: attachments
        });
      }

      return recordings;
    } catch (error) {
      console.error('Error fetching Gmail recordings:', error);
      throw error;
    }
  }

  async downloadAttachment(messageId, attachmentId) {
    try {
      const response = await this.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: attachmentId
      });

      return response.data;
    } catch (error) {
      console.error('Error downloading attachment:', error);
      throw error;
    }
  }

  extractAttachments(message) {
    const attachments = [];
    
    if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.filename && part.body && part.body.attachmentId) {
          attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            attachmentId: part.body.attachmentId,
            size: part.body.size
          });
        }
      }
    }

    return attachments;
  }

  getHeader(message, headerName) {
    const header = message.payload.headers.find(h => h.name === headerName);
    return header ? header.value : '';
  }
}

export default GmailService;
