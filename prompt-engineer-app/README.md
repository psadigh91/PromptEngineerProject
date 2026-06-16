# 🚀 Prompt Engineer - AI Prompt Optimization Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)

**🌐 Live Demo:** [https://staging.d1a9rwz0d7hjvm.amplifyapp.com/](https://staging.d1a9rwz0d7hjvm.amplifyapp.com/)

A full-stack web application that helps you create better, more contextualized prompts using AI and best practices from 20+ accredited sources (Anthropic, Google, Microsoft, AWS, Stanford, and more).

## ✨ Features

### 🎯 Core Features
- **Intelligent Prompt Analysis** - Analyze prompts using the PROMPT framework (Purpose, Role, Organization, Model Guidance, Precision, Testing)
- **Interactive Optimization** - Step-by-step guided improvement with explanations
- **Context Import System** - Upload industry, solution, or role-specific contexts to customize prompts
- **Prompt Library** - Save, organize, and reuse your optimized prompts
- **Before/After Comparison** - See exactly what improved and why
- **Export Options** - Export prompts in multiple formats (Markdown, JSON, Plain Text)

### 🎨 User Experience
- **Beautiful Modern UI** - Clean, responsive interface built with React + Tailwind CSS
- **Real-time Preview** - See your prompt improve in real-time
- **Drag & Drop** - Easy context file uploads
- **Dark/Light Mode** - Choose your preferred theme
- **Mobile Responsive** - Works on all devices

### 📚 Knowledge Base
Built on research from:
- AI Providers: Anthropic, Google, Microsoft, AWS, OpenAI
- Universities: Stanford, Vanderbilt, DeepLearning.AI
- Academic Research: Chain-of-Thought, Prompt Patterns, 26 Principles
- 6M+ combined learner reach

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### One-Command Install & Run

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-engineer-app.git
cd prompt-engineer-app

# Run the setup script
./scripts/setup.sh

# Start the application
./scripts/start.sh
```

The app will open automatically at `http://localhost:3000`

### Manual Installation

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📖 User Guide

### 1️⃣ Upload Context (Optional but Recommended)

**What is Context?**
Context files help the system understand your industry, solution area, or role to provide better, more relevant prompt optimizations.

**How to Upload:**
1. Click "⚙️ Settings" in the navigation
2. Go to "Context Management" tab
3. Drag & drop your context YAML file or click to browse
4. Context is immediately active

**Pre-built Contexts Available:**
- **Industries:** Healthcare, Finance, E-commerce, SaaS, Education
- **Solutions:** Customer Support, Data Analysis, Code Generation, Content Creation
- **Roles:** Developer, Product Manager, Data Scientist, Marketer

**Create Your Own Context:**
See `contexts/custom-template.yaml` for the template.

### 2️⃣ Optimize a Prompt

1. **Enter Your Prompt**
   - Type or paste your prompt in the main text area
   - Don't worry if it's rough - that's the point!

2. **Click "Analyze Prompt"**
   - The system analyzes your prompt across 6 dimensions
   - Identifies gaps and opportunities

3. **Answer Questions**
   - The system asks clarifying questions one at a time
   - Each question explains WHY it's important
   - Examples provided to guide you

4. **Get Optimized Prompt**
   - Receive a production-ready, optimized prompt
   - See before/after comparison
   - Understand what changed and why

5. **Save to Library** (Optional)
   - Click "💾 Save to Library"
   - Add tags for easy searching
   - Reuse later with one click

### 3️⃣ Browse Prompt Library

1. Click "📚 Library" in navigation
2. Browse saved prompts
3. Filter by tags or search
4. Click to view details or reuse
5. Export individual prompts or entire library

## 🏗️ Project Structure

```
prompt-engineer-app/
├── backend/                    # Python FastAPI backend
│   ├── api/                   # API routes
│   ├── core/                  # Core logic (analyzer, optimizer)
│   ├── models/                # Database models
│   ├── services/              # Business logic
│   └── main.py               # Entry point
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main app component
│   └── package.json
├── knowledge-base/            # 20+ source documentation
├── contexts/                  # Context files (user-importable)
│   ├── industries/
│   ├── solutions/
│   └── roles/
├── database/                  # SQLite database (auto-created)
├── scripts/                   # Utility scripts
│   ├── setup.sh              # Installation
│   └── start.sh              # Start app
└── docs/                      # Documentation
```

## 🎨 Screenshots

### Home Page - Prompt Input
![Home](docs/screenshots/home.png)

### Analysis Results
![Analysis](docs/screenshots/analysis.png)

### Context Upload
![Context](docs/screenshots/context.png)

### Prompt Library
![Library](docs/screenshots/library.png)

## 🔧 Configuration

Edit `backend/config.yaml` to customize:

```yaml
app:
  name: "Prompt Engineer"
  version: "1.0.0"
  port: 8000
  debug: false

database:
  type: "sqlite"
  path: "./database/prompts.db"

defaults:
  model: "claude-sonnet-4"
  temperature: 0.3
  interaction_mode: "interactive"

ui:
  theme: "light"  # "light" or "dark"
  colors: true
  emojis: true
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints

```bash
# Analyze a prompt
POST /api/analyze
{
  "prompt": "Your prompt here",
  "context_id": "optional-context-id"
}

# Optimize a prompt
POST /api/optimize
{
  "prompt": "Your prompt here",
  "answers": {"question_1": "answer_1"}
}

# Upload context
POST /api/contexts/upload
Content-Type: multipart/form-data

# Get prompt library
GET /api/library?tags=customer,email

# Save prompt
POST /api/library
{
  "title": "Customer Email Response",
  "prompt": "...",
  "tags": ["customer", "email"]
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel (Frontend) + Railway (Backend)
See `docs/deployment.md` for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- Add new context files (industries, solutions, roles)
- Improve prompt patterns
- Enhance UI/UX
- Add tests
- Fix bugs
- Improve documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built on research and best practices from:
- [Anthropic](https://www.anthropic.com) - Claude prompt engineering guidelines
- [Google AI](https://ai.google.dev) - Gemini prompting strategies
- [Microsoft Azure](https://azure.microsoft.com) - OpenAI best practices
- [Stanford CS224N](https://web.stanford.edu/class/cs224n/) - NLP course
- [Vanderbilt University](https://www.coursera.org/learn/prompt-engineering) - Prompt Engineering course
- [DAIR.AI](https://www.promptingguide.ai) - Comprehensive prompting guide

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/prompt-engineer-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/prompt-engineer-app/discussions)
- **Email:** your.email@example.com

## 🗺️ Roadmap

### v1.1 (Coming Soon)
- [ ] Team collaboration features
- [ ] Prompt versioning
- [ ] A/B testing for prompts
- [ ] More pre-built contexts

### v2.0 (Future)
- [ ] AI-powered context generation
- [ ] Multi-language support
- [ ] Browser extension
- [ ] API for programmatic access

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

Built to help everyone create better AI prompts, regardless of technical expertise.
