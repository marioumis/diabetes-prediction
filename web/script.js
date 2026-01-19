const form = document.getElementById("diabetes-form");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");

// URL de ton backend Flask
const API_URL = "http://127.0.0.1:5000/predict_diabetes";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultDiv.textContent = "";
    errorDiv.textContent = "";

    // construire le JSON dans le même ordre que FEATURES dans app.py
    const payload = {
        Pregnancies: parseFloat(document.getElementById("Pregnancies").value),
        Glucose: parseFloat(document.getElementById("Glucose").value),
        BloodPressure: parseFloat(document.getElementById("BloodPressure").value),
        SkinThickness: parseFloat(document.getElementById("SkinThickness").value),
        Insulin: parseFloat(document.getElementById("Insulin").value),
        BMI: parseFloat(document.getElementById("BMI").value),
        DiabetesPedigreeFunction: parseFloat(document.getElementById("DiabetesPedigreeFunction").value),
        Age: parseFloat(document.getElementById("Age").value),
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Erreur lors de l'appel à l'API");
        }

        const data = await response.json();

        const pred = data.diabetes_pred;
        const proba = data.diabetes_proba;

        const probaPct = (proba * 100).toFixed(1);

        if (pred === 1) {
            resultDiv.innerHTML =
                `<strong>Résultat :</strong> risque <b>élevé</b> de diabète (${probaPct} %).`;
            resultDiv.style.color = "#b91c1c";
        } else {
            resultDiv.innerHTML =
                `<strong>Résultat :</strong> risque <b>faible</b> de diabète (${probaPct} %).`;
            resultDiv.style.color = "#15803d";
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = err.message;
    }
});
