import React, { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";

const diseaseOptions = [
  { label: "Diabetes / Non-Diabetes", id: 201826 },
  { label: "Cancer / Non-Cancer", id: 443392 },
  { label: "Hypertension / Non-Hypertension", id: 316866 },
  { label: "Chronic Kidney Disease / Non-CKD", id: 46271022 },
];

const outcomeOptions = [
  { label: "Glucose", id: 3004501 },
  { label: "Hemoglobin", id: 3000963 },
  { label: "Diastolic Blood Pressure", id: 301288 },
  { label: "Systolic Blood Pressure", id: 3004249 },
];

export default function CohortPage() {
  const [disease, setDisease] = useState(diseaseOptions[0].id);
  const [outcome, setOutcome] = useState(outcomeOptions[0].id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/cohort/compare", {
        params: {
          diseaseConceptId: disease,
          measurementConceptId: outcome,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Combine and filter by gender
  const combineByGender = (diseaseData, nonDiseaseData, genderConceptId) => {
    const combined = {};
    const filter = (arr) =>
      arr.filter((r) => r.gender_concept_id === genderConceptId);

    const diseaseFiltered = filter(diseaseData);
    const nonDiseaseFiltered = filter(nonDiseaseData);

    diseaseFiltered.forEach((row) => {
      const key = row.age_group;
      combined[key] = {
        age_group: row.age_group,
        disease_count: row.count,
        non_disease_count: 0,
      };
    });

    nonDiseaseFiltered.forEach((row) => {
      const key = row.age_group;
      if (!combined[key]) {
        combined[key] = {
          age_group: row.age_group,
          disease_count: 0,
          non_disease_count: row.count,
        };
      } else {
        combined[key].non_disease_count = row.count;
      }
    });

    // Sort age groups numerically
    return Object.values(combined).sort((a, b) => {
      const getStart = (s) =>
        s.includes("-") ? parseInt(s.split("-")[0]) : 0;
      return getStart(a.age_group) - getStart(b.age_group);
    });
  };

  const exportAsPNG = () => {
    const plot = document.querySelector(".js-plotly-plot");
    if (plot) {
      window.Plotly.downloadImage(plot, {
        format: "png",
        filename: "cohort_boxplot",
      });
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Cohort Analysis Summary", 10, 10);
    doc.text(`Disease: ${disease}`, 10, 20);
    doc.text(`Outcome: ${outcome}`, 10, 30);
    doc.save("cohort_summary.pdf");
  };

  const round1 = (val) =>
    val !== undefined && val !== null && !isNaN(val)
      ? Math.round(val * 10) / 10
      : "-";

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Cohort Comparison Tool</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Select Disease:</label>
        <select value={disease} onChange={(e) => setDisease(e.target.value)}>
          {diseaseOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: "20px", marginRight: "10px" }}>
          Select Outcome:
        </label>
        <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
          {outcomeOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleCompare}
          disabled={loading}
          style={{ marginLeft: "20px", padding: "5px 15px" }}
        >
          {loading ? "Loading..." : "Compare"}
        </button>
      </div>

      {data && (
        <>
          {/* Summary counts */}
          <h3>Summary Counts</h3>
          <p>
            <strong>Disease group:</strong> {data.disease_count} |{" "}
            <strong>Non-disease group:</strong> {data.non_disease_count}
          </p>

          {/* Age & Gender Distribution */}
          <h3>Age & Sex Distribution</h3>

          <h4>Male</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combineByGender(
                data.disease_age_gender,
                data.non_disease_age_gender,
                8507
              )}
            >
              <XAxis dataKey="age_group" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="disease_count" fill="#8884d8" name="Disease" />
              <Bar dataKey="non_disease_count" fill="#82ca9d" name="Non-Disease" />
            </BarChart>
          </ResponsiveContainer>

          <h4 style={{ marginTop: "30px" }}>Female</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combineByGender(
                data.disease_age_gender,
                data.non_disease_age_gender,
                8532
              )}
            >
              <XAxis dataKey="age_group" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="disease_count" fill="#8884d8" name="Disease" />
              <Bar dataKey="non_disease_count" fill="#82ca9d" name="Non-Disease" />
            </BarChart>
          </ResponsiveContainer>

          {/* Box Plot (approximation from stats) */}
          <h3 style={{ marginTop: "40px" }}>Measurement Comparison</h3>
          <Plot
            data={[
              {
                y: [
                  data.disease_stats?.p25,
                  data.disease_stats?.median,
                  data.disease_stats?.p75,
                ],
                type: "box",
                name: "Disease",
                marker: { color: "#8884d8" },
              },
              {
                y: [
                  data.non_disease_stats?.p25,
                  data.non_disease_stats?.median,
                  data.non_disease_stats?.p75,
                ],
                type: "box",
                name: "Non-Disease",
                marker: { color: "#82ca9d" },
              },
            ]}
            layout={{
              title: "Outcome Distribution by Cohort (approx)",
              yaxis: { title: "Measurement Value" },
              autosize: true,
            }}
            useResizeHandler
            style={{ width: "100%", height: "400px" }}
            config={{
              responsive: true,
              displaylogo: false,
              modeBarButtonsToAdd: ["zoom2d", "pan2d", "resetScale2d"],
            }}
          />

          <button onClick={exportAsPNG} style={{ marginRight: "10px" }}>
            Export Chart as PNG
          </button>
          <button onClick={exportAsPDF}>Export Summary as PDF</button>

          {/* Summary Stats */}
          <h3 style={{ marginTop: "30px" }}>Summary Statistics</h3>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", minWidth: "400px" }}
          >
            <thead>
              <tr>
                <th>Group</th>
                <th>n</th>
                <th>Median</th>
                <th>P25</th>
                <th>P75</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Disease</td>
                <td>{data.disease_stats?.n}</td>
                <td>{round1(data.disease_stats?.median)}</td>
                <td>{round1(data.disease_stats?.p25)}</td>
                <td>{round1(data.disease_stats?.p75)}</td>
              </tr>
              <tr>
                <td>Non-Disease</td>
                <td>{data.non_disease_stats?.n}</td>
                <td>{round1(data.non_disease_stats?.median)}</td>
                <td>{round1(data.non_disease_stats?.p25)}</td>
                <td>{round1(data.non_disease_stats?.p75)}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
