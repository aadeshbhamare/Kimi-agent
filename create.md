# Hardware and Software Requirements Specification

- **[algorithm.md](file:///c:/Users/DELL/Downloads/Kimi_Agent_插件列表/algorithm.md)** — Master Website Algorithm & Architecture Specification (Step 1 Mandatory Login)
- **[REQUIREMENTS.md](file:///c:/Users/DELL/Downloads/Kimi_Agent_插件列表/REQUIREMENTS.md)** — Hardware & Software Requirements Specification
- **[METHODOLOGY.md](file:///c:/Users/DELL/Downloads/Kimi_Agent_插件列表/METHODOLOGY.md)** — Traffic Violation Detection System Methodology (Chapter 3)

---

## Quick Reference Summary

### Hardware Requirements (H/W)
- **Client / End User:** Dual-Core 1.8 GHz+ (i3/Ryzen 3/M1), 4 GB RAM (8 GB recommended), 2 GB free disk space, 1080p display, 2+ Mbps internet.
- **Development Machine:** Quad-core 2.5 GHz+ (i5/i7/Ryzen 5/M-series), 16 GB RAM, 20 GB+ NVMe SSD, optional NVIDIA GPU (RTX 3060+) for local ML models.
- **Production Server:** 4–8 vCPU, 8–16 GB RAM, 100 GB NVMe SSD, 1 Gbps network (or Netlify/Cloudflare Serverless Edge).

### Software Requirements (S/W)
- **Operating Systems:** Windows 10/11 (64-bit), macOS 12+, Ubuntu Linux 20.04/22.04 LTS.
- **Browsers:** Google Chrome 110+, Microsoft Edge 110+, Mozilla Firefox 115+, Apple Safari 16+.
- **Frontend Core:** Node.js 20+ LTS, npm 10+, Vite 7.2+, React 19, TypeScript 5.9+, Tailwind CSS 3.4+.
- **Backend & AI:** Python 3.10+ (FastAPI), PostgreSQL 15+ (`pgvector`), PyMuPDF, LayoutLMv3, Tesseract OCR.
- **Authentication & Email:** Firebase Auth, Google OAuth 2.0, SMTP / SendGrid / AWS SES.
