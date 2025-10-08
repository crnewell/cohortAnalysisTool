# Cohort Analysis Tool

A full-stack application for building and comparing OMOP CDM cohorts (e.g., diabetes vs. non-diabetes) and visualizing demographics and measurement distributions.

---

## 🚀 Features
- Build two cohorts (disease vs. non-disease) using OMOP CDM data
- Compare demographics by age and gender
- Visualize measurement distributions (e.g., glucose, hemoglobin)
- Export plots as PNG or PDF
- Mock login page
- DuckDB as embedded analytical database

---

## 🧰 Tech Stack
- **Backend:** Java 17, Spring Boot, DuckDB, Maven
- **Frontend:** React, Plotly, Recharts, Nginx
- **Containerization:** Docker

---

## 📂 OMOP Tables Used
| Table | Purpose |
|--------|----------|
| `PERSON` | Demographics (age, gender) |
| `CONDITION_OCCURRENCE` | Defines disease vs. non-disease cohorts |
| `MEASUREMENT` | Outcome values (glucose, hemoglobin, blood pressure) |
| `CONCEPT` | Maps concept IDs to readable names |

---

## 📊 Dataset Notes
Data from the **CMS Synthetic PUF OMOP** dataset.  
A small subset of CSVs (`CDM_PERSON.csv`, `CDM_CONDITION_OCCURRENCE.csv`, `CDM_MEASUREMENT.csv`) is included under `/backend/data`.
Synthetic numbers were created for measurements since the value_as_number column of the MEASUREMENT table contained no values


---

## ⚙️ Environment Variables
| Variable | Description | Default |
|-----------|--------------|----------|
| `SERVER_PORT` | Spring Boot port | `8080` |
| `DATA_PATH` | Path to DuckDB/CSV data | `/app/data` |

---

## 🧪 Usage Guide
1. Register for an account
2. Sign in using your new credentials
3. **Select a disease** from dropdown (e.g., Diabetes / Non-Diabetes)
4. **Build cohorts** automatically from OMOP tables
5. **Pick an outcome variable** (e.g., Glucose)
6. View:
   - Counts of disease/non-disease groups
   - Age & gender bar charts
   - Measurement box plots
   - Summary statistics (n, median, p25/p75)
7. Export charts as PNG or PDF

---

## 🐳 Running with Docker

1. **Clone the repository**
   git clone <your-repo-url>
   cd <your-repo-name>

2. **Run the application**
   docker compose up --build

3. **Access the application**
   Open your browser and navigate to: http://localhost:8000