# 🤝 Contributing to QR Generator

Thank you for your interest in contributing to QR Generator! This guide will help you get started with contributing to our open-source project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Workflow](#contributing-workflow)
- [Code Style](#code-style)
- [Submitting Issues](#submitting-issues)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and professional in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git
- Supabase account (for database features)
- Basic knowledge of React, Next.js, and TypeScript

### Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/qr-generator.git
   cd qr-generator
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/NicklausVega/qr-generator.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Development Setup

### Project Structure

```
qr-generator/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── middleware.ts       # Next.js middleware
├── docs/                   # Documentation (edit via markdown)
├── supabase/              # Database migrations & config
└── public/                # Static assets
```

### Branch Organization

- `main` - Production branch (protected)
- `develop` - Development branch for integration
- `feature/feature-name` - Feature development
- `bugfix/bug-description` - Bug fixes
- `docs/topic` - Documentation updates

## 🔄 Contributing Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/NicklausVega/qr-generator/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write your code following our [style guidelines](#code-style)
- Add tests if applicable
- Update documentation if needed
- Commit your changes with descriptive messages

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Test the build
npm run build

# Test locally
npm run dev
```

### 5. Submit a Pull Request

- Push your branch to your fork
- Create a pull request to the `develop` branch
- Fill out the PR template completely
- Link any related issues

## 🎨 Code Style

### TypeScript & JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={cn('px-4 py-2', variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS & Styling

- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Use CSS variables for theming
- Prefer composition over complex selectors

### Git Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples
feat: add QR code batch generation
fix: resolve scan tracking issue
docs: update contributing guide
style: fix linting issues
refactor: improve database query performance
test: add unit tests for QR generation
```

## 🐛 Submitting Issues

### Bug Reports

Include the following information:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### Feature Requests

Include the following information:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How would you like it implemented?
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Any other relevant information

## 🔍 Pull Requests

### PR Checklist

Before submitting a pull request, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings or errors
- [ ] Tests pass locally
- [ ] PR title follows conventional commit format

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots
If applicable, add screenshots

## Related Issues
Closes #(issue number)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for complex features
- Use React Testing Library for component tests
- Mock external dependencies appropriately

### Test Structure

```typescript
// Example test file
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📝 Documentation

### Updating Documentation

- Documentation lives in the `/docs` directory
- All docs are written in Markdown
- Update relevant docs when adding features
- Include code examples where helpful
- Keep language clear and beginner-friendly

### Documentation Structure

- **User Guides**: How to use features
- **Developer Guides**: How to contribute/develop
- **Technical Docs**: Architecture and design decisions
- **API Docs**: (Coming soon) API reference

### Writing Guidelines

- Use clear, concise language
- Include practical examples
- Add screenshots for UI features
- Keep docs up-to-date with code changes

## 🎯 Areas for Contribution

### High Priority
- [ ] Enhanced analytics dashboard
- [ ] QR code templates system
- [ ] Bulk QR code generation
- [ ] Advanced customization options
- [ ] Performance optimizations

### Medium Priority
- [ ] Export formats (PDF, EPS)
- [ ] QR code scheduling
- [ ] Team collaboration features
- [ ] Improved mobile experience
- [ ] Accessibility improvements

### Low Priority
- [ ] Dark mode enhancements
- [ ] Additional authentication providers
- [ ] QR code password protection
- [ ] Advanced reporting
- [ ] Email notifications

## 💬 Getting Help

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Discord** (Coming soon): Real-time chat
- **Email**: For private matters

## 🎉 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Annual contributor highlights
- Special badges for significant contributions

---

Thank you for contributing to QR Generator! Every contribution, no matter how small, helps make this project better for everyone. 🙏 