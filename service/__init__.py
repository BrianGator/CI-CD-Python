# Flask Service Initialization Module
# Written by Brian McCarthy

import logging
from flask import Flask

# Initialize the Flask App Instance
app = Flask(__name__)

# Configure microservice logging
logging.basicConfig(level=logging.INFO)
app.logger.info("Counter Microservice initialized successfully.")

# Import routes after application is registered to avoid circular dependencies
from service import routes
