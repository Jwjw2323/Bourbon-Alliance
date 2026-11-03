# Bourbon Alliance (bourbonalliance.net)

The community-driven whiskey intelligence platform tracking independent non-state liquor store allocations, farm distillery releases, fair price ceilings, and verified anonymous drop sightings across Washington, D.C., Maryland, and Virginia.

---

## Key Features

1. **Live Drop Radar:** Real-time crowdsourced sightings of allocated bottles (Blanton's, John J. Bowman, Eagle Rare, Weller, E.H. Taylor, Stagg, Russell's Reserve 13, Midwinter Night's Dram) across DC, MD, and VA.
2. **Anonymous Whistleblower Hotline:** Safe, zero-logging reporting portal for store clerks (state or independent), farm distillery staff, delivery drivers, and local scouts. Generates single-use tracking receipts (`BA-XXXXX`) with zero personal data logged.
3. **DMV Store & Distillery Directory:** Comprehensive roster of independent off-premises retailers filtered by DC ABCA Class A, Maryland county Class A licenses, and Virginia Farm Distilleries / ABC drop hubs.
4. **Price Ceiling & Gouge Radar:** Real-time comparison of retail shelf price against distillery MSRP, fair alliance ceilings, and secondary market values.
5. **Google OAuth Authentication:** Optional login for users to save favorite stores, bookmark bottles, track custom alerts, and maintain community reputation while preserving full anonymous posting rights.

---

## Regional Licensing & Store Discovery

- **Washington, D.C. (100% Non-State):** D.C. has no state-run ABC stores. All ~260 retail spirits stores operate under an ABCA **Retailer's License Class A**. Records are openly available via the DC Open Data Socrata portal.
- **Maryland (Hybrid County Model):** Montgomery County ABS operates county retail spirits stores, while the other 23 Maryland jurisdictions (Baltimore City, Baltimore County, Prince George's, Anne Arundel, Howard, Frederick, etc.) are private retail markets with Class A (Beer, Wine & Liquor) licenses.
- **Virginia (State ABC & Independent Farm Distilleries):** Virginia is a Control State running ~400 state ABC stores. However, licensed **Limited Distilleries and Artisan Distilleries** (e.g. A. Smith Bowman in Fredericksburg, Catoctin Creek in Purcellville, Copper Fox in Sperryville/Williamsburg, Ragged Branch, Reservoir) sell bottles directly to consumers from their licensed retail tasting rooms.

---

## Modular Docker Containerization & Deployment

Bourbon Alliance is containerized with a hardened multi-stage build running an unprivileged Alpine runner with automated healthchecks and resource limits.

### Run with Docker Compose

```bash
# 1. Build and start containers in background
docker compose up -d --build

# 2. View container health & logs
docker compose ps
docker compose logs -f bourbon-alliance-web

# 3. View live CPU and memory usage
docker stats bourbon_alliance_web
```

### Standard Node.js Run (Without Docker)

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start preview server on port 3000
npm run preview -- --port 3000 --host 0.0.0.0
```

---

## License
MIT License.
