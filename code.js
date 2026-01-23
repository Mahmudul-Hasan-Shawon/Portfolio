// Update doGet function
// Update doGet function to handle FAQ request
function doGet(e) {
    if (e && e.parameter.action === 'getProjects') {
        return getProjectsData();
    }

    if (e && e.parameter.action === 'getTestimonials') {
        return getTestimonialsData();
    }

    if (e && e.parameter.action === 'getRequirements') {
        return getProjectRequirements();
    }

    if (e && e.parameter.action === 'getFAQs') {
        return getFAQs();
    }

    return ContentService
        .createTextOutput("Contact form backend is running.")
        .setMimeType(ContentService.MimeType.TEXT);
}

// ... KEEP YOUR getProjectsData function below ...
function getProjectsData() {
    // 1. Define your Spreadsheet ID here (extracted from your URL)
    const SPREADSHEET_ID = "1GtxfyKUN1WLkUVZSQfKlM2zPdilqgbYwFVXguFKeIlY";

    // 2. Open the specific spreadsheet by ID
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 3. Get the sheet named "Project"
    const sheet = ss.getSheetByName("Project");

    if (!sheet) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: "Sheet 'Project' not found" }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const projects = [];

    // Start from row 1 (skip header row at index 0)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];

        // Helper to extract FontAwesome class from the HTML string in the sheet
        const iconHtml = row[4] || "";
        const iconMatch = iconHtml.match(/fa-[\w-]+/);
        const iconClass = iconMatch ? iconMatch[0] : "fa-code"; // Default if empty

        projects.push({
            id: i,
            title: row[0],        // Project Name
            description: row[1],   // Project Description
            category: row[2],     // Category
            tag: row[3],          // TAG
            icon: iconClass,       // Cleaned Icon Class
            status: row[5],       // Status
            link: row[6],         // View Details Link
            linkStatus: row[7]    // View Details Status
        });
    }

    return ContentService
        .createTextOutput(JSON.stringify(projects))
        .setMimeType(ContentService.MimeType.JSON);
}


// Add this function to get testimonials
function getTestimonialsData() {
    const SPREADSHEET_ID = "1GtxfyKUN1WLkUVZSQfKlM2zPdilqgbYwFVXguFKeIlY";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Client Testimonials");

    if (!sheet) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: "Sheet 'Client Testimonials' not found" }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const testimonials = [];

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0]) continue; // Skip empty rows

        testimonials.push({
            id: i,
            username: row[0] || "",
            country: row[1] || "",
            service: row[2] || "",
            testimonial: row[3] || "",
            stars: parseInt(row[4]) || 5,
            initials: (row[0] || "").charAt(0).toUpperCase()
        });
    }

    return ContentService
        .createTextOutput(JSON.stringify(testimonials))
        .setMimeType(ContentService.MimeType.JSON);
}

// Add this function to get FAQs from Google Sheet
function getFAQs() {
    const SPREADSHEET_ID = "1GtxfyKUN1WLkUVZSQfKlM2zPdilqgbYwFVXguFKeIlY";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("FAQ");

    if (!sheet) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: "Sheet 'FAQ' not found" }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const faqs = [];

    // Start from row 1 (skip header row)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];

        // Skip empty rows
        if (!row[0] || row[0].toString().trim() === '') continue;

        faqs.push({
            id: i,
            question: row[0]?.toString().trim() || "",
            answer: row[1]?.toString().trim() || ""
        });
    }

    return ContentService
        .createTextOutput(JSON.stringify(faqs))
        .setMimeType(ContentService.MimeType.JSON);
}


// Add this function to get project requirements
function getProjectRequirements() {
    const SPREADSHEET_ID = "1GtxfyKUN1WLkUVZSQfKlM2zPdilqgbYwFVXguFKeIlY";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Project Requirements");

    if (!sheet) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: "Sheet 'Project Requirements' not found" }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const requirements = {
        projectTypes: [],
        timelines: [],
        budgets: []
    };

    // Start from row 1 (skip header)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];

        // Add project type if not empty
        if (row[0] && row[0].trim() !== '') {
            requirements.projectTypes.push(row[0].trim());
        }

        // Add timeline if not empty
        if (row[1] && row[1].trim() !== '') {
            requirements.timelines.push(row[1].trim());
        }

        // Add budget if not empty
        if (row[2] && row[2].trim() !== '') {
            requirements.budgets.push(row[2].trim());
        }
    }

    // Remove duplicates
    requirements.projectTypes = [...new Set(requirements.projectTypes)];
    requirements.timelines = [...new Set(requirements.timelines)];
    requirements.budgets = [...new Set(requirements.budgets)];

    return ContentService
        .createTextOutput(JSON.stringify(requirements))
        .setMimeType(ContentService.MimeType.JSON);
}




function doPost(e) {
    const data = JSON.parse(e.postData.contents);

    const htmlBody = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 20px !important;
                border-radius: 8px !important;
            }

            .content-table {
                width: 100% !important;
                display: block !important;
            }

            .content-cell {
                width: 100% !important;
                display: block !important;
                padding-bottom: 12px !important;
            }

            .two-column {
                width: 100% !important;
                display: block !important;
            }
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#ffffff; font-family: 'Inter', Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0px;">
        <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="560" cellpadding="0" cellspacing="0" class="container"
                    style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.05);max-width:100%;">

                    <!-- Header with Your Logo -->
                    <tr>
                        <td style="padding-bottom:32px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="40" valign="top" style="padding-right:12px;">
                                        <img data-emoji="📩" class="an1" alt="📩" aria-label="📩" draggable="false"
                                            src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f4e9/32.png"
                                            loading="lazy">
                                    </td>

                                    <td valign="top">
                                        <h1 style="margin:0 0 2px 0; font-size:15px; color:#0f172a; font-weight:600;">
                                            New Message Received
                                        </h1>
                                        <p style="margin:0; color:#64748b; font-size:12px;">
                                            Portfolio contact form
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contact Details -->
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" class="content-table"
                                style="margin-bottom:32px; display:inline-table;">

                                <tr>
                                    <td width="50%" class="two-column content-cell"
                                        style="padding-bottom:16px; vertical-align:top;">
                                        <div>
                                            <p
                                                style="margin:0 0 4px 0; color:#64748b; font-size:12px; font-weight:500;">
                                                Name
                                            </p>
                                            <p style="margin:0; color:#0f172a; font-size:14px; font-weight:500;">
                                                ${data.name}
                                            </p>
                                        </div>
                                    </td>

                                    <td width="50%" class="two-column content-cell"
                                        style="padding-bottom:16px; vertical-align:top;">
                                        <div>
                                            <p
                                                style="margin:0 0 4px 0; color:#64748b; font-size:12px; font-weight:500;">
                                                Email
                                            </p>
                                            <a href="mailto:${data.email}"
                                                style="color:#0284c7; text-decoration:none; font-size:14px; font-weight:500;">
                                                ${data.email}
                                            </a>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%" class="two-column content-cell"
                                        style="padding-bottom:16px; vertical-align:top;">
                                        <div>
                                            <p
                                                style="margin:0 0 4px 0; color:#64748b; font-size:12px; font-weight:500;">
                                                Project Type
                                            </p>
                                            <p style="margin:0; color:#0f172a; font-size:14px;">
                                                ${data.projectType || "—"}
                                            </p>
                                        </div>
                                    </td>

                                    <td width="50%" class="two-column content-cell"
                                        style="padding-bottom:16px; vertical-align:top;">
                                        <div>
                                            <p
                                                style="margin:0 0 4px 0; color:#64748b; font-size:12px; font-weight:500;">
                                                Timeline
                                            </p>
                                            <p style="margin:0; color:#0f172a; font-size:14px;">
                                                ${data.timeline || "—"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="2" style="padding-bottom:16px;">
                                        <div>
                                            <p
                                                style="margin:0 0 4px 0; color:#64748b; font-size:12px; font-weight:500;">
                                                Budget
                                            </p>
                                            <p style="margin:0; color:#10b981; font-size:14px; font-weight:600;">
                                                ${data.budget || "—"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td>
                            <div style="margin-bottom:32px;">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                                    <p style="margin:0; color:#64748b; font-size:13px; font-weight:500;">Message</p>
                                </div>
                                <div style="
                  background:#f8fafc;
                  padding:20px;
                  border-radius:8px;
                  color:#334155;
                  font-size:14px;
                  line-height:1.5;
                  border-left:3px solid #3b82f6;
                ">
                                    ${data.message}
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="border-top:1px solid #e2e8f0; padding:12px 0;"></td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="text-align:center;">
                            <div style="display:inline-flex; align-items:center; gap:4px; margin-bottom:8px;">
                                <p style="margin:0; color:#94a3b8; font-size:12px;">
                                    Sent from your portfolio • ${new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;

    MailApp.sendEmail({
        to: "mhshan177@gmail.com", // change this
        replyTo: data.email,
        subject: `New message from ${data.name}`,
        htmlBody: htmlBody
    });

    return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
}

