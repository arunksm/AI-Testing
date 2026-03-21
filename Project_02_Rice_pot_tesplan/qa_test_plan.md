# QA Test Plan - VWO Login Dashboard (app.vwo.com)

## 1. Test Plan Overview
This document outlines the strategy, process, and tools for testing the modernized VWO Login Dashboard. The focus is on ensuring a secure, high-performance, and accessible authentication experience that supports Multi-Factor Authentication (MFA) and Single Sign-On (SSO).

---

## 2. Test Scope

### In-Scope
*   **Functional:** Login flow, MFA (TOTP/SMS/Email), SSO (Okta, Google Workspace), Password Management.
*   **UX/UI:** Responsive design, Accessibility (WCAG 2.1 AA), Branding across Light/Dark modes.
*   **Backend/API:** Authentication endpoints, session management, security token handling.
*   **Non-Functional:** Performance (<2s load time), Security (Data encryption, Rate limiting).

### Out-of-Scope
*   Post-login product dashboard features (A/B testing tools, Insights).
*   Hardware-specific security keys (Yubikey) unless explicitly specified in later phases.
*   Legacy IE11 browser support.

---

## 3. Test Strategy

### Methodology
*   **Risk-Based Testing:** Focusing on authentication security and high-traffic performance.
*   **Shift-Left Approach:** Early API testing and developer-led unit tests before UI-level validation.

### Test Types
| Type | Objective | Tools |
| :--- | :--- | :--- |
| **Functional** | Validate login logic, MFA, and SSO redirection. | Playwright, Manual |
| **Integration** | Test interaction with IDPs (Google, Okta) and Backend services. | Playwright, Postman |
| **UI/UX** | Assure responsive layout and VWO branding compliance. | Playwright, Visual Regression |
| **API** | Verify status codes, error payloads, and JWT security. | Playwright (Request), Supertest |
| **Performance** | Load testing for high concurrency (peak traffic). | k6, JMeter |
| **Security** | OWASP Top 10, rate limiting, and session hijack prevention. | ZAProxy, Burp Suite |

---

## 4. Features to be Tested

### A. Authentication
*   **MFA Workflows:** 
    *   Setup/Enrollment (TOTP, SMS, Email).
    *   Bypass/Recovery using backup codes.
*   **SSO Integration:**
    *   SAML 2.0 (Okta/Active Directory).
    *   OAuth 2.0 (Google Workspace).
*   **Remember Me:** Browser persistence across sessions.

### B. User Experience
*   **Accessibility:** Screen reader support, Keyboard navigation, Focus management.
*   **Responsive UI:** Cross-browser (Chrome, Safari, Firefox) and mobile viewport testing.
*   **Theming:** Seamless transition between Light and Dark modes.

### C. Password Management
*   Forgot Password flow (Token expiry, Secure link delivery).
*   Password complexity validation (Real-time strength indicator).

---

## 5. Test Environment
*   **Staging:** `https://staging.vwo.com` (for integration and pre-deployment checks).
*   **Sandbox:** `https://sandbox.vwo.com` (for IDP mock configurations).
*   **Browsers:** Chrome (Latest), Firefox (Latest), Safari (Mac/iOS), Edge.
*   **Devices:** Pixel (Android), iPhone (iOS), Desktop (Mac/Windows).

---

## 6. Test Data Strategy
*   **Test Accounts:** Dedicated QA accounts for each MFA type and SSO provider.
*   **Mock Services:** Mock IDP responses for negative testing (Timeout, Failure).
*   **Data Cleanup:** Scripts to reset MFA/SSO settings post-execution.

---

## 7. Automation Strategy (Playwright)

### What to Automate
*   **Smoke Suite:** Critical login path (Username/Password, Basic SSO).
*   **Regression Suite:** MFA flows, Password Reset, Field validation.
*   **API Tests:** Endpoint security and JSON schema validation.
*   **Accessibility:** Automated Axe-core scans integrated into Playwright.

### What NOT to Automate
*   Initial UX/Branding "Look and Feel" feel.
*   Complex security "Honeypot" behavioral tests.
*   One-time physical device MFA (unless using SMS simulators).

---

## 8. Risk Analysis

| Risk | Impact | Mitigation Plan |
| :--- | :--- | :--- |
| **Security Breach** | High | Implement strict rate limiting, Argon2 hashing, and regular pen tests. |
| **IDP Downtime** | Medium | Provide clear fallback error messages and secondary email recovery. |
| **Performance Lag** | Medium | CDN optimization, lazy loading, and regular load testing via k6. |
| **MFA SMS Failure** | Low | Prioritize TOTP/Auth apps as the primary MFA recommendation. |

---

## 9. Dependencies
*   Stable Sandbox API access.
*   Credentials for test SSO providers (Okta/Google Workspace).
*   CI/CD pipeline availability (GitHub Actions/Jenkins).

---

## 10. Test Execution & Reporting

### Execution Cycles
1.  **Smoke:** After every deployment (Target: 5 mins).
2.  **Regression:** Daily nightly runs (Target: 2 hours).
3.  **Manual Exploratory:** Before major releases.

### Success Metrics (KPIs)
*   **Login Success Rate:** > 99.5%.
*   **Critical Defects:** 0 found in Production.
*   **Automation Coverage:** > 80% for critical workflows.
*   **TTI (Time to Interactive):** < 2 seconds.

---

## 11. Reporting
Results will be synchronized with **Confluence Xray** for stakeholder visibility.
*   **Daily Status:** Automated Playwright HTML reports.
*   **Release Summary:** Executive summary of defects and coverage.
