from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve leaderboard data from CSV
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        # Load the CSV file from the current directory
        csv_path = os.path.join(os.path.dirname(__file__), "C. K. Pithawala College of Engineering and Technology - Surat, India [16 Oct].csv")
        df = pd.read_csv(csv_path)
        
        # Replace NaN values with empty strings for JSON compatibility
        df = df.replace({np.nan: ""})
        
        # Convert DataFrame to a list of dictionaries for JSON response
        data = df.to_dict(orient='records')
        
        return jsonify(data)  # Send data as JSON
    except Exception as e:
        # Return error message if there's an issue loading the CSV
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
