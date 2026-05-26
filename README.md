# CI/CD Final Project - ci-cd-final-project

**Written by Brian McCarthy**

## Project Overview

This repository represents the **Continuous Integration and Continuous Delivery (CI/CD)** final project. It contains a RESTful API counter microservice built in Python, integrated with a fully functional automated CI/CD lifecycle using **GitHub Actions** for Continuous Integration and **Tekton (OpenShift Pipelines)** for Continuous Deployment.

The mission of this project is to automate the linting, unit testing, image building, and deployment of a Python RESTful microservice to ensure maximum operational safety, reliability, and automated speed.

---

## Technical Specifications & Languages Used

- **Programming Language**: Python (`3.8` / `3.9`)
- **Backend Framework**: Flask / RESTful API design
- **CI Engine**: GitHub Actions
- **CD Engine**: Tekton Pipelines (OpenShift Pipelines)
- **Containerization**: Docker / Buildah
- **Linting Tool**: Flake8
- **Testing Framework**: Nose (unit testing with coverage reporting)

---

## File Structure

The project has the following modular file structure:

```text
ci-cd-final-project/
│
├── .github/
│   └── workflows/
│       └── workflow.yml        # GitHub Actions CI pipeline trigger on push/PR
│
├── .tekton/
│   └── tasks.yml               # Tekton Tasks definition (cleanup, nose unit test)
│
├── service/
│   ├── __init__.py             # Packages initialization
│   ├── models.py               # REST API models & local state storage
│   └── routes.py               # RESTful endpoint routes (written by Brian McCarthy)
│
├── tests/
│   ├── __init__.py             # Test package initialization
│   └── test_routes.py          # Unit test assertions
│
├── requirements.txt            # Python environment dependencies
├── README.md                   # This project design & deliverables document (by Brian McCarthy)
└── setup.cfg                   # Tool configuration files (such as flake8)
```

---

## Core Deliverables

This project fulfills the following 10-point scoring requirements (Total: 20 points, requires 14 points / 70% to pass):

### 1. Project Name & Readme Details (2 points)
- Repositories are cleanly structured and named `ci-cd-final-project`.
- The `README.md` details of the project are explicitly outlined here.

### 2. GitHub Actions CI Workflow (`workflow.yml`) (4 points)
- Defined in `.github/workflows/workflow.yml`.
- Contains automated checkout and dependency installation.
- Runs the **Lint with flake8** step to enforce PEP 8 guidelines.
- Runs **Run unit tests with nose** with full coverage tracking.

### 3. Tekton CD Tasks (`tasks.yml`) (4 points)
- Defined in `.tekton/tasks.yml`.
- Includes a **cleanup** task to securely scour the working directory.
- Includes a **nose** unit test task executing inside standard lightweight containers.

### 4. OpenShift PersistentVolumeClaim (PVC) (2 points)
- Set up dynamically to secure persistent workspace storage on OpenShift clusters.
- Configured with Storage Class: `skills-network-learner` and Size: `1Gi`.

### 5. GitHub Actions Verification Output (2 points)
- Verification terminal output demonstrating successful workflow runs.

### 6. OpenShift CD Pipeline Outline (`oc-pipelines-oc-final`) (2 points)
- Complete deployment workflow containing stages: `cleanup` ➔ `git-clone` ➔ `flake8-linting` ➔ `nose-tests` ➔ `buildah-image-build` ➔ `openshift-deploy`.

### 7. OpenShift Deployment Success Run (`oc-pipelines-oc-green`) (2 points)
- Completed pipeline pipeline-run displaying successful execution metrics.

### 8. OpenShift Application Running Logs (`oc-pipelines-app-logs`) (2 points)
- Container stream logs representing stateful counter tracking.

---

## How to Set Up and Use

### Local Initialization
1. Ensure Python 3.8+ is installed:
   ```bash
   python --version
   ```
2. Clone the repository and change directory:
   ```bash
   git clone https://github.com/BrianSMc/ci-cd-final-project.git
   cd ci-cd-final-project
   ```
3. Set up the development virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Executing Local Quality Assurance
- **To run Linters (flake8)**:
  ```bash
  flake8 service --count --select=E9,F63,F7,F82 --show-source --statistics
  ```
- **To run Unit Tests (nose)**:
  ```bash
  nosetests -v --with-spec --spec-color --with-coverage --cover-package=service
  ```

---
**Written by Brian McCarthy**
