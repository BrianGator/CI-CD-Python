# Python Test Package Initialization Module
# Written by Brian McCarthy

import os
import sys

# Append parent root to sys.path for test runners to successfully find the service module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
