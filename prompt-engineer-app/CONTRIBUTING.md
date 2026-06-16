# Contributing to Prompt Engineer

Thank you for your interest in contributing! 🎉

## Ways to Contribute

### 1. 🌍 Add Context Files

Create context files for new industries, solutions, or roles:

```yaml
# contexts/industries/your-industry.yaml
context:
  name: "Your Industry"
  type: "industry"
  # ... (see custom-template.yaml)
```

Submit via Pull Request!

### 2. 🐛 Report Bugs

Found a bug? [Open an issue](https://github.com/yourusername/prompt-engineer-app/issues/new):
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 3. ✨ Suggest Features

Have an idea? [Start a discussion](https://github.com/yourusername/prompt-engineer-app/discussions):
- Describe the feature
- Explain the use case
- Provide examples

### 4. 💻 Code Contributions

#### Setup Dev Environment

```bash
git clone https://github.com/yourusername/prompt-engineer-app.git
cd prompt-engineer-app
./scripts/setup.sh
```

#### Make Changes

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "Add: your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

#### Code Style

**Python (Backend):**
- PEP 8 style
- Type hints encouraged
- Docstrings for all functions

**JavaScript (Frontend):**
- ESLint configuration
- Functional components
- Descriptive variable names

### 5. 📚 Improve Documentation

- Fix typos
- Add examples
- Clarify instructions
- Translate to other languages

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** everything works
5. **Update** documentation if needed
6. **Submit** PR with clear description

### PR Checklist

- [ ] Code follows project style
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or clearly noted)
- [ ] Commits are clear and descriptive

## Development Guidelines

### Adding New API Endpoints

1. Create route in `backend/api/`
2. Add to `main.py` router includes
3. Update frontend `src/services/api.js`
4. Test with Swagger UI

### Adding New React Components

1. Create in `frontend/src/components/`
2. Use Tailwind CSS for styling
3. Add PropTypes or TypeScript types
4. Keep components small and focused

### Adding New Context Types

1. Create YAML in `contexts/`
2. Follow `custom-template.yaml` structure
3. Add example use cases
4. Update documentation

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Celebrate successes

## Questions?

- **General:** [Discussions](https://github.com/yourusername/prompt-engineer-app/discussions)
- **Bugs:** [Issues](https://github.com/yourusername/prompt-engineer-app/issues)
- **Security:** Email security@yourproject.com

Thank you for contributing! 🙏
