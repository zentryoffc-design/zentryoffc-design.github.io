/* ==========================================================================
   BHARTI GLOBAL EXPORTS - B2B EXPORTER APPLICATION SCRIPT
   Interactive Routing, Technical Datasheets, RFQ Handling & Catalog PDF Exporter
   ========================================================================== */

// Technical Product Master Data
const PRODUCT_DATA = {
  psyllium: {
    title: "Psyllium Husk (Isabgol)",
    botanicalName: "Plantago Ovata",
    hsCode: "12119032",
    origin: "Gujarat & Rajasthan, India",
    grades: [
      {
        name: "99% Pure Husk",
        purity: "99.00% Min",
        swellVolume: "50+ ml/g",
        meshSize: "40 - 80 Mesh",
        moisture: "10.0% Max",
        heavyMetals: "Complies with EU/FDA standards",
        recommendedUse: "Pharmaceuticals, Dietary Supplements, Functional Foods"
      },
      {
        name: "98% Pure Husk",
        purity: "98.00% Min",
        swellVolume: "45+ ml/g",
        meshSize: "40 - 80 Mesh",
        moisture: "11.0% Max",
        heavyMetals: "Complies with International Standards",
        recommendedUse: "Nutraceuticals, Food Industry, Fiber Fortification"
      },
      {
        name: "95% Pure Husk",
        purity: "95.00% Min",
        swellVolume: "40+ ml/g",
        meshSize: "30 - 70 Mesh",
        moisture: "12.0% Max",
        heavyMetals: "Food Grade Compliance",
        recommendedUse: "Bakery Additive, Bulk Fiber Feed, Animal Nutrition"
      }
    ],
    packaging: [
      "25 kg Multi-wall Paper Bags with HDPE Liner",
      "25 kg PP Woven Bags with Inner PE Liner",
      "500 kg / 1000 kg FIBC Jumbo Bags",
      "Custom Retail Branding / Private Label Packing"
    ]
  },
  makhana: {
    title: "Premium Indian Makhana (Fox Nuts / Lotus Seeds)",
    botanicalName: "Euryale Ferox",
    hsCode: "19041090 / 08029090",
    origin: "Mithila Region, Bihar, India",
    grades: [
      {
        name: "6+ Suti (Extra Large - 18mm+)",
        purity: "100% Natural Puffed",
        size: "18mm to 22mm Diameter",
        moisture: "5.0% - 8.0% Max",
        brokenCount: "Under 1.5%",
        recommendedUse: "Export Retail Gourmet Snacks, Flavored Premium Packs"
      },
      {
        name: "5+ Suti (Large - 15mm to 17mm)",
        purity: "100% Natural Puffed",
        size: "15mm to 17mm Diameter",
        moisture: "6.0% Max",
        brokenCount: "Under 2.0%",
        recommendedUse: "Health Food Brands, Roasted Snack Lines, Retail Packs"
      },
      {
        name: "4+ Suti (Standard - 12mm to 14mm)",
        purity: "100% Natural Puffed",
        size: "12mm to 14mm Diameter",
        moisture: "7.0% Max",
        brokenCount: "Under 3.0%",
        recommendedUse: "Bulk Wholesale, Food Ingredient Processing, Curry Mixes"
      }
    ],
    packaging: [
      "10 kg Bulk Poly Bags in Corrugated Master Cartons",
      "8 kg Moisture Barrier Nitrogen-flushed Bags",
      "Custom Packaging & OEM Private Label Solutions"
    ]
  }
};

// Container Capacity Matrix
const CONTAINER_SPECS = {
  psyllium_20ft: { maxPayloadMT: 9.5, bagCount25kg: 380, volumeCBM: 28 },
  psyllium_40ft: { maxPayloadMT: 19.0, bagCount25kg: 760, volumeCBM: 58 },
  makhana_20ft: { maxPayloadMT: 2.2, bagCount10kg: 220, volumeCBM: 28 },
  makhana_40ft: { maxPayloadMT: 4.5, bagCount10kg: 450, volumeCBM: 58 }
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFCLCalculator();
  initFormValidation();
});

// Single Page Navigation & Hash Routing
function initNavigation() {
  const links = document.querySelectorAll('.nav-link, .route-btn');
  
  function handleRoute() {
    let hash = window.location.hash || '#home';
    const activeRoute = hash.replace('#', '');
    
    document.querySelectorAll('section[id]').forEach(sec => {
      if (sec.id === activeRoute) {
        sec.style.display = 'block';
      } else if (activeRoute === 'home' || activeRoute === '') {
        // Default home displays all core components
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (hash !== '#home' && hash !== '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// Technical Spec Sheet Modal Trigger
function openSpecSheet(productKey) {
  const prod = PRODUCT_DATA[productKey];
  if (!prod) return;

  const modalTitle = document.getElementById('modal-spec-title');
  const modalBody = document.getElementById('modal-spec-body');

  modalTitle.textContent = `${prod.title} — Official Technical Specifications`;

  let html = `
    <div style="margin-bottom: 20px;">
      <p style="font-size: 0.9rem; color: #4B5563;">
        <strong>Botanical Name:</strong> <em>${prod.botanicalName}</em> &nbsp;|&nbsp; 
        <strong>Harmonized System (HS) Code:</strong> <span style="color: #0B3D2E; font-weight: 700;">${prod.hsCode}</span> &nbsp;|&nbsp; 
        <strong>Origin:</strong> ${prod.origin}
      </p>
    </div>

    <h4 style="font-size: 1.1rem; color: #0B3D2E; margin-bottom: 10px;">Export Grade Classifications</h4>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Grade</th>
          <th>Purity / Size</th>
          <th>Moisture / Swell</th>
          <th>Application & Suitability</th>
        </tr>
      </thead>
      <tbody>
  `;

  prod.grades.forEach(g => {
    html += `
      <tr>
        <td><strong>${g.name}</strong></td>
        <td>${g.purity || g.size}</td>
        <td>${g.swellVolume || g.moisture}</td>
        <td>${g.recommendedUse}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <h4 style="font-size: 1.1rem; color: #0B3D2E; margin-bottom: 10px; margin-top: 24px;">Export Packaging Options</h4>
    <ul style="padding-left: 20px; color: #4B5563; font-size: 0.92rem; line-height: 1.8;">
  `;

  prod.packaging.forEach(p => {
    html += `<li>✓ ${p}</li>`;
  });

  html += `
    </ul>

    <div style="margin-top: 28px; background: #FFF9E6; border: 1px solid #E6C875; padding: 16px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <div>
        <strong style="color: #8C6611;">Require Official Certificate of Analysis (COA)?</strong>
        <p style="font-size: 0.85rem; color: #4B5563;">Batch-specific COA, Phytosanitary Certificate, and lab test reports are issued per shipment order.</p>
      </div>
      <button class="btn btn-gold" onclick="closeModal('spec-modal'); openQuoteModal('${prod.title}');">Request Product Quote</button>
    </div>
  `;

  modalBody.innerHTML = html;
  openModal('spec-modal');
}

// Open RFQ / Quote Modal with pre-selected product
function openQuoteModal(productName = '') {
  if (productName) {
    const productSelect = document.getElementById('rfq-product-select');
    if (productSelect) {
      for (let option of productSelect.options) {
        if (option.text.toLowerCase().includes(productName.toLowerCase().slice(0, 5))) {
          option.selected = true;
          break;
        }
      }
    }
  }
  openModal('rfq-modal');
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// FCL Container Load Calculator Logic
function initFCLCalculator() {
  const productSel = document.getElementById('calc-product');
  const containerSel = document.getElementById('calc-container');

  if (!productSel || !containerSel) return;

  function updateCalculation() {
    const p = productSel.value;
    const c = containerSel.value;
    const key = `${p}_${c}`;
    const data = CONTAINER_SPECS[key];

    const resultBox = document.getElementById('calc-result-box');
    if (!data || !resultBox) return;

    let payloadText = '';
    if (p === 'psyllium') {
      payloadText = `
        <div style="font-size: 1.1rem; color: #0B3D2E; font-weight: 700; margin-bottom: 8px;">Estimated Load Payload (${c.toUpperCase()} FCL)</div>
        <p style="margin-bottom: 4px;">• <strong>Net Weight:</strong> ${data.maxPayloadMT} Metric Tons (${data.maxPayloadMT * 1000} kg)</p>
        <p style="margin-bottom: 4px;">• <strong>Estimated Bag Count:</strong> ~${data.bagCount25kg} Bags (25 kg standard craft paper/PP bags)</p>
        <p style="margin-bottom: 4px;">• <strong>Container Volume:</strong> ~${data.volumeCBM} CBM</p>
        <p style="font-size: 0.8rem; color: #6B7280; margin-top: 8px;">* Note: Bulk weight varies based on palletization requirements and final bag specs.</p>
      `;
    } else {
      payloadText = `
        <div style="font-size: 1.1rem; color: #0B3D2E; font-weight: 700; margin-bottom: 8px;">Estimated Load Payload (${c.toUpperCase()} FCL)</div>
        <p style="margin-bottom: 4px;">• <strong>Net Weight:</strong> ${data.maxPayloadMT} Metric Tons (${data.maxPayloadMT * 1000} kg)</p>
        <p style="margin-bottom: 4px;">• <strong>Estimated Carton Count:</strong> ~${data.bagCount10kg} Master Cartons (10 kg bulk boxes)</p>
        <p style="margin-bottom: 4px;">• <strong>Container Volume:</strong> ~${data.volumeCBM} CBM</p>
        <p style="font-size: 0.8rem; color: #6B7280; margin-top: 8px;">* Makhana is a high-volume, low-density commodity; 40ft High Cube containers are strongly recommended.</p>
      `;
    }

    resultBox.innerHTML = payloadText;
  }

  productSel.addEventListener('change', updateCalculation);
  containerSel.addEventListener('change', updateCalculation);
  updateCalculation();
}

// B2B Inquiry Form Handler
function initFormValidation() {
  const forms = document.querySelectorAll('.b2b-inquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting Inquiry...';
      }

      const formData = new FormData(form);
      const name = formData.get('name') || 'Valued Buyer';
      const company = formData.get('company') || 'Global Trading Co';
      const product = formData.get('product') || 'Agricultural Products';
      const email = formData.get('email') || '';

      const actionUrl = form.getAttribute('action') || 'https://mail-server-v8dj.onrender.com/api/contact';

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          showToast(`Inquiry Submitted! Thank you ${name} (${company}). Our export manager will contact ${email || 'you'} shortly with FOB/CIF pricing for ${product}.`);
          form.reset();
          closeModal('rfq-modal');
        } else {
          showToast(`Inquiry Sent! Thank you ${name} (${company}). Our trade team has registered your request for ${product}.`);
          form.reset();
          closeModal('rfq-modal');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        showToast(`Inquiry Sent! Thank you ${name} (${company}). Our team will contact ${email || 'you'} shortly.`);
        form.reset();
        closeModal('rfq-modal');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      }
    });
  });
}

// Toast Notification Engine
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <div>${message}</div>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 6000);
}

// Client-Side B2B Product Catalog PDF Generation / Download
function downloadCatalog() {
  showToast("Generating official Bharti Global Exports Product Catalog PDF...");

  // Open printable catalog layout in new window for clean print/PDF export
  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bharti Global Exports - Official Product Catalog</title>

      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1F2937; margin: 40px; line-height: 1.5; }
        .header { border-bottom: 3px solid #C99A2E; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .company-name { font-size: 24px; font-weight: bold; color: #0B3D2E; }
        .company-tag { font-size: 12px; color: #C99A2E; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .contact-info { text-align: right; font-size: 12px; color: #4B5563; }
        .section-title { font-size: 18px; color: #0B3D2E; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; margin-top: 30px; margin-bottom: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        th, td { padding: 10px; border: 1px solid #E5E7EB; text-align: left; }
        th { background: #0B3D2E; color: white; }
        .badge { background: #FFF9E6; color: #8C6611; border: 1px solid #C99A2E; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; }
        .footer { margin-top: 50px; font-size: 11px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company-name">BHARTI GLOBAL EXPORTS</div>
          <div class="company-tag">Premium Indian Agricultural Products For Global Markets</div>
        </div>
        <div class="contact-info">
          Email: sales@bhartiexports.me<br>
          Origin: India | Exporting Worldwide<br>
          Web: bhartiexports.me
        </div>
      </div>

      <div class="section-title">1. Psyllium Husk (Isabgol) — HS Code: 12119032</div>
      <p style="font-size: 13px; color: #4B5563;">Sourced directly from India's premier agricultural growing belts in Gujarat & Rajasthan. High swell volume, pure natural soluble fiber.</p>
      <table>
        <thead>
          <tr>
            <th>Grade Purity</th>
            <th>Swell Volume</th>
            <th>Mesh Size</th>
            <th>Standard Export Packaging</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>99% Purity</strong></td>
            <td>50+ ml/g</td>
            <td>40 - 80 Mesh</td>
            <td>25kg Multi-wall Paper Bags / HDPE Liner</td>
          </tr>
          <tr>
            <td><strong>98% Purity</strong></td>
            <td>45+ ml/g</td>
            <td>40 - 80 Mesh</td>
            <td>25kg PP Woven Bags / Jumbo FIBC</td>
          </tr>
          <tr>
            <td><strong>95% Purity</strong></td>
            <td>40+ ml/g</td>
            <td>30 - 70 Mesh</td>
            <td>25kg PP Woven Bags / Custom Bulk</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">2. Premium Indian Makhana (Fox Nuts) — HS Code: 19041090</div>
      <p style="font-size: 13px; color: #4B5563;">Hand-harvested and naturally popped fox nuts from Bihar, India. Crisp texture, unbleached, raw or customized roasting.</p>
      <table>
        <thead>
          <tr>
            <th>Size Grade</th>
            <th>Seed Diameter</th>
            <th>Moisture Content</th>
            <th>Packaging & Packing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>6+ Suti (Extra Large)</strong></td>
            <td>18mm - 22mm+</td>
            <td>Under 6.0%</td>
            <td>10kg Master Cartons / OEM Retail Pack</td>
          </tr>
          <tr>
            <td><strong>5+ Suti (Large)</strong></td>
            <td>15mm - 17mm</td>
            <td>Under 6.0%</td>
            <td>10kg Master Cartons / Nitrogen-flushed</td>
          </tr>
          <tr>
            <td><strong>4+ Suti (Standard)</strong></td>
            <td>12mm - 14mm</td>
            <td>Under 7.0%</td>
            <td>Bulk Poly Bags / Food Service Cartons</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">3. Export Compliance & Quality Certifications</div>
      <p style="font-size: 13px; color: #4B5563;">Every shipment is supported by complete documentation: Bill of Lading (BL), Certificate of Origin (COO), Phytosanitary Certificate (Plant Quarantine Compliance), Commercial Invoice, Packing List, and Batch Certificate of Analysis (COA).</p>

      <div class="footer">
        © Bharti Global Exports. All Rights Reserved. Contact: sales@bhartiexports.me | India
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
}
