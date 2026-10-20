# Connecting Your Google Sheet to Aurelian International Website

Your Google Sheet URL:
**[https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit](https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit)**

Because Google accounts require your account authorization to access your private spreadsheets and send emails from your Google account, follow these **3 quick steps** (takes under 2 minutes):

---

### Step 1: Open Apps Script in your Google Sheet
1. Open your sheet: [https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit](https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit)
2. In the top Google Sheets menu, click: **Extensions** > **Apps Script**
3. Delete all default text (`function myFunction() { ... }`) in the editor.

---

### Step 2: Paste the Script Code
1. Copy the full code from [`backend/google-apps-script.gs`](google-apps-script.gs) (or from the chat).
2. Paste it into the Apps Script editor.
3. Click the **Save** icon (disk icon) or press `Ctrl + S`.

*(Note: The script is already pre-configured with your exact Sheet ID `1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc` and email `aurelianinternational@gmail.com`. It will also automatically format gold column headers if your sheet is blank!)*

---

### Step 3: Deploy as a Web App
1. At the top right of Apps Script, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and pick **Web app**.
3. Set the following:
   - **Description**: `Aurelian Live Enquiries`
   - **Execute as**: **Me (aurelianinternational@gmail.com)**
   - **Who has access**: **Anyone** *(Essential: allows your website visitors to submit forms)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, select your Google account, click **Advanced**, and click **Go to Untitled project (unsafe)** -> **Allow**.
6. **Copy the Web app URL** (it ends with `/exec`, like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 4: Paste the URL into `.env`
Open your website's `.env` file in the project folder and paste your URL:
```env
VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_DEPLOYED_ID_HERE/exec"
```
Or paste the URL directly in our chat, and I will connect it to your website configuration automatically!
