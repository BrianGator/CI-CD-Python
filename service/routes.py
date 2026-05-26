# RESTful API Endpoints for the Counter Microservice
# Written by Brian McCarthy

from flask import jsonify, request, abort
from service import app
from service.models import Counter

# HTTP Status Codes Constants
HTTP_200_OK = 200
HTTP_201_CREATED = 201
HTTP_204_NO_CONTENT = 204
HTTP_400_BAD_REQUEST = 400
HTTP_404_NOT_FOUND = 404
HTTP_409_CONFLICT = 409

@app.route("/", methods=["GET"])
def index():
    """Welcome Root endpoint - details API metrics."""
    return jsonify({
        "service": "RESTful Counter API Microservice",
        "description": "High-availability, lightning fast counter service fully automated using CI/CD.",
        "author": "Brian McCarthy",
        "endpoints": [
            {"path": "/counters", "methods": ["GET", "POST"], "desc": "Retrieve or create active counters"},
            {"path": "/counters/<name>", "methods": ["GET", "DELETE"], "desc": "Inspect or remove specific counter"},
            {"path": "/counters/<name>/increment", "methods": ["PUT"], "desc": "Increment counter value by 1"},
            {"path": "/counters/<name>/reset", "methods": ["PUT"], "desc": "Reset a counter value to 0"}
        ]
    }), HTTP_200_OK

@app.route("/counters", methods=["GET"])
def list_counters():
    """Lists all the active counters currently stored in storage."""
    counters = Counter.list_all()
    return jsonify(counters), HTTP_200_OK

@app.route("/counters", methods=["POST"])
def create_counter():
    """Creates a tracking counter by name parsed from payload requests."""
    if not request.json or "name" not in request.json:
        abort(HTTP_400_BAD_REQUEST, "Missing required parameter: 'name'.")
    
    name = request.json["name"]
    initial_value = request.json.get("value", 0)
    
    # Check if name already in keys
    if Counter.find(name):
        return jsonify({"error": f"Counter '{name}' already exists."}), HTTP_409_CONFLICT
        
    try:
        new_counter = Counter.create(name, initial_value)
        return jsonify(new_counter.to_dict()), HTTP_201_CREATED
    except Exception as e:
        return jsonify({"error": str(e)}), HTTP_400_BAD_REQUEST

@app.route("/counters/<name>", methods=["GET"])
def get_counter(name):
    """Retrieve detailed reports of a Counter by name."""
    counter = Counter.find(name)
    if not counter:
        return jsonify({"error": f"Counter '{name}' not found."}), HTTP_404_NOT_FOUND
    return jsonify(counter.to_dict()), HTTP_200_OK

@app.route("/counters/<name>/increment", methods=["PUT"])
def increment_counter(name):
    """Increments a counter value by 1 and saves state changes."""
    counter = Counter.find(name)
    if not counter:
        return jsonify({"error": f"Counter '{name}' not found."}), HTTP_404_NOT_FOUND
    
    counter.value += 1
    return jsonify(counter.to_dict()), HTTP_200_OK

@app.route("/counters/<name>/reset", methods=["PUT"])
def reset_counter(name):
    """Resets a counter value to 0."""
    counter = Counter.find(name)
    if not counter:
        return jsonify({"error": f"Counter '{name}' not found."}), HTTP_404_NOT_FOUND
    
    counter.value = 0
    return jsonify(counter.to_dict()), HTTP_200_OK

@app.route("/counters/<name>", methods=["DELETE"])
def delete_counter(name):
    """Removes a counter from active store."""
    counter = Counter.find(name)
    if not counter:
        return jsonify({"error": f"Counter '{name}' not found."}), HTTP_404_NOT_FOUND
    
    import service.models
    del service.models.COUNTERS[name]
    return "", HTTP_204_NO_CONTENT
