document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Live DPE Data (Public Database)
    const leadsDbId = '86804155-d2a2-44e6-899d-3d62e9f4dc86';
    const tableBody = document.getElementById('dpe-body');

    async function fetchLeads() {
        try {
            const response = await fetch(`https://baget.ai/api/public/databases/${leadsDbId}/rows`);
            const result = await response.json();
            
            if (result && result.length > 0) {
                tableBody.innerHTML = '';
                // Limit to 6 for the preview
                result.slice(0, 6).forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.address || 'Confidential'}</td>
                        <td><span class="badge rating-${(row.energy_class || 'G').toLowerCase()}">${row.energy_class || 'G'}</span></td>
                        <td>${row.heating_type || 'Gas/Oil'}</td>
                        <td>${row.surface_m2 ? row.surface_m2 + 'm²' : 'N/A'}</td>
                        <td class="mono-cyan">${row.diagnostic_date || '2026-04-26'}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Searching ADEME archives for recent filings...</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #E30613;">Error: DPE_UPLINK_OFFLINE</td></tr>';
        }
    }

    fetchLeads();

    // 2. Waitlist Form Submission (Private/Agent Database)
    const signupDbId = 'db92851e-93b3-49e0-8af3-525bfce99a5a';
    const waitlistForm = document.getElementById('waitlist-form');
    const formResponse = document.getElementById('form-response');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                geographic_zone: document.getElementById('geographic_zone').value,
                company_type: document.getElementById('company_type').value,
                source: window.location.href
            };
            
            formResponse.textContent = '// TRANSMITTING_ENCRYPTED_SIGNATURE...';
            formResponse.style.color = 'var(--cyan)';

            try {
                const response = await fetch(`https://baget.ai/api/public/databases/${signupDbId}/rows`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: formData })
                });

                if (response.ok) {
                    formResponse.textContent = '// UPLINK_SUCCESS: ACCESS_LOGGED_IN_DATABASE';
                    formResponse.style.color = 'var(--trust-green)';
                    waitlistForm.reset();
                    
                    // Analytics tracking (simulated)
                    console.log('Lead captured in Agent Database:', signupDbId);
                } else {
                    throw new Error('Database rejection');
                }
            } catch (error) {
                formResponse.textContent = '// ERROR: HANDSHAKE_FAILED_TRY_AGAIN';
                formResponse.style.color = 'var(--dpe-g)';
            }
        });
    }

    // Smooth Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
