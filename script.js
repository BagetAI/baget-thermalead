document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Live DPE Data
    const dbId = '86804155-d2a2-44e6-899d-3d62e9f4dc86';
    const tableBody = document.getElementById('dpe-body');

    async function fetchLeads() {
        try {
            const response = await fetch(`https://baget.ai/api/public/databases/${dbId}/rows`);
            const result = await response.json();
            
            if (result.rows && result.rows.length > 0) {
                tableBody.innerHTML = '';
                result.rows.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.address || 'N/A'}</td>
                        <td><span class="badge rating-${(row.energy_class || 'G').toLowerCase()}">${row.energy_class || 'G'}</span></td>
                        <td>${row.heating_type || 'Fuel Oil'}</td>
                        <td>${row.surface_m2 ? row.surface_m2 + 'm²' : 'N/A'}</td>
                        <td class="mono-cyan">${row.diagnostic_date || '2026-04-20'}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No active leads in current query.</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #E30613;">Error: UNABLE_TO_ESTABLISH_DATA_LINK</td></tr>';
        }
    }

    fetchLeads();

    // 2. Waitlist Form Submission
    const waitlistForm = document.getElementById('waitlist-form');
    const formResponse = document.getElementById('form-response');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            
            formResponse.textContent = '// SENDING_ENCRYPTED_PACKET...';
            formResponse.style.color = 'var(--cyan)';

            try {
                const response = await fetch('https://baget.ai/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyId: '7f904039-2826-44ad-8b76-c42b06127c06',
                        email: email,
                        name: name
                    })
                });

                if (response.ok) {
                    formResponse.textContent = '// SUCCESS: ACCESS_REQUEST_LOGGED';
                    formResponse.style.color = 'var(--trust-green)';
                    waitlistForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                formResponse.textContent = '// ERROR: UPLINK_INTERRUPTED';
                formResponse.style.color = 'var(--dpe-g)';
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
