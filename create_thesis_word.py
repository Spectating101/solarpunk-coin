#!/usr/bin/env python3
"""
Complete Thesis Word Document Generator
Converts thesis-draft.md to a professionally formatted Word document
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.style import WD_STYLE_TYPE
import re

def setup_document_styles(doc):
    """Configure document-wide styles"""
    # Normal style
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    
    paragraph_format = style.paragraph_format
    paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    paragraph_format.space_after = Pt(0)
    paragraph_format.space_before = Pt(0)
    
    # Set margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
    
    # Heading 1 style
    h1_style = doc.styles['Heading 1']
    h1_style.font.name = 'Times New Roman'
    h1_style.font.size = Pt(14)
    h1_style.font.bold = True
    h1_style.paragraph_format.space_before = Pt(24)
    h1_style.paragraph_format.space_after = Pt(12)
    h1_style.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    
    # Heading 2 style
    h2_style = doc.styles['Heading 2']
    h2_style.font.name = 'Times New Roman'
    h2_style.font.size = Pt(13)
    h2_style.font.bold = True
    h2_style.paragraph_format.space_before = Pt(18)
    h2_style.paragraph_format.space_after = Pt(6)
    h2_style.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    
    # Heading 3 style
    h3_style = doc.styles['Heading 3']
    h3_style.font.name = 'Times New Roman'
    h3_style.font.size = Pt(12)
    h3_style.font.bold = True
    h3_style.font.italic = True
    h3_style.paragraph_format.space_before = Pt(12)
    h3_style.paragraph_format.space_after = Pt(6)
    h3_style.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE

def add_cover_page(doc):
    """Add thesis cover page"""
    # Add centered content
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(72)
    
    # University name
    run = p.add_run('YUAN ZE UNIVERSITY\n')
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    p.add_run('\n\n')
    
    # Department
    run = p.add_run('Department of Finance\n')
    run.font.size = Pt(14)
    run.font.name = 'Times New Roman'
    
    p.add_run('\n\n\n')
    
    # Thesis title
    run = p.add_run('ENERGY-BACKED DERIVATIVES:\n')
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    run = p.add_run('From Empirical Validation to a Credible\n')
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    run = p.add_run('Pricing-and-Contract Framework\n')
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    p.add_run('\n\n\n')
    
    # Author
    run = p.add_run('By\n')
    run.font.size = Pt(12)
    run.font.name = 'Times New Roman'
    
    run = p.add_run('Christopher Ongko\n')
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    run = p.add_run('Student ID: 1133958\n')
    run.font.size = Pt(12)
    run.font.name = 'Times New Roman'
    
    p.add_run('\n\n\n')
    
    # Submission details
    run = p.add_run('A thesis submitted in partial fulfillment\n')
    run.font.size = Pt(12)
    run.font.name = 'Times New Roman'
    
    run = p.add_run('of the requirements for the degree of\n')
    run.font.size = Pt(12)
    run.font.name = 'Times New Roman'
    
    run = p.add_run('Master of Science in Finance\n')
    run.font.size = Pt(12)
    run.font.name = 'Times New Roman'
    
    p.add_run('\n\n\n')
    
    # Date
    run = p.add_run('2025')
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.name = 'Times New Roman'
    
    # Page break
    doc.add_page_break()

def add_toc_placeholder(doc):
    """Add table of contents placeholder"""
    doc.add_heading('Table of Contents', 1)
    
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run('[Table of Contents will be auto-generated in Word]\n\n')
    run.font.italic = True
    run.font.size = Pt(11)
    
    p.add_run('To generate the Table of Contents in Microsoft Word:\n')
    p.add_run('1. Click at this location\n')
    p.add_run('2. Go to References > Table of Contents\n')
    p.add_run('3. Select "Automatic Table 1" or "Automatic Table 2"\n')
    p.add_run('4. Right-click the TOC and select "Update Field" to refresh\n')
    
    doc.add_page_break()

def process_markdown_line(doc, line, in_code_block):
    """Process a single line of markdown and add to document"""
    line = line.rstrip()
    
    # Skip empty lines in code blocks
    if in_code_block and not line:
        return in_code_block
    
    # Code block markers
    if line.strip().startswith('```'):
        return not in_code_block
    
    # Chapter headings (## Chapter N:)
    if re.match(r'^##\s+Chapter\s+\d+:', line):
        text = re.sub(r'^##\s+', '', line)
        doc.add_heading(text, level=1)
        return in_code_block
    
    # Major headings (## )
    if line.startswith('## ') and not line.startswith('### '):
        text = line[3:].strip()
        doc.add_heading(text, level=1)
        return in_code_block
    
    # Section headings (### )
    if line.startswith('### ') and not line.startswith('#### '):
        text = line[4:].strip()
        doc.add_heading(text, level=2)
        return in_code_block
    
    # Subsection headings (#### )
    if line.startswith('#### '):
        text = line[5:].strip()
        doc.add_heading(text, level=3)
        return in_code_block
    
    # Horizontal rules
    if line.strip() in ['---', '***', '___']:
        return in_code_block
    
    # Title line (# )
    if line.startswith('# ') and not line.startswith('## '):
        # Skip - handled by cover page
        return in_code_block
    
    # Empty lines
    if not line.strip():
        # Add minimal spacing
        return in_code_block
    
    # Regular paragraphs and formatted text
    if not in_code_block:
        p = doc.add_paragraph()
        add_formatted_text(p, line)
    
    return in_code_block

def add_formatted_text(paragraph, text):
    """Add text with markdown formatting to paragraph"""
    # Handle bold, italic, and inline code
    parts = []
    current = ""
    i = 0
    
    while i < len(text):
        if text[i:i+2] == '**':
            if current:
                parts.append(('normal', current))
                current = ""
            # Find closing **
            j = text.find('**', i+2)
            if j != -1:
                parts.append(('bold', text[i+2:j]))
                i = j + 2
                continue
        elif text[i] == '*' and (i == 0 or text[i-1] != '*'):
            if current:
                parts.append(('normal', current))
                current = ""
            # Find closing *
            j = text.find('*', i+1)
            if j != -1 and (j+1 >= len(text) or text[j+1] != '*'):
                parts.append(('italic', text[i+1:j]))
                i = j + 1
                continue
        elif text[i] == '`':
            if current:
                parts.append(('normal', current))
                current = ""
            # Find closing `
            j = text.find('`', i+1)
            if j != -1:
                parts.append(('code', text[i+1:j]))
                i = j + 1
                continue
        
        current += text[i]
        i += 1
    
    if current:
        parts.append(('normal', current))
    
    # Add runs with formatting
    for fmt, txt in parts:
        run = paragraph.add_run(txt)
        if fmt == 'bold':
            run.font.bold = True
        elif fmt == 'italic':
            run.font.italic = True
        elif fmt == 'code':
            run.font.name = 'Courier New'
            run.font.size = Pt(10)

def create_summary_statistics_table(doc):
    """Create Table 2.1: Summary Statistics by Regime"""
    doc.add_heading('Table 2.1: Summary Statistics by Regime', level=3)
    
    table = doc.add_table(rows=8, cols=5)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Variable', 'Pre-Ban Mean (SD)', 'Post-Ban Mean (SD)', 'Difference', 'p-value']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data rows
    data = [
        ['log(CEIR)', '−2.45 (0.98)', '−1.82 (0.45)', '0.63', '< 0.001'],
        ['BTC 30d Return (%)', '8.2 (45.3)', '−12.4 (38.7)', '−20.6', '0.018'],
        ['Hash Rate (EH/s)', '142.5 (28.3)', '188.7 (42.1)', '46.2', '< 0.001'],
        ['Mining Concentration', '0.65 (0.08)', '0.28 (0.05)', '−0.37', '< 0.001'],
        ['Electricity Cost ($/kWh)', '0.048 (0.012)', '0.062 (0.018)', '0.014', '< 0.001'],
        ['Network Difficulty', '18.5T (4.2T)', '28.3T (6.8T)', '9.8T', '< 0.001'],
        ['Observations', '156', '104', '260', '—']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    doc.add_paragraph()

def create_ceir_regression_table(doc):
    """Create Table 2.2: Bias-Corrected CEIR Regressions"""
    doc.add_heading('Table 2.2: Bias-Corrected CEIR Regressions', level=3)
    
    table = doc.add_table(rows=8, cols=4)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Specification', 'Coef (β)', 'Std Error', 't-stat']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['Pre-Ban (Concentrated)', '−0.206***', '0.042', '−4.90'],
        ['Post-Ban (Dispersed)', '−0.080***', '0.011', '−7.27'],
        ['Pre-Ban + Controls', '−0.500***', '0.085', '−5.88'],
        ['Post-Ban + Controls', '−0.045**', '0.018', '−2.50'],
        ['Full Sample', '−0.128***', '0.023', '−5.57'],
        ['AR(1) Coefficient (ρ)', '0.980', '0.008', '122.5'],
        ['Observations', 'Pre: 156, Post: 104', '', '']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    # Add footnote
    p = doc.add_paragraph()
    run = p.add_run('Note: *** p<0.001, ** p<0.01, * p<0.05. Bias-corrected using Amihud-Hurvich (2004) methodology. '
                    'Standard errors are heteroskedasticity-robust (HC1). Controls include momentum and investor attention.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_structural_break_table(doc):
    """Create Table 2.3: Structural Break Tests"""
    doc.add_heading('Table 2.3: Structural Break Tests', level=3)
    
    table = doc.add_table(rows=5, cols=4)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Test', 'Statistic', 'Critical Value', 'p-value']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['Chow F-test', '4.786', 'F(2,256) = 3.03', '0.0009'],
        ['Coefficient Difference', '0.126', '—', '< 0.001'],
        ['Effect Size (Cohen d)', '1.47', '—', '—'],
        ['R² Pre-Ban', '0.324', '—', '—']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Note: Chow test indicates significant structural break at June 2021 ban date.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_mining_transformation_table(doc):
    """Create Table 2.4: Mining Sector Transformation"""
    doc.add_heading('Table 2.4: Mining Sector Geographic Transformation', level=3)
    
    table = doc.add_table(rows=6, cols=4)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Metric', 'Pre-Ban (2021 Q1)', 'Post-Ban (2022 Q1)', 'Change']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['China Hash Share (%)', '65', '0', '−65'],
        ['Top 3 Country Share (%)', '82', '48', '−34'],
        ['Active Mining Countries', '8', '15+', '+7'],
        ['Electricity Cost Range ($/kWh)', '0.04–0.06', '0.03–0.12', '+100%'],
        ['Geographic HHI', '0.52', '0.18', '−0.34']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Source: Cambridge Centre for Alternative Finance, author calculations.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_pricing_validation_table(doc):
    """Create Table 3.1: Pricing Validation Results"""
    doc.add_heading('Table 3.1: Binomial vs Monte Carlo Validation', level=3)
    
    table = doc.add_table(rows=6, cols=5)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Strike', 'Binomial Price', 'Monte Carlo', 'Difference', 'Error (%)']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['$80', '$42.18', '$42.73', '$0.55', '1.3%'],
        ['$90', '$37.92', '$38.15', '$0.23', '0.6%'],
        ['$100', '$33.88', '$33.92', '$0.04', '0.1%'],
        ['$110', '$30.12', '$30.28', '$0.16', '0.5%'],
        ['$120', '$26.75', '$26.98', '$0.23', '0.9%']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Note: S₀ = $100/MWh, σ = 189%, T = 1 year, r = 3%. Monte Carlo uses 1,000,000 paths. '
                    'All errors < 1.4%, confirming numerical convergence.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_global_validation_table(doc):
    """Create Table 3.2: Global Location Validation"""
    doc.add_heading('Table 3.2: Framework Validation Across Global Markets', level=3)
    
    table = doc.add_table(rows=6, cols=5)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Location', 'Volatility (σ)', 'ATM Premium', 'Delta', 'Convergence']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['Taiwan', '189%', '$33.88', '0.612', '< 1.4%'],
        ['Morocco', '145%', '$28.45', '0.584', '< 1.2%'],
        ['Arizona', '128%', '$25.73', '0.567', '< 1.0%'],
        ['Germany', '98%', '$20.12', '0.542', '< 0.8%'],
        ['Kenya', '176%', '$31.98', '0.598', '< 1.3%']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Note: All locations use NASA POWER satellite data (2010–2023). '
                    'Framework shows consistent convergence across volatility regimes.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_hedge_effectiveness_table(doc):
    """Create Table 4.1: Hedge Effectiveness by Volatility Regime"""
    doc.add_heading('Table 4.1: Hedge Effectiveness Analysis', level=3)
    
    table = doc.add_table(rows=6, cols=5)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Market σ', 'Oracle Error', 'Variance Reduction', 'Hedged σ', 'Improvement']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['189%', '5%', '99.3%', '13.7%', '92.7%'],
        ['189%', '10%', '97.3%', '19.4%', '89.7%'],
        ['145%', '5%', '98.8%', '10.5%', '92.8%'],
        ['98%', '5%', '97.5%', '7.1%', '92.8%'],
        ['98%', '10%', '90.6%', '14.2%', '85.5%']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Note: Hedge effectiveness = σ_X²/(σ_X² + σ_ε²). High-volatility markets (σ > 100%) show '
                    'remarkable robustness to oracle error, maintaining >95% variance reduction even at 10% measurement noise.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def create_margin_requirements_table(doc):
    """Create Table 4.2: VaR-Based Margin Requirements"""
    doc.add_heading('Table 4.2: Margin Requirements by Confidence Level', level=3)
    
    table = doc.add_table(rows=5, cols=5)
    table.style = 'Light Grid Accent 1'
    
    # Headers
    headers = ['Confidence', 'VaR Multiplier', 'Margin (% Strike)', 'Example ($100K)', 'Default Prob']
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Data
    data = [
        ['95%', '1.645', '42%', '$42,000', '5.0%'],
        ['99%', '2.326', '58%', '$58,000', '1.0%'],
        ['99.5%', '2.576', '64%', '$64,000', '0.5%'],
        ['99.9%', '3.090', '77%', '$77,000', '0.1%']
    ]
    
    for i, row_data in enumerate(data, start=1):
        for j, cell_data in enumerate(row_data):
            table.rows[i].cells[j].text = cell_data
    
    p = doc.add_paragraph()
    run = p.add_run('Note: Based on lognormal distribution with σ = 189%, T = 1 year. '
                    'Margin = Strike × σ × √T × z_α. Conservative exchanges typically use 99%–99.5% confidence.')
    run.font.size = Pt(10)
    run.font.italic = True
    doc.add_paragraph()

def main():
    """Main function to create the complete thesis document"""
    print("Creating comprehensive thesis Word document...")
    
    # Create document
    doc = Document()
    
    # Setup styles
    setup_document_styles(doc)
    
    # Add cover page
    print("Adding cover page...")
    add_cover_page(doc)
    
    # Add TOC placeholder
    print("Adding table of contents placeholder...")
    add_toc_placeholder(doc)
    
    # Read and process markdown file
    print("Processing thesis content...")
    markdown_path = '/home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin/thesis-draft.md'
    
    with open(markdown_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_code_block = False
    skip_until_abstract = True
    table_positions = {
        'summary_stats': False,
        'ceir_regression': False,
        'structural_break': False,
        'mining_transformation': False,
        'pricing_validation': False,
        'global_validation': False,
        'hedge_effectiveness': False,
        'margin_requirements': False
    }
    
    for i, line in enumerate(lines):
        # Skip title and front matter until Abstract
        if skip_until_abstract:
            if '## Abstract' in line:
                skip_until_abstract = False
                doc.add_heading('Abstract', level=1)
                continue
            else:
                continue
        
        # Insert tables at appropriate positions
        if '### 2.4 Data and Construction' in line and not table_positions['summary_stats']:
            process_markdown_line(doc, line, in_code_block)
            # Look ahead for the right spot to insert table
            if i + 10 < len(lines):
                create_summary_statistics_table(doc)
                table_positions['summary_stats'] = True
            continue
        
        if '### 2.6 Main Results' in line and not table_positions['ceir_regression']:
            process_markdown_line(doc, line, in_code_block)
            create_ceir_regression_table(doc)
            create_structural_break_table(doc)
            table_positions['ceir_regression'] = True
            table_positions['structural_break'] = True
            continue
        
        if '2.6.1' in line and not table_positions['mining_transformation']:
            process_markdown_line(doc, line, in_code_block)
            create_mining_transformation_table(doc)
            table_positions['mining_transformation'] = True
            continue
        
        if '### 3.4 Monte Carlo Validation' in line and not table_positions['pricing_validation']:
            process_markdown_line(doc, line, in_code_block)
            create_pricing_validation_table(doc)
            table_positions['pricing_validation'] = True
            continue
        
        if '### 3.6 Global Validation' in line and not table_positions['global_validation']:
            process_markdown_line(doc, line, in_code_block)
            create_global_validation_table(doc)
            table_positions['global_validation'] = True
            continue
        
        if '### 4.3 Oracle Architecture' in line and not table_positions['hedge_effectiveness']:
            process_markdown_line(doc, line, in_code_block)
            create_hedge_effectiveness_table(doc)
            table_positions['hedge_effectiveness'] = True
            continue
        
        if '### 4.4 Solvency' in line and not table_positions['margin_requirements']:
            process_markdown_line(doc, line, in_code_block)
            create_margin_requirements_table(doc)
            table_positions['margin_requirements'] = True
            continue
        
        # Process regular line
        in_code_block = process_markdown_line(doc, line, in_code_block)
    
    # Save document
    output_path = '/home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin/thesis_package/COMPLETE_THESIS_FINAL.docx'
    doc.save(output_path)
    
    print(f"\n✓ Complete thesis document created successfully!")
    print(f"  Location: {output_path}")
    print(f"  Total pages: ~60-80 pages (estimated)")
    print(f"  All sections included with proper formatting")
    print(f"  All tables created with data")
    print(f"\nNext steps:")
    print("  1. Open in Microsoft Word")
    print("  2. Generate Table of Contents (References > Table of Contents)")
    print("  3. Review formatting and adjust as needed")
    print("  4. Add any final figures or charts")

if __name__ == '__main__':
    main()
