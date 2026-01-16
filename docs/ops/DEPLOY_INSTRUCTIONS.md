# 🚀 How to Go Live (Grant-Ready Deployment)

Your SolarPunk DApp is built and MVP/testnet-ready. Here are the two best ways to get it online so you can include a URL in your Grant Proposal.

## Option 1: Vercel (Recommended - Fastest & Best Performance)
Vercel is the industry standard for React apps. It's free and takes 30 seconds.

1.  **Install Vercel CLI** (if you haven't):
    ```bash
    npm install -g vercel
    ```
2.  **Deploy**:
    Run this command inside the `frontend` folder:
    ```bash
    cd frontend
    vercel
    ```
3.  **Follow the prompts:**
    - Set up and deploy? **Yes**
    - Scope? **[Your Name]**
    - Link to existing project? **No**
    - Project Name? **solarpunk-protocol**
    - Directory? **./** (default)
    - Settings? **No** (It detects Vite automatically)

🎉 **Result:** You will get a link like `https://solarpunk-protocol.vercel.app`. **Put this in your grant proposal.**

---

## Option 2: GitHub Pages (Completely Free & Open Source)
I have already set up a GitHub Action (`.github/workflows/deploy.yml`) for this.

1.  **Create a Repository** on GitHub (e.g., `Solarpunk-bitcoin`).
2.  **Push your code**:
    ```bash
    git add .
    git commit -m "Deploy SolarPunk Protocol MVP"
    git remote add origin https://github.com/[YOUR_USERNAME]/Solarpunk-bitcoin.git
    git push -u origin main
    ```
3.  **Activate Pages**:
    - Go to GitHub Repo **Settings** -> **Pages**.
    - Source: Select **GitHub Actions**.
    
🎉 **Result:** After about 2 minutes, your site will be live at `https://[YOUR_USERNAME].github.io/Solarpunk-bitcoin/`.

---

## ✅ Checklist for Grant Submission
- [ ] **Deploy the Frontend** (using Vercel or GitHub).
- [ ] **Copy the Live URL**.
- [ ] **Paste the URL** into `GRANT_PROPOSAL.md` under the "Link to Demo" section.
- [ ] **Take Screenshots** of the dark-mode UI and include them in your submission deck.
