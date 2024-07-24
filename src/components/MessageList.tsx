import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  const renderContent = (content: string) => {
    // Ensure content is a string
    if (typeof content !== 'string') {
      return <div>Invalid content</div>;
    }

    // Regular expression to find URLs in the content
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with anchor tags or images
    const updatedContent = content.replace(urlRegex, (url) => {
      const isImageUrl = /\.(jpeg|jpg|gif|png)$/.test(url);
      return isImageUrl
        ? `<img src="${url}" alt="Uploaded file" class="max-w-xs mt-2" />`
        : `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</a>`;
    });

    // Using dangerouslySetInnerHTML to render HTML content
    return <div dangerouslySetInnerHTML={{ __html: updatedContent }} />;
  };

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{message.sender}</span>
              <span className="text-gray-500 text-sm">{message.timestamp}</span>
            </div>
            <p className="bg-gray-100 rounded-lg p-2">
              {renderContent(message.content)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
