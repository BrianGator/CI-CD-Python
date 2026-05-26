# Counter Data Models and Memory Storage
# Written by Brian McCarthy

import logging

logger = logging.getLogger(__name__)

# Simple in-memory storage for counter tracking
COUNTERS = {}

class Counter:
    """Counter model representing discrete trackable items by unique key."""

    def __init__(self, name: str, value: int = 0):
        self.name = name
        self.value = value

    def to_dict(self):
        """Converts counter object state to JSON-serializable dictionary."""
        return {
            "name": self.name,
            "value": self.value,
            "owner": "Brian McCarthy"
        }

    @classmethod
    def find(cls, name: str):
        """Finds a counter in-memory by name, returning its instance."""
        if name in COUNTERS:
            return COUNTERS[name]
        return None

    @classmethod
    def list_all(cls):
        """Lists all existing counters within context."""
        return [counter.to_dict() for counter in COUNTERS.values()]

    @classmethod
    def create(cls, name: str, value: int = 0):
        """Creates and stores a tracking counter."""
        if name in COUNTERS:
            raise KeyError(f"Counter '{name}' already exists.")
        counter = cls(name, value)
        COUNTERS[name] = counter
        return counter

    @classmethod
    def delete_all(cls):
        """Cleans and resets storage to empty state."""
        COUNTERS.clear()
        logger.info("Local in-memory counters database cleared.")
