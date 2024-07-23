

```markdown
# Chat Application

This is a Next.js project for a real-time chat application.

## Getting Started

To get started with this project, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Set Up MongoDB

1. Install MongoDB

2. Start MongoDB: Open a command prompt or terminal and start MongoDB with the following command:

   ```bash
   mongod
   ```

   Make sure MongoDB is running on the default port (`27017`) or configure your application to use the correct port.

3. **Create a Database**: Ensure you have a database named `app-data` and a collection named `messages`. You can do this using MongoDB Compass or via the MongoDB shell.

### 3. Install Dependencies

Install the necessary npm packages by running:

```bash
npm install
```

or, if you prefer Yarn:

```bash
yarn install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory of the project and add the following environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/app-data
```

Adjust the `MONGODB_URI` if your MongoDB instance is configured differently.

### 5. Run the Development Server

Start the development server with:

```bash
npm run dev
```

or, if you prefer Yarn:

```bash
yarn dev
```

Open (http://localhost:3000) in your browser to see the application.

### 6. Build the Project

To build the project for production, run:

```bash
npm run build
```

or, if you prefer Yarn:

```bash
yarn build
```

### 7. Install Socket.io

For real-time messaging, you need Socket.io. Install it with:

```bash
npm install socket.io socket.io-client
```

or, if you prefer Yarn:

```bash
yarn add socket.io socket.io-client
```

### 8. Using `next/font`



## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and accessible via the URI specified in `.env.local`.

- **Socket.io Issues**: Verify that the server is emitting and receiving messages correctly.

- **Environment Variables**: Ensure all necessary environment variables are set correctly in `.env.local`.

