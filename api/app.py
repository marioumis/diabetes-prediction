from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np

app = Flask(__name__)
CORS(app)  # autorise les requêtes venant du front

# ====== Charger le modèle entraîné ======
# BASE_DIR = dossier du projet
BASE_DIR = os.path.dirname(os.path.dirname(__file__))   # .. depuis api/
MODEL_PATH = os.path.join(BASE_DIR, "src", "diabetes_best_model.joblib")

model = joblib.load(MODEL_PATH)

# ordre des features = même ordre que df.drop("Outcome")
FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

@app.route("/", methods=["GET"])
def home():
    return "API Diabetes OK ✅"

@app.route("/predict_diabetes", methods=["POST"])
def predict_diabetes():
    data = request.get_json()

    if data is None:
        return jsonify({"error": "No JSON received"}), 400

    try:
        # récupérer les features dans le bon ordre
        x = [float(data[feat]) for feat in FEATURES]
    except KeyError as e:
        return jsonify({"error": f"Missing feature: {e}"}), 400

    X = np.array([x])

    proba = model.predict_proba(X)[0, 1]
    pred = int(model.predict(X)[0])

    return jsonify({
        "diabetes_pred": pred,
        "diabetes_proba": float(proba)
    })


if __name__ == "__main__":
    app.run(debug=True)
