# Contributing to Solarpunk Bitcoin Research

Thank you for your interest in contributing to this academic research project! This document outlines how you can contribute effectively.

## 🎯 Types of Contributions

We welcome several types of contributions:

### 1. Research Contributions
- Replication studies using our data and methodology
- Extensions of the CEIR framework
- Application to other cryptocurrencies or energy markets
- Theoretical refinements

### 2. Code Contributions
- Bug fixes in analysis scripts
- Performance improvements
- Additional visualization tools
- New derivative pricing models
- Testing and validation

### 3. Data Contributions
- Updated energy consumption data
- Additional country electricity prices
- Mining distribution updates
- New data sources for validation

### 4. Documentation
- Clarifications in papers or code
- Additional examples and tutorials
- Translation of documentation
- Improved visualizations

## 📋 Getting Started

### For Researchers

1. **Read the Papers**
   - Start with `CEIR-Trifecta.md` for the main framework
   - Review `INDEX.md` for complete context
   - Check `empirical/` for replication data

2. **Replicate Results**
   - Run analysis scripts in `empirical/`
   - Compare your results with published findings
   - Report any discrepancies via GitHub Issues

3. **Propose Extensions**
   - Open an Issue describing your research idea
   - Discuss methodology before implementing
   - Share drafts for feedback

### For Developers

1. **Fork the Repository**
   ```bash
   git clone https://github.com/[your-username]/solarpunk-coin.git
   cd solarpunk-coin
   ```

2. **Set Up Environment**
   ```bash
   cd energy_derivatives
   pip install -r requirements.txt
   ```

3. **Run Tests**
   ```bash
   # Test imports
   python -c "import sys; sys.path.insert(0, 'src'); from binomial import BinomialTree"

   # Run notebook
   jupyter notebook notebooks/main.ipynb
   ```

4. **Make Changes**
   - Create a new branch: `git checkout -b feature/your-feature-name`
   - Make your changes with clear commit messages
   - Test thoroughly

5. **Submit Pull Request**
   - Push to your fork
   - Open a PR with detailed description
   - Reference any related Issues

## 🔬 Research Standards

### Academic Rigor
- All empirical claims must be supported by data
- Statistical methods must be appropriate and documented
- Results must be reproducible
- Sources must be properly cited

### Code Quality
- Follow PEP 8 style guide for Python
- Include type hints and docstrings
- Write clear, self-documenting code
- Add comments for complex logic
- Include examples in docstrings

### Documentation
- Update README if adding new features
- Document all functions and classes
- Provide usage examples
- Cite sources for data or methods

## 📊 Data Standards

### Data Sources
- Always cite original data sources
- Document collection methodology
- Note any transformations or cleaning
- Preserve raw data when possible

### Data Files
- Use descriptive filenames
- Include metadata (date, source, version)
- Store in appropriate formats (CSV for tabular data)
- Document column definitions

## 🧪 Testing Guidelines

### For Code Changes
- Test all new functions with multiple inputs
- Verify edge cases and error handling
- Check performance with large datasets
- Ensure backward compatibility

### For Research
- Replicate results before claiming improvements
- Test robustness with different specifications
- Check sensitivity to parameter choices
- Validate against alternative data sources

## 📝 Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass
   - Update documentation
   - Follow code style guidelines
   - Check for merge conflicts

2. **PR Description Should Include**
   - Clear description of changes
   - Motivation and context
   - Related Issue numbers
   - Screenshots for UI changes
   - Checklist of completed items

3. **Review Process**
   - Maintainer will review within 1 week
   - Address feedback promptly
   - Be open to suggestions
   - Keep discussion professional

4. **After Approval**
   - Squash commits if requested
   - Ensure CI/CD passes
   - Wait for maintainer to merge

## 🎓 Academic Collaboration

### Co-authorship Guidelines
- Substantial intellectual contributions qualify for co-authorship
- Data provision alone does not guarantee authorship
- Discuss authorship early in collaboration
- Follow discipline-specific norms

### Research Ethics
- Respect data privacy and licensing
- Disclose conflicts of interest
- Follow institutional ethics guidelines
- Maintain research integrity

## 📮 Communication Channels

### For Questions
- **General questions**: Open a GitHub Issue
- **Research collaboration**: Contact via [your email]
- **Bug reports**: GitHub Issues with "bug" label
- **Feature requests**: GitHub Issues with "enhancement" label

### For Discussions
- **Research ideas**: GitHub Discussions (if enabled)
- **Implementation details**: Comments on relevant PRs or Issues
- **General chat**: [Discord/Slack if applicable]

## 🏆 Recognition

Contributors will be recognized in several ways:
- Listed in CONTRIBUTORS.md
- Mentioned in relevant paper acknowledgments (for substantial contributions)
- Co-authorship for major research contributions
- Credit in code comments for significant code contributions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License (or the repository's current license).

## 🙏 Thank You!

Your contributions help advance research on sustainable cryptocurrency systems and energy-backed digital finance. Every contribution, no matter how small, is valuable!

---

**Questions?** Open an issue or contact the maintainer.

**Not sure where to start?** Check Issues labeled "good first issue" or "help wanted".
