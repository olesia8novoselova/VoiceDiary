# 🎙️Voice Diary - React Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 📑 Table of Contents

- [Project Setup with Docker](#project-setup-with-docker)
  - [Prerequisites](#prerequisites)
  - [🐳 Quick Start with Docker](#-quick-start-with-docker)
- [🔥 Development Mode with Docker](#-development-mode-with-docker)
- [📦 Available Scripts](#-available-scripts)
- [🤝 Contributing](#-contributing)
  - [Guidelines:](#guidelines)

## Project Setup with Docker

### Prerequisites

- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Node.js (optional, for development without Docker)

### 🐳 Quick Start with Docker

1. **Build the Docker image**:

   ```bash
   docker build -t voice-diary-frontend .
   ```

2. **Run the container:**

   ```bash
   docker run -d -p 3000:80 voice-diary-frontend
   ```

3. **Access the application:**

   🌐 Open http://localhost:3000 in your browser

## 🔥 Development Mode with Docker

For development with hot-reload:

```bash
docker build -t voice-diary-dev -f Dockerfile.dev .

docker run -p 3000:3000 -v $(pwd):/app voice-diary-dev
```

## 📦 Available Scripts

| Command          | Description                               |     |
| ---------------- | ----------------------------------------- | --- |
| `npm start`      | Launch development server with hot-reload | 🚀  |
| `npm run build`  | Create optimized production build         | 🏗️  |
| `npm test`       | Run test suite in interactive watch mode  | 🧪  |
| `npm run format` | Format code with Prettier (if configured) | 🎨  |

## 🤝 Contributing

We welcome all contributions! Here's how to help:

1. **Fork** the repository 🍴

2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/IU-Capstone-Project-2025/VoiceDiary.git
   ```

3. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

4. Commit your changes:

   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature
   ```
6. Open a Pull Request with clear description

#### Guidelines:

- Follow existing code style
- Write meaningful commit messages
- Update documentation when needed
- Keep PRs focused on single purpose
