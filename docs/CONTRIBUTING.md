# Contributing to DizziGo Website

Thank you for your interest in contributing to the DizziGo website! We welcome contributions from the community and are grateful for your help in making DizziGo better.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- Familiarity with Git and GitHub
- Optional: Node.js for development tools

### Local Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/dizzigo-website.git
   cd dizzigo-website
   ```

2. **Set up local development**
   ```bash
   # Install development dependencies (optional)
   npm install
   
   # Start local server
   npm run dev
   # OR use Python
   python -m http.server 8000
   # OR use any other local server
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000` (or `http://localhost:8000` if using Python)

## 📝 How to Contribute

### Types of Contributions

We welcome many types of contributions:

- 🐛 **Bug fixes**: Fix broken functionality or visual issues
- ✨ **Feature enhancements**: Add new features or improve existing ones
- 🎨 **Design improvements**: Enhance UI/UX, animations, or visual design
- 📚 **Documentation**: Improve README, comments, or add guides
- 🔧 **Performance**: Optimize loading times, animations, or code
- ♿ **Accessibility**: Improve keyboard navigation, screen reader support
- 🌍 **Internationalization**: Add support for multiple languages
- 📱 **Mobile**: Improve mobile responsiveness and touch interactions

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow the existing code style
   - Test your changes on multiple browsers
   - Ensure mobile responsiveness
   - Check accessibility compliance

3. **Test thoroughly**
   ```bash
   # Run linting
   npm run lint
   
   # Check for broken links
   npm run check:links
   
   # Run Lighthouse audit
   npm run lighthouse
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new terminal animation"
   # or
   git commit -m "fix: resolve mobile navigation issue"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 🎨 Design Guidelines

### Color Scheme
- Primary Background: `#0a0e1a`
- Secondary Background: `#1a1f2e`
- Primary Text: `#e2e8f0`
- Accent Green: `#00ff88` (terminal green)
- Accent Blue: `#00d4ff` (terminal blue)
- Accent Orange: `#ff6b35` (terminal orange)

### Typography
- **Monospace**: JetBrains Mono (for code, terminal text)
- **Sans-serif**: Inter (for body text, UI elements)

### Animation Principles
- **Performance first**: Use `transform` and `opacity` for animations
- **Respect user preferences**: Honor `prefers-reduced-motion`
- **Smooth timing**: Use `ease-out` for most animations
- **Purposeful motion**: Animations should enhance UX, not distract

### Responsive Design
- **Mobile-first**: Design for mobile, then enhance for desktop
- **Breakpoints**:
  - Mobile: `max-width: 768px`
  - Tablet: `max-width: 1024px`
  - Desktop: `min-width: 1025px`

## 🔧 Code Standards

### HTML
- Use semantic HTML5 elements
- Include appropriate ARIA labels
- Maintain proper heading hierarchy
- Optimize for SEO and accessibility

### CSS
- Use CSS custom properties (variables)
- Follow BEM naming convention where applicable
- Group related properties together
- Comment complex or unusual CSS

### JavaScript
- Use modern ES6+ syntax
- Write clear, self-documenting code
- Add comments for complex logic
- Handle errors gracefully
- Optimize for performance

### File Organization
```
dizzigo-website/
├── index.html          # Main HTML
├── style.css           # Styles
├── script.js           # JavaScript
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── assets/
│   ├── icons/         # App icons
│   ├── images/        # Images
│   └── screenshots/   # App screenshots
└── docs/              # Documentation
```

## 🧪 Testing

### Browser Testing
Test your changes on:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility**: Screen readers, keyboard navigation

### Performance Testing
- Lighthouse score > 90 for all categories
- First Contentful Paint < 2s
- Largest Contentful Paint < 4s
- Cumulative Layout Shift < 0.1

### Tools Available
```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# HTML validation
npm run validate

# Performance audit
npm run lighthouse

# Check for broken links
npm run check:links

# Bundle size analysis
npm run analyze:bundle
```

## 📖 Documentation

### Code Comments
- Comment complex logic or non-obvious code
- Explain why, not just what
- Keep comments up to date with code changes

### Commit Messages
Follow conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add terminal typing animation
fix: resolve mobile menu closing issue
docs: update installation instructions
style: improve button hover animations
perf: optimize 3D particle rendering
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps to recreate the bug
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Browser, OS, screen size
6. **Screenshots**: If applicable
7. **Console errors**: Any JavaScript errors

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Windows, iOS]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- Screen Size: [e.g. 1920x1080, iPhone 12]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

We love feature ideas! When suggesting features:

1. **Search existing issues** first
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation details
4. **Consider alternatives** and explain why your solution is best
5. **Think about backwards compatibility**

## 💬 Questions and Support

- **General questions**: Create a [Discussion](https://github.com/dizzigo/website/discussions)
- **Bug reports**: Create an [Issue](https://github.com/dizzigo/website/issues)
- **Feature requests**: Create an [Issue](https://github.com/dizzigo/website/issues)
- **Real-time chat**: Join our [Discord](https://discord.gg/dizzigo)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Be respectful and inclusive
- Exercise empathy and kindness
- Focus on what is best for the community
- Give and gracefully accept constructive feedback
- Take responsibility for mistakes and learn from them

### Unacceptable Behavior

- Harassment, intimidation, or discrimination
- Offensive, derogatory, or inflammatory comments
- Personal or political attacks
- Public or private harassment
- Publishing others' private information without permission

## 🎉 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Website**: Contributors page (planned)
- **Release notes**: Feature contributions
- **Social media**: Major contributions

## 📚 Resources

### Learning Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools and Extensions
- **VS Code Extensions**:
  - Live Server
  - Prettier
  - ESLint
  - Auto Rename Tag
  - CSS Peek

### Design Inspiration
- [Awwwards](https://www.awwwards.com/websites/developer-tools/)
- [CodePen](https://codepen.io/search/pens?q=terminal)
- [Dribbble](https://dribbble.com/search/developer-website)

## 🙏 Thank You

Thank you for contributing to DizziGo! Every contribution, no matter how small, helps make DizziGo better for developers around the world.

---

**Happy coding! 🤖✨**