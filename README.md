# IT Security Tracker

Full-stack aplikacija za pracenje zaposlenih, uredjaja i sigurnosnih incidenata.

Repo:
- `ITSecurity/` - Spring Boot backend (REST API + H2 + PDF report)
- `frontend/it-security/` - Angular frontend
- `CLI/` - C++ terminal app koja koristi backend API

## Sta je implementirano

- Employees: CRUD, paginacija, bulk import, CSV export
- Devices: CRUD, paginacija, bulk import, CSV export
- Incidents: CRUD, filteri (date/serialNumber/deviceType), import po `email + serialNumber`
- AI:
  - generisanje uredjaja: `POST /api/devices/ai/generate?count=10`
  - generisanje incidenata: `POST /api/incidents/ai-generate`
- Reports: dnevni PDF (`/api/reports/daily`)
- Frontend: UI za incidents/devices/employees + toast error handling
- CLI: kreiranje employee/device/incident, sync employees u CSV, prikaz incidenata u fajl + terminal, slanje incidenata na backend

## Pokretanje

### Backend

Iz `ITSecurity/`:

```powershell
./mvnw spring-boot:run
```

- API: `http://localhost:8080`
- H2 console: `http://localhost:8080/h2-console`
- JDBC: `jdbc:h2:file:./data/securitydb`
- user: `sa`, password: prazno

### Frontend

Iz `frontend/it-security/`:

```powershell
npm install
npm start
```

- App: `http://localhost:4200`

### CLI

CLI kod je u `CLI/` (`CLI.slnx`, `CLI.vcxproj`).

Trenutni meni:
1. `Create Incident` (lokalno u memoriji)
2. `Create Device` (salje odmah na backend)
3. `Create Employee` (salje odmah na backend)
4. `Store Entries in DB` (salje lokalno sacuvane incidente na backend)
5. `Track New Incidents` (uzima incidente sa backenda i upisuje u fajl)
6. `Sync Employees with Backend` (uzima employees i cuva CSV)

## Kratak API pregled

- Employees: `/api/employees`, `/api/employees/all`, `/api/employees/bulk/import`, `/api/employees/bulk/export`
- Devices: `/api/devices`, `/api/devices/all`, `/api/devices/bulk/import`, `/api/devices/bulk/export`
- Incidents: `/api/incidents`, `/api/incidents/importIncident`
- AI: `/api/devices/ai/generate`, `/api/incidents/ai-generate`
- Reports: `/api/reports/daily`

## Napomene

- CORS je podesen za `http://localhost:4200`.
- `/api/**` je trenutno otvoren u security konfiguraciji.
- CLI opcija `Track New Incidents` trenutno radi single fetch (nije kontinuirani polling).
- Frontend trenutno nema poseban UI za AI endpointe (pozivaju se direktno preko API-ja/Postman-a).
- Za AI konfiguraciju koriste se `AI_GROQ_API_KEY` (incidenti) i `huggingface.api.key` (device AI).

## Autori

- Jovan Hrnjak
- Bozidar Radosavljevic
- Damjan Ilic
- Dimitrije Jelisavcic
- Petar Magenhajm
- Tamara Smolcic
- Vladimir Subotic
- Luka Matic
