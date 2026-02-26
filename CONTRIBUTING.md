# Contributing to Performance Template

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/perf-tpl.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with descriptive messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

Follow the [SETUP.md](SETUP.md) guide to set up your development environment.

## Code Style

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules (run `pnpm run lint`)
- Use meaningful variable names
- Add comments for complex logic
- Prefer functional programming patterns
- Use async/await over promises

### CSS

- Use CSS Layers for proper specificity
- Use CSS custom properties (variables)
- Follow BEM naming convention for classes
- Use @scope for component-specific styles
- Mobile-first responsive design

### Rust

- Follow Rust style guidelines
- Use `cargo fmt` before committing
- Add tests for new functions
- Document public APIs
- Optimize for WebAssembly size

## Commit Messages

Follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add image lazy loading
fix: resolve WASM loading race condition
docs: update API documentation
perf: optimize web worker message handling
```

## Pull Request Guidelines

1. **Title**: Clear and descriptive
2. **Description**: Explain what and why
3. **Testing**: Describe how you tested
4. **Screenshots**: Include if UI changes
5. **Breaking Changes**: Document any breaking changes
6. **Dependencies**: List new dependencies and why

## Testing Checklist

Before submitting a PR:

- [ ] Code lints without errors (`pnpm run lint`)
- [ ] TypeScript compiles without errors (`pnpm run build`)
- [ ] Manual testing completed
- [ ] Browser compatibility tested
- [ ] Performance impact assessed
- [ ] Security implications considered
- [ ] Documentation updated

## Areas for Contribution

### High Priority

- [ ] Add more WebAssembly algorithms
- [ ] Implement additional caching strategies
- [ ] Add more performance optimization examples
- [ ] Improve error handling
- [ ] Add unit tests
- [ ] Add E2E tests

### Medium Priority

- [ ] Add more SEO utilities
- [ ] Improve accessibility
- [ ] Add internationalization (i18n)
- [ ] Add dark mode toggle
- [ ] Create example components
- [ ] Add animation examples

### Documentation

- [ ] Add code examples
- [ ] Create tutorials
- [ ] Add architecture diagrams
- [ ] Document best practices
- [ ] Add troubleshooting guides
- [ ] Create video tutorials

## Performance Considerations

When contributing, consider:

1. **Bundle Size**: Minimize added dependencies
2. **Runtime Performance**: Profile performance-critical code
3. **Memory Usage**: Avoid memory leaks
4. **Network**: Minimize API calls
5. **Rendering**: Avoid unnecessary re-renders
6. **Caching**: Leverage caching where appropriate

## Security

- Never commit sensitive data (API keys, secrets)
- Validate all user inputs
- Sanitize HTML content
- Use HTTPS for external requests
- Follow OWASP guidelines
- Report security issues privately

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull requests
- Reach out to maintainers

## Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others
- Be collaborative

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

Thank you for contributing! 🎉
