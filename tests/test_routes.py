# Automated Unit Tests for the Counter RESTful API
# Written by Brian McCarthy

import unittest
import json
from service import app
from service.models import Counter

class TestCounterRoutes(unittest.TestCase):
    """Test Case Suite for verifying Counter Microservice Route Endpoints."""

    def setUp(self):
        """Pre-test configuration - cleans storage and activates mock app client."""
        self.app = app.test_client()
        Counter.delete_all()

    def tearDown(self):
        """Post-test configurations."""
        Counter.delete_all()

    def test_root_index(self):
        """Test finding the root index message and author properties."""
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["author"], "Brian McCarthy")
        self.assertIn("service", data)

    def test_create_counter(self):
        """Test creating a counter via POST /counters."""
        response = self.app.post("/counters", json={"name": "hits", "value": 10})
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data["name"], "hits")
        self.assertEqual(data["value"], 10)
        self.assertEqual(data["owner"], "Brian McCarthy")

    def test_create_duplicate_counter_fails(self):
        """Validate that creating a counter which already exists throws a 409 Conflict."""
        self.app.post("/counters", json={"name": "hits"})
        response = self.app.post("/counters", json={"name": "hits"})
        self.assertEqual(response.status_code, 409)

    def test_get_counter(self):
        """Test retrieving a specific counter by GET /counters/<name>."""
        self.app.post("/counters", json={"name": "click_counter", "value": 2})
        response = self.app.get("/counters/click_counter")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["name"], "click_counter")
        self.assertEqual(data["value"], 2)

    def test_get_counter_not_found_fails(self):
        """Validate and assert 404 NOT FOUND for missing counters request."""
        response = self.app.get("/counters/missing")
        self.assertEqual(response.status_code, 404)

    def test_increment_counter(self):
        """Test incrementing a counter from active store PUT /counters/<name>/increment."""
        self.app.post("/counters", json={"name": "hits", "value": 5})
        response = self.app.put("/counters/hits/increment")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["value"], 6)

    def test_reset_counter(self):
        """Test resetting a counter value to 0 via PUT /counters/<name>/reset."""
        self.app.post("/counters", json={"name": "hits", "value": 50})
        response = self.app.put("/counters/hits/reset")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["value"], 0)

    def test_delete_counter(self):
        """Test deleting a counter from store (DELETE /counters/<name>)."""
        self.app.post("/counters", json={"name": "temp"})
        response = self.app.delete("/counters/temp")
        self.assertEqual(response.status_code, 204)
        
        # Verify it was completely deleted
        response_check = self.app.get("/counters/temp")
        self.assertEqual(response_check.status_code, 404)

if __name__ == "__main__":
    unittest.main()
