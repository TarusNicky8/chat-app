import React, { useState } from 'react';
import Picker, { EmojiClickData } from 'emoji-picker-react'; // Import Picker correctly

interface Props {
  onSendMessage: (content: string, file?: File) => void; // Updated prop to handle file
}

const MessageInput: React.FC<Props> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null); // Ref to access file input

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Pass `selectedFile` as undefined if it's null
    onSendMessage(message, selectedFile ?? undefined);
    setMessage('');
    setSelectedFile(null);
  };

  return (
    <div className="relative mt-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message..."
          className="flex-1 border-gray-300 border p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef} // Attach ref
            onChange={handleFileChange}
            className="absolute opacity-0 w-0 h-0"
          />
          <button
            type="button"
            onClick={handleFileClick} // Trigger file input click
            className="border-gray-300 border rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {selectedFile ? selectedFile.name : 'Choose file'}
          </button>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="px-2 py-1 bg-gray-200 rounded-lg"
        >
          😊
        </button>
      </form>
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0">
          <Picker
            onEmojiClick={handleEmojiClick} // Correctly typed handler
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
