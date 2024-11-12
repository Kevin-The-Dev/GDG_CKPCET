from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np

app = Flask(__name__)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve leaderboard data from CSV
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        # Load the new CSV file
        df = pd.read_csv("CSV Files/C. K. Pithawala College of Engineering and Technology - Surat, India [12 Nov].csv")
        
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
