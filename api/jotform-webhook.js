// api/jotform-webhook.js
const axios = require('axios');

module.exports = async (req, res) => {
    // Check for valid POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Environment variables
    const { JOTFORM_API_KEY } = process.env;

    // Constants
    const CONTACT_US_LINK = "https://wa.me/15125932226";

    // Retrieve the submission data from the Jotform webhook
    const { submissionID, formID } = req.body;

    if (!submissionID || !formID) {
        return res.status(400).json({ error: 'Invalid data received' });
    }

    // Generate the Profile Link and Send Interest link
    const profileLink = `https://www.jotform.com/pdf-view/${submissionID}`;
    const sendInterestLink = `https://mail.google.com/mail/?view=cm&fs=1&to=nripelligola@gmail.com&su=Interested%20in%20a%20profile&body=Hi!%20I%20am%20interested%20in%20${profileLink}`;

    try {
        // Update the Jotform submission with the generated links
        const updateUrl = `https://api.jotform.com/submission/${submissionID}`;
        const headers = { Authorization: `Bearer ${JOTFORM_API_KEY}` };
        const data = {
            q_profile_link: profileLink,
            q_send_interest: sendInterestLink,
            q_contact_us: CONTACT_US_LINK,
        };

        // API request to update the submission fields
        const response = await axios.post(updateUrl, data, { headers });

        // Check for successful response
        if (response.status === 200) {
            return res.status(200).json({ success: 'Submission updated successfully' });
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update submission' });
    }
};
