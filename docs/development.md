# 🚀 Development Workflow

This guide outlines the development workflow and best practices for working on QR Generator.

## 📋 Table of Contents

- [Development Environment](#development-environment)
- [Branching Strategy](#branching-strategy)
- [Code Style & Standards](#code-style--standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Release Process](#release-process)
- [Debugging & Troubleshooting](#debugging--troubleshooting)

## 🛠️ Development Environment

### Prerequisites

Before starting development, ensure you have:

- **Node.js 18.17+** installed
- **Git** configured with your GitHub credentials
- **VS Code** or preferred code editor
- **Supabase CLI** for database management
- **Chrome/Firefox** for testing

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Local Development Setup

1. **Clone and setup**:
   ```bash
   git clone https://github.com/NicklausVega/qr-generator.git
   cd qr-generator
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Database setup**:
   ```bash
   npx supabase start
   npx supabase db push
   ```

4. **Start development**:
   ```bash
   npm run dev
   ```

## 🌳 Branching Strategy

We follow **Git Flow** with some modifications:

### Branch Types

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/feature-name`** - New features
- **`bugfix/bug-description`** - Bug fixes
- **`hotfix/critical-fix`** - Emergency production fixes
- **`docs/topic`** - Documentation updates
- **`refactor/component-name`** - Code refactoring

### Branch Naming Conventions

```bash
# Features
feature/qr-batch-generation
feature/analytics-dashboard
feature/user-authentication

# Bug fixes
bugfix/scan-count-increment
bugfix/mobile-responsive-design
bugfix/supabase-connection-error

# Refactoring
refactor/dashboard-components
refactor/database-queries
refactor/styling-system
```

### Workflow Process

1. **Create feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop and commit** changes:
   ```bash
   git add .
   git commit -m "feat: add QR code batch generation"
   ```

3. **Push and create PR** to `develop`:
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub targeting develop branch
   ```

4. **Merge to develop** after review
5. **Deploy to staging** for testing
6. **Merge to main** for production release

## 🎨 Code Style & Standards

### TypeScript Guidelines

```typescript
// ✅ Good - Explicit interfaces and types
interface QRCodeProps {
  url: string;
  size?: number;
  styling?: QRStyling;
  onGenerated?: (qrCode: QRCode) => void;
}

export function QRCodeGenerator({ url, size = 256, styling, onGenerated }: QRCodeProps) {
  // Component implementation
}

// ❌ Avoid - Any types and unclear naming
function generateQR(data: any, opts?: any): any {
  // Implementation
}
```

### React Component Guidelines

```typescript
// ✅ Good - Functional components with hooks
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-md transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

### CSS & Styling Standards

```typescript
// ✅ Good - Tailwind utility classes with logical grouping
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-white border border-gray-200 rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">
  <span className="text-sm font-medium text-gray-900">Content</span>
  <Button variant="primary" size="sm">Action</Button>
</div>

// ❌ Avoid - Complex custom CSS when utilities can be used
<div className="custom-card-style">
  <span className="custom-text-style">Content</span>
</div>
```

### File and Directory Naming

```
components/
├── ui/              # shadcn/ui components (kebab-case)
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── dashboard/       # Feature-specific components (PascalCase)
│   ├── DashboardContent.tsx
│   ├── QRCodeCard.tsx
│   └── AnalyticsChart.tsx
└── forms/          # Form components
    ├── LoginForm.tsx
    └── QRCodeForm.tsx
```

## 🧪 Testing Guidelines

### Testing Strategy

1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - Component interactions
3. **E2E Tests** - Full user workflows (future)

### Writing Tests

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx
```

## 📝 Commit Conventions

We use **Conventional Commits** for consistent commit messages:

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples

```bash
# Feature commits
feat: add QR code batch generation
feat(dashboard): implement analytics charts
feat!: migrate to new authentication system

# Bug fix commits
fix: resolve scan tracking issue
fix(mobile): improve responsive design
fix: handle Supabase connection errors

# Documentation commits
docs: update contributing guidelines
docs(api): add endpoint documentation
docs: fix installation instructions

# Refactoring commits
refactor: extract QR generation logic
refactor(components): simplify button variants
refactor: improve database query performance
```

### Breaking Changes

Use `!` after the type/scope for breaking changes:

```bash
feat!: migrate to new API structure
refactor!: remove deprecated QR styling options
```

## 🔍 Pull Request Process

### PR Checklist

Before creating a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No merge conflicts with target branch
- [ ] PR description is clear and detailed

### PR Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change
- [ ] 📚 Documentation update
- [ ] 🔧 Configuration change

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested on different browsers/devices

## Screenshots
If applicable, add screenshots showing the changes.

## Related Issues
Closes #123
References #456

## Additional Notes
Any additional information that reviewers should know.
```

### PR Review Requirements

- **At least 1 approval** required for merge
- **All CI checks** must pass
- **No merge conflicts** with target branch
- **Documentation** updated if needed

## 👥 Code Review Guidelines

### For Authors

1. **Self-review** your code before requesting review
2. **Provide context** in PR description
3. **Keep PRs small** and focused (< 400 lines changed)
4. **Respond promptly** to review feedback
5. **Update tests** and documentation as needed

### For Reviewers

1. **Be constructive** and respectful in feedback
2. **Focus on code quality**, not personal style
3. **Check for**:
   - Logic errors and edge cases
   - Performance implications
   - Security vulnerabilities
   - Code consistency
   - Test coverage

4. **Suggest improvements** with examples:
   ```typescript
   // Consider using a more descriptive variable name
   // Instead of: const d = new Date()
   const currentDate = new Date()
   ```

5. **Approve when ready** or request changes with clear explanations

## 🚀 Release Process

### Version Numbering

We follow **Semantic Versioning** (SemVer):

- **MAJOR** version (X.0.0) - Breaking changes
- **MINOR** version (0.X.0) - New features (backward compatible)
- **PATCH** version (0.0.X) - Bug fixes (backward compatible)

### Release Workflow

1. **Feature freeze** on `develop` branch
2. **Create release branch**:
   ```bash
   git checkout develop
   git checkout -b release/v1.2.0
   ```

3. **Update version** in `package.json`
4. **Generate changelog** from commit history
5. **Final testing** and bug fixes
6. **Merge to main**:
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   ```

7. **Deploy to production**
8. **Merge back to develop**

### Changelog Format

```markdown
# Changelog

## [1.2.0] - 2025-01-XX

### Added
- QR code batch generation feature
- Advanced analytics dashboard
- Export functionality for QR codes

### Changed
- Improved mobile responsive design
- Updated user interface styling

### Fixed
- Resolved scan tracking accuracy issue
- Fixed Supabase connection handling

### Security
- Updated authentication flow
- Improved data validation
```

## 🐛 Debugging & Troubleshooting

### Development Tools

1. **React Developer Tools** - Component debugging
2. **Next.js Debug Mode** - Server-side debugging
3. **Network Tab** - API request inspection
4. **Supabase Dashboard** - Database query monitoring

### Common Issues & Solutions

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix
```

#### Database Issues

```bash
# Reset local database
npx supabase db reset

# Check migration status
npx supabase migration list

# View database logs
npx supabase logs db
```

#### Environment Issues

```bash
# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check Supabase connection
npx supabase status
```

### Debugging Techniques

1. **Console Logging**:
   ```typescript
   console.log('Debug data:', { user, qrCodes });
   console.table(analyticsData);
   ```

2. **React Hooks Debugging**:
   ```typescript
   useEffect(() => {
     console.log('Component mounted/updated:', { props, state });
   });
   ```

3. **Network Request Debugging**:
   ```typescript
   const response = await fetch('/api/qr');
   console.log('API Response:', response.status, await response.json());
   ```

## 📊 Performance Guidelines

### Code Performance

- **Avoid unnecessary re-renders** with `useMemo` and `useCallback`
- **Lazy load components** when appropriate
- **Optimize images** with Next.js Image component
- **Use proper dependency arrays** in hooks

### Bundle Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for large dependencies
npm list --depth=0 --json | grep -E '"dependencies"'
```

### Database Performance

- **Use indexes** for frequently queried columns
- **Limit query results** with pagination
- **Cache expensive computations**
- **Monitor query performance** in Supabase dashboard

---

Following this development workflow ensures consistent, high-quality code and smooth collaboration across the team. Happy coding! 🚀 