# CivicHQ — Grand Vista Heights Society & Housing Management Platform

CivicHQ is an enterprise-grade, full-stack Housing Society & Residential Community Management Application built for modern apartment complexes, gated communities, and Resident Welfare Associations (RWAs). It streamlines community operations, financial transparency, facility bookings, visitor gate pass management, maintenance helpdesk, emergency panic dispatches, and GDPR security compliance into a unified interface.

---

## 🌟 Key Features & Functional Modules

### 1. 📊 Executive Overview Dashboard
* **Society KPIs**: Real-time visual metrics for maintenance collection, active gate passes, open helpdesk tickets, and facility reservations.
* **Emergency Panic SOS**: Immediate dispatch button broadcasting high-priority alerts with unit location parameters to Gate 1 Security and Estate Managers.
* **Role Switcher**: Seamlessly switch between **Resident**, **RWA Admin**, and **Security Guard** views to test role-based access permissions.

### 2. 💳 Dues Billing & Financial Portal
* **Maintenance & Utility Tracking**: Detailed breakdowns of society dues, water surcharges, elevator AMC fees, and parking bay charges.
* **Payment Processing**: Integrated digital payment workflows with instant receipt generation and PDF download capabilities.
* **Resident Payment History**: Historical log of cleared bills and pending dues.

### 3. 🎾 Amenity & Facility Booking System
* **Time-Slot Allocation**: Book society facilities including the Clubhouse, Tennis Courts, Swimming Pool, and Sky Lounge.
* **Deposit & Fee Management**: Automated refundable security deposit calculation and hourly pricing.
* **Digital Access Pass**: Instant QR pass generation for booked slots with cancellation and refund tracking.

### 4. 📢 Digital Notice Board & Community Polls
* **Official Broadcasts**: Emergency directives, maintenance schedules, and event announcements.
* **AI-Assisted Drafts**: AI integration powered by Gemini for RWA admins to draft polite, clear society announcements.
* **Interactive Polls**: Democratic voting on community proposals with real-time percentage progress indicators.

### 5. 🚪 Gate Security & Visitor Management
* **Guest & Delivery Passes**: Pre-approve visitors, cabs, contractors, and delivery personnel with unique 6-digit access codes and QR passes.
* **Security Guard Gate Log**: Real-time check-in/check-out timestamp logging with vehicle number verification.
* **Overnight Visitor Tracking**: Automated flags for guest vehicles parked past authorized time limits.

### 6. 🔧 Maintenance Helpdesk & Service Desk
* **Ticket Logging**: File maintenance requests for plumbing, electrical, elevator, or common area issues with image attachments and priority tags.
* **Staff Assignment**: RWA admin workflow to assign internal maintenance staff and track SLA status.
* **Satisfaction Feedback**: Resident rating system (1-5 stars) upon ticket resolution.

### 7. 👥 Community Hub, Directory & Marketplace
* **Resident Directory**: Filterable directory of resident profiles, tower numbers, and emergency contacts.
* **Vehicle Finder**: Search vehicle registration numbers and parking bay allocations with one-click courtesy parking pings.
* **Peer Marketplace**: Resident classifieds to buy/sell items, rent parking bays, or borrow tools.
* **Events Calendar**: Community cultural events and RWA townhalls with RSVP attendance tracking.

### 8. 📈 Financial Ledger & Real-Time Analytics
* **Revenue vs. Expense Tracking**: Interactive Recharts analytics displaying monthly collection trends and expense categories.
* **Financial Balance Sheet**: Complete RWA reserve fund breakdown and downloadable audit reports (CSV/PDF).

### 9. 🛡️ Security, RBAC & GDPR Compliance Center
* **Role-Based Access Control (RBAC)**: Fine-grained permission matrix enforced across Resident, Admin, and Security roles.
* **Data Security & Encryption**: AES-256 data encryption standards, TLS 1.3 in-transit protections, and sensitive PII masking.
* **GDPR Data Portability (Art. 15)**: Export complete personal data archives in JSON format.
* **Right to be Forgotten (Art. 17)**: Execute permanent user anonymization upon verified confirmation.
* **Cloud State Backup & Restore**: Full JSON database snapshot export and restore capabilities.
* **Audit Trail**: Real-time log tracking administrative and security actions.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion, Recharts.
* **Backend**: Express.js, Node.js (`server.ts`), Vite Dev Server Middleware.
* **AI Integration**: Server-side Google Gemini API (`@google/genai`) proxy endpoint `/api/generate-notice`.
* **State & Persistence**: React Context (`SocietyContext`), LocalStorage persistence, and JSON State Backup & Restore.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: Version 18.x or higher
* **npm**: Version 9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/civichq-society-management.git
   cd civichq-society-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 📜 Available Scripts

* `npm run dev`: Starts the Express + Vite server with direct TypeScript support (`tsx server.ts`).
* `npm run build`: Bundles the client app with Vite and compiles the backend server into CommonJS (`dist/server.cjs`) using `esbuild`.
* `npm run start`: Runs the compiled production server (`node dist/server.cjs`).
* `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## 🔒 Security & Privacy

This application implements privacy-by-design principles adhering to GDPR Article 15 (Right of Access) and Article 17 (Right to Erasure). All sensitive PII (phones, card numbers) can be masked in the UI, and cloud snapshots are encrypted with AES-256.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
