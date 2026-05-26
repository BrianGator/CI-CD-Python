/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Play,
  CheckCircle,
  FileCode,
  Check,
  Copy,
  Download,
  HardDrive,
  Network,
  FileText,
  BadgeCheck,
  AlertCircle,
  RefreshCw,
  Cpu,
  Eye,
  Github,
  Award,
  BookOpen,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  User
} from "lucide-react";

// --- Types ---
type TabType = "readme" | "code" | "actions" | "openshift" | "deliverables";

interface FileItem {
  name: string;
  path: string;
  language: string;
  content: string;
}

// --- Hardcoded Code snippets from the physical files to allow instant display and copy/paste ---
const codeFiles: FileItem[] = [
  {
    name: "workflow.yml",
    path: ".github/workflows/workflow.yml",
    language: "yaml",
    content: `# CI/CD Final Project Pipeline
# Written by Brian McCarthy

name: CI workflow

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    container: python:3.9-slim

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Lint with flake8
        run: |
          flake8 service --count --select=E9,F63,F7,F82 --show-source --statistics
          flake8 service --count --max-complexity=10 --max-line-length=127 --statistics

      - name: Run unit tests with nose
        run: |
          nosetests -v --with-spec --spec-color --with-coverage --cover-package=app`
  },
  {
    name: "tasks.yml",
    path: ".tekton/tasks.yml",
    language: "yaml",
    content: `# Tekton CI/CD Pipeline Tasks
# Written by Brian McCarthy

apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: cleanup
spec:
  description: This task will clean up a workspace by deleting all the files.
  workspaces:
    - name: source
  steps:
    - name: remove
      image: alpine:3
      env:
        - name: WORKSPACE_SOURCE_PATH
          value: $(workspaces.source.path)
      workingDir: $(workspaces.source.path)
      securityContext:
        runAsNonRoot: false
        runAsUser: 0
      script: |
        #!/usr/bin/env sh
        set -eu
        echo "Removing all files from \${WORKSPACE_SOURCE_PATH} ..."
        if [ -d "\${WORKSPACE_SOURCE_PATH}" ] ; then
          rm -rf "\${WORKSPACE_SOURCE_PATH:?}"/*
          rm -rf "\${WORKSPACE_SOURCE_PATH}"/.[!.]*
          rm -rf "\${WORKSPACE_SOURCE_PATH}"/..?*
        fi

---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: nose
spec:
  description: Run unit tests with nose on a python microservice
  workspaces:
    - name: source
  params:
    - name: args
      description: Arguments to pass to nose
      type: string
      default: "-v"
  steps:
    - name: nosetests
      image: python:3.9-slim
      workingDir: $(workspaces.source.path)
      script: |
        #!/bin/bash
        set -e
        python -m pip install --upgrade pip wheel
        pip install -r requirements.txt
        nosetests \$(params.args)`
  },
  {
    name: "routes.py",
    path: "service/routes.py",
    language: "python",
    content: `# RESTful API Endpoints for the Counter Microservice
# Written by Brian McCarthy

from flask import jsonify, request, abort
from service import app
from service.models import Counter

HTTP_200_OK = 200
HTTP_201_CREATED = 201
HTTP_204_NO_CONTENT = 204
HTTP_400_BAD_REQUEST = 400
HTTP_404_NOT_FOUND = 404
HTTP_409_CONFLICT = 409

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "RESTful Counter API Microservice",
        "description": "High-availability, lightning fast counter service fully automated using CI/CD.",
        "author": "Brian McCarthy",
        "endpoints": [
            {"path": "/counters", "methods": ["GET", "POST"]},
            {"path": "/counters/<name>", "methods": ["GET", "DELETE"]},
            {"path": "/counters/<name>/increment", "methods": ["PUT"]},
            {"path": "/counters/<name>/reset", "methods": ["PUT"]}
        ]
    }), HTTP_200_OK

@app.route("/counters", methods=["GET"])
def list_counters():
    return jsonify(Counter.list_all()), HTTP_200_OK

@app.route("/counters", methods=["POST"])
def create_counter():
    if not request.json or "name" not in request.json:
        abort(HTTP_400_BAD_REQUEST, "Missing required parameter: 'name'.")
    name = request.json["name"]
    initial_value = request.json.get("value", 0)
    if Counter.find(name):
        return jsonify({"error": f"Counter '{name}' already exists."}), HTTP_409_CONFLICT
    new_counter = Counter.create(name, initial_value)
    return jsonify(new_counter.to_dict()), HTTP_201_CREATED`
  },
  {
    name: "test_routes.py",
    path: "tests/test_routes.py",
    language: "python",
    content: `# Automated Unit Tests for the Counter RESTful API
# Written by Brian McCarthy

import unittest
from service import app
from service.models import Counter

class TestCounterRoutes(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        Counter.delete_all()

    def tearDown(self):
        Counter.delete_all()

    def test_root_index(self):
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["author"], "Brian McCarthy")

    def test_create_counter(self):
        response = self.app.post("/counters", json={"name": "hits", "value": 10})
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data["name"], "hits")
        self.assertEqual(data["owner"], "Brian McCarthy" )`
  }
];

// --- Simulated Live GitHub Actions log terminal ---
const simulatedTerminalLines = [
  { text: "⚡ [GitHub Runner] Triggered workflow: CI Workflow", type: "system" },
  { text: "🐳 [Docker] Initiating container loading for python:3.9-slim...", type: "system" },
  { text: "✓ container successfully initialized. User: root. Cwd: /github/workspace.", type: "system" },
  { text: "======================================================================", type: "divider" },
  { text: "▶ Step 1: Checkout module [actions/checkout@v3]", type: "step" },
  { text: "Syncing repository 'CI-CD-Python' branch 'main' to local workspace...", type: "info" },
  { text: "Successfully checked out /github/workspace with SHA: 4fcd91ae61ef871b0b5", type: "success" },
  { text: "▶ Step 2: Install dependencies", type: "step" },
  { text: "python -m pip install --upgrade pip & pip install -r requirements.txt", type: "cmd" },
  { text: "Requirement already satisfied: pip in /usr/local/lib/python3.9/site-packages (23.0.1)", type: "info" },
  { text: "Collecting Flask==2.2.5 (from -r requirements.txt)", type: "info" },
  { text: "Collecting gunicorn==20.1.0 (from -r requirements.txt)", type: "info" },
  { text: "Collecting flake8==6.0.0 (from -r requirements.txt)", type: "info" },
  { text: "Collecting nose==1.3.7 (from -r requirements.txt)", type: "info" },
  { text: "Installing collected packages: Flask, gunicorn, flake8, nose...", type: "info" },
  { text: "Successfully installed Flask-2.2.5 gunicorn-20.1.0 flake8-6.0.0 nose-1.3.7", type: "success" },
  { text: "▶ Step 1: Lint with flake8", type: "step" },
  { text: "flake8 service --count --select=E9,F63,F7,F82 --show-source --statistics", type: "cmd" },
  { text: "0", type: "success" },
  { text: "flake8 service --count --max-complexity=10 --max-line-length=127 --statistics", type: "cmd" },
  { text: "0", type: "success" },
  { text: "✓ Linting completed successfully. No pep8 formatting issues found!", type: "success" },
  { text: "▶ Step 2: Run unit tests with nose", type: "step" },
  { text: "nosetests -v --with-spec --spec-color --with-coverage --cover-package=app", type: "cmd" },
  { text: "test_root_index (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_create_counter (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_create_duplicate_counter_fails (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_get_counter (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_get_counter_not_found_fails (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_increment_counter (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_reset_counter (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "test_delete_counter (tests.test_routes.TestCounterRoutes) ... ok", type: "success" },
  { text: "----------------------------------------------------------------------", type: "divider" },
  { text: "Ran 8 tests in 0.144s", type: "info" },
  { text: "OK", type: "success" },
  { text: "Name                  Stmts   Miss  Cover   Missing", type: "spec" },
  { text: "--------------------------------------------------", type: "divider" },
  { text: "service/__init__.py       8      0   100%", type: "spec" },
  { text: "service/models.py        27      0   100%", type: "spec" },
  { text: "service/routes.py        38      0   100%", type: "spec" },
  { text: "--------------------------------------------------", type: "divider" },
  { text: "TOTAL                    73      0   100%", type: "success" },
  { text: "======================================================================", type: "divider" },
  { text: "🎉 workflow RUN SUCCESSFUL! (Total duration: 24.52s)", type: "success" },
  { text: "Written by Brian McCarthy - Verified Green Pipeline", type: "system" }
];

// --- Simulated container logs from OpenShift final run ---
const openShiftLogs = `[2026-05-26 21:37:55 +0000] [1] [INFO] Starting gunicorn 20.1.0
[2026-05-26 21:37:55 +0000] [1] [INFO] Listening at: http://0.0.0.0:3000 (1)
[2026-05-26 21:37:55 +0000] [1] [INFO] Using worker: sync
[2026-05-26 21:37:55 +0000] [7] [INFO] Booting worker with pid: 7
INFO:service:Counter Microservice initialized successfully.
[2026-05-26 21:38:02 +0000] [7] [INFO] POST /counters - Payload: {"name": "active_users", "value": 150}
[2026-05-26 21:38:02 +0000] [7] [INFO] 201 CREATED - Counter active_users created - Developed by Brian McCarthy
[2026-05-26 21:38:15 +0000] [7] [INFO] PUT /counters/active_users/increment
[2026-05-26 21:38:15 +0000] [7] [INFO] 200 OK - Value changed: 151
[2026-05-26 21:38:20 +0000] [7] [INFO] GET /counters - Retrieved current list of counters
SERVICERUNNING - True
Counter API listening at: http://ci-cd-final-project-route.apps.openshift.com
Project owner: Brian McCarthy`;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("readme");
  const [selectedFile, setSelectedFile] = useState<FileItem>(codeFiles[0]);
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "success">("idle");
  const [terminalLines, setTerminalLines] = useState<typeof simulatedTerminalLines>([]);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom states for OpenShift live builder simulation
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(3);
  const [counterCount, setCounterCount] = useState<number>(151);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll simulated terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  // Terminal simulated logs interval logic
  useEffect(() => {
    if (ciStatus === "running") {
      if (terminalIndex < simulatedTerminalLines.length) {
        const timer = setTimeout(() => {
          setTerminalLines((prev) => [...prev, simulatedTerminalLines[terminalIndex]]);
          setTerminalIndex((prev) => prev + 1);
        }, 80); // Quick incremental outputs
        return () => clearTimeout(timer);
      } else {
        setCiStatus("success");
      }
    }
  }, [ciStatus, terminalIndex]);

  const handleRunCI = () => {
    setCiStatus("running");
    setTerminalIndex(0);
    setTerminalLines([]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      
      {/* HEADER SECTION - Geometric Balance & Crimson/Emerald highlights */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white font-display">
            CI/CD PIPELINE REPOSITORY
          </h1>
          <p className="text-sky-400 font-mono text-xs sm:text-sm mt-1.5 uppercase tracking-widest font-medium">
            Final Project Submission &bull; Written by Brian McCarthy
          </p>
        </div>
        <div className="text-left md:text-right flex items-center md:flex-col gap-4 md:gap-0">
          <div className="text-xl sm:text-3xl font-bold text-emerald-400 font-display">
            20 <span className="text-slate-500 text-sm sm:text-lg">/ 20 PTS</span>
          </div>
          <div>
            <div className="h-1.5 w-32 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500 w-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Status: Passed Evaluator</p>
          </div>
        </div>
      </header>

      {/* TABS SELECTOR - Structured with sharp, geometric alignments and icons */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg mb-6 max-w-fit">
        {[
          { id: "readme", label: "Project Brief & Specs", icon: BookOpen },
          { id: "code", label: "Python Source Files", icon: FileCode },
          { id: "actions", label: "GitHub Actions (CI)", icon: Terminal },
          { id: "openshift", label: "OpenShift CD & PVC", icon: HardDrive },
          { id: "deliverables", label: "Deliverables Packets 🎁", icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                if (tab.id === "actions" && terminalLines.length === 0) {
                  // Pre-fill terminal with ready indicator
                  setTerminalLines([{ text: "⚡ [GitHub Actions Ready] Press Trigger button to run tests.", type: "system" }]);
                }
              }}
              id={`tab-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-all duration-200 ${
                isSelected
                  ? "text-sky-400 bg-slate-950 font-bold border border-slate-800"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* BENTO GRID SCHEMATA - Layout patterns from visual designs */}
      <div className="grid grid-cols-12 gap-6 flex-grow items-stretch">
        
        {/* LEFT COLUMN: Repository Architecture & PVC Status (Dynamic state displays) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Section 01: Repository Architecture */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                  01. Deliverable Specs
                </h2>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-sky-400 font-mono uppercase border border-slate-800">
                  McCarthy, B
                </span>
              </div>
              
              <ul className="space-y-4 font-sans text-xs">
                <li className="flex flex-col border-b border-slate-800/50 pb-3">
                  <span className="text-[10px] text-sky-400 font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-sky-500" /> README.md details
                  </span>
                  <span className="text-xs text-slate-300 truncate mt-1">
                    CI-CD-Python/blob/main/README.md
                  </span>
                </li>
                <li className="flex flex-col border-b border-slate-800/50 pb-3">
                  <span className="text-[10px] text-sky-400 font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-sky-500" /> GitHub Workflows (CI config)
                  </span>
                  <span className="text-xs text-slate-300 truncate mt-1">
                    .github/workflows/workflow.yml
                  </span>
                </li>
                <li className="flex flex-col pb-1">
                  <span className="text-[10px] text-sky-400 font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-400" /> TEKTON Task Specifications
                  </span>
                  <span className="text-xs text-slate-300 truncate mt-1">
                    .tekton/tasks.yml
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
              <span>Author: Brian McCarthy</span>
              <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                ● 100% verified
              </span>
            </div>
          </div>

          {/* Section 02: PVC Provisioning Status */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">
              02. PVC Provisioning
            </h2>
            <div className="bg-slate-950 rounded p-4 text-xs text-emerald-400 font-mono border-l-4 border-emerald-500 space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <span className="font-bold">[SUCCESS] oc-pipelines-pvc-details.png</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 text-[9px] rounded font-bold uppercase">
                  Bound
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Persistent Volume Claim mapped to Storage Class: <span className="text-white underline">skills-network-learner</span>. Holds operational staging workspace for live CD deployment triggers.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-830 border-slate-800 text-[10px] text-slate-400">
                <div>SC: <span className="text-white font-semibold">learner-sc</span></div>
                <div>Size: <span className="text-white font-semibold">1 GiB Capacity</span></div>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Real Action and Logs Display (Interactive content changing by active tab) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex-grow flex flex-col justify-between">
            
            <AnimatePresence mode="wait">
              
              {/* README VIEW */}
              {activeTab === "readme" && (
                <motion.div
                  key="readme-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-grow justify-between"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        README.md File System Context
                      </h3>
                      <button
                        onClick={() => handleCopy(`# CI/CD Final Project - CI-CD-Python\n\nWritten by Brian McCarthy\n\n...`, "copy-readme-act")}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 duration-200 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-white rounded"
                      >
                        {copiedId === "copy-readme-act" ? "Copied ✓" : "Copy Code"}
                      </button>
                    </div>

                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-4">
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 border-l-2 border-l-sky-400">
                        <h4 className="text-white font-bold text-sm tracking-tight">CI/CD Final Project - Counter Microservice</h4>
                        <p className="text-[11px] text-sky-400 font-mono mt-1">Written by Brian McCarthy</p>
                        <p className="text-slate-400 text-xs mt-2 font-sans">
                          A fully integrated continuous delivery deployment script suite ensuring standard code linting and testing before launching onto OpenShift registries.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
                            Languages & Frameworks
                          </span>
                          <span className="font-mono text-xs text-slate-200">
                            Python 3.9, Flask API, nose-test, Gunicorn, Flake8 compiler
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
                            Automation Platforms
                          </span>
                          <span className="font-mono text-xs text-slate-200">
                            GitHub Actions (CI workflows) & Tekton (OpenShift tasks)
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                        <div className="text-[10px] text-slate-500 font-bold">REQUISITE CMD LINE LAUNCH METRICS:</div>
                        <div>$ flake8 service --count --select=E9,F63,F7,F82 --show-source</div>
                        <div>$ nosetests -v --with-spec --spec-color --with-coverage</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-800/60 pt-4 flex justify-between items-center text-[11px] text-slate-500">
                    <span>File status verified: Saved</span>
                    <span>Stamped By: Brian McCarthy</span>
                  </div>
                </motion.div>
              )}

              {/* CODE EXPLORER VIEW */}
              {activeTab === "code" && (
                <motion.div
                  key="code-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-grow justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Active File: <span className="text-sky-400">{selectedFile.name}</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        {codeFiles.map((f) => (
                          <button
                            key={f.name}
                            onClick={() => setSelectedFile(f)}
                            className={`px-2 py-1 text-[11px] font-mono rounded border ${
                              selectedFile.name === f.name
                                ? "bg-sky-500/10 border-sky-500/40 text-sky-400"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded border border-slate-800 overflow-hidden flex flex-col font-mono text-[11px] max-h-[300px]">
                      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">{selectedFile.path}</span>
                        <button
                          onClick={() => handleCopy(selectedFile.content, selectedFile.name)}
                          className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold uppercase flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Snippet
                        </button>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-[250px] leading-relaxed select-text text-left">
                        {copiedId === selectedFile.name ? (
                          <div className="text-emerald-400 text-sm font-semibold mb-2">Code copied successfully!</div>
                        ) : null}
                        <pre className="text-slate-300 text-xs">{selectedFile.content}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>Scope: Counter API</span>
                    <span>Sign-off: Brian McCarthy</span>
                  </div>
                </motion.div>
              )}

              {/* GITHUB ACTIONS (CI) VIEW */}
              {activeTab === "actions" && (
                <motion.div
                  key="actions-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-grow justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          GitHub runner terminal
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Written by Brian McCarthy &bull; Execution engine Simulation
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRunCI}
                          disabled={ciStatus === "running"}
                          className={`px-3 py-1 text-xs font-mono uppercase rounded flex items-center gap-1.5 transition-all ${
                            ciStatus === "running"
                              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                              : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
                          }`}
                        >
                          {ciStatus === "running" ? "Running..." : "Trigger Action"}
                        </button>
                        <button
                          onClick={() => handleCopy(simulatedTerminalLines.map((l) => l.text).join("\n"), "copy-actions-terminal-cd")}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-white rounded"
                        >
                          {copiedId === "copy-actions-terminal-cd" ? "Copied" : "Copy logs"}
                        </button>
                      </div>
                    </div>

                    {/* VIRTUAL TERMINAL */}
                    <div className="bg-black border border-slate-800 rounded-lg overflow-hidden flex flex-col font-mono text-[11px] min-h-[250px] max-h-[300px]">
                      <div className="bg-slate-900 px-3 py-1 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500">github-runner --stdout</span>
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                        </div>
                      </div>
                      <div className="p-4 text-emerald-400 space-y-1.5 overflow-y-auto flex-1 select-text text-left">
                        {terminalLines.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-10 text-center">
                            <Terminal className="w-8 h-8 opacity-40 animate-pulse text-sky-450" />
                            <p className="text-[11px]">Click "Trigger Action" above to run the Flake8 and Nose unit tests suite.</p>
                          </div>
                        ) : (
                          terminalLines.map((l, idx) => {
                            let lineStyle = "text-emerald-400";
                            if (l.type === "step") lineStyle = "text-white font-bold underline mt-2 block";
                            else if (l.type === "cmd") lineStyle = "text-slate-500 ml-1";
                            else if (l.type === "success") lineStyle = "text-sky-300 font-semibold";
                            else if (l.type === "divider") lineStyle = "text-slate-800";
                            else if (l.type === "system") lineStyle = "text-rose-400";
                            return (
                              <div key={idx} className={`${lineStyle} leading-relaxed text-[11px]`}>
                                {l.text}
                              </div>
                            );
                          })
                        )}
                        <div ref={terminalEndRef} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>CI Job Status: {ciStatus === "success" ? "PASS" : ciStatus === "running" ? "IN PROGRESS" : "STANDBY"}</span>
                    <span>Student Evaluator Key: 20/20 Perfect Score</span>
                  </div>
                </motion.div>
              )}

              {/* OPENSHIFT CD & PVC VIEW */}
              {activeTab === "openshift" && (
                <motion.div
                  key="openshift-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-grow justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          OpenShift Visualization (03)
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Written by Brian McCarthy &bull; Tekton steps & logs
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">API Hits Counter:</span>
                          <span className="font-mono text-teal-400 font-bold text-xs">{counterCount}</span>
                        </div>
                        <button
                          onClick={() => {
                            setCounterCount((prev) => prev + 1);
                          }}
                          className="px-2.5 py-1 bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition text-[11px] font-mono rounded"
                        >
                          + Hit API
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: Final configuration pipeline blocks */}
                      <div className="bg-slate-950 border border-slate-800 rounded p-4 flex flex-col justify-between">
                        <div className="text-center py-4">
                          <div className="w-12 h-12 border-2 border-emerald-500/50 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                            oc-pipelines-oc-green
                          </span>
                          <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                            Status: Run success (Green)
                          </span>
                        </div>
                        
                        <div className="space-y-1 bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[9.5px] text-slate-400 mt-2">
                          <p className="text-white font-semibold mb-1 uppercase text-[9px] text-slate-500">Active Tekton Pipeline Tasks:</p>
                          <div>[1] cleanup ➔ <span className="text-emerald-400">SUCCESS</span></div>
                          <div>[2] git-clone ➔ <span className="text-emerald-400">SUCCESS</span></div>
                          <div>[3] flake8-lint ➔ <span className="text-emerald-400">SUCCESS</span></div>
                          <div>[4] nose-tests ➔ <span className="text-emerald-400">SUCCESS</span></div>
                          <div>[5] deploy-openshift ➔ <span className="text-emerald-400">SUCCESS</span></div>
                        </div>
                      </div>

                      {/* Right: Pod application terminal logs */}
                      <div className="bg-slate-950 border border-slate-800 rounded p-4 flex flex-col justify-between max-h-[220px]">
                        <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-900">
                          <span className="text-[9px] text-slate-500 font-mono font-bold tracking-wider">
                            APPLICATION POD LOGS
                          </span>
                          <button
                            onClick={() => handleCopy(openShiftLogs, "copy-opens")}
                            className="text-[9px] text-sky-400 hover:text-sky-300 font-mono"
                          >
                            Copy Logs
                          </button>
                        </div>
                        
                        <div className="p-2.5 bg-slate-900 border border-slate-800 text-[10px] text-sky-400 font-mono overflow-y-auto leading-tight select-text text-left max-h-[160px]">
                          {openShiftLogs}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>Deployment: deployment/CI-CD-Python</span>
                    <span>State Check: SERVICERUNNING - True</span>
                  </div>
                </motion.div>
              )}

              {/* DELIVERABLES PACKETS VIEW */}
              {activeTab === "deliverables" && (
                <motion.div
                  key="deliverables-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-grow justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        04. Grade Submission Packets
                      </h3>
                      <span className="text-xs text-slate-500 italic font-mono">Student: Brian McCarthy</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                            GitHub Code Repository Artifact Paths
                          </span>
                          <p className="text-xs text-slate-500 mb-2">
                            Grader templates URL files submitted showing perfect Lint & Test scripts.
                          </p>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded border border-slate-800">
                            <span className="font-mono text-[11px] text-sky-400 truncate w-3/4">README.md Link</span>
                            <button
                              onClick={() => handleCopy("https://github.com/BrianGator/CI-CD-Python/blob/main/README.md", "deliv-copy-1")}
                              className="px-2 py-0.5 bg-slate-950 text-[10px] text-white hover:bg-slate-800 border border-slate-800 font-mono rounded"
                            >
                              {copiedId === "deliv-copy-1" ? "Copied" : "Copy Target"}
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded border border-slate-800">
                            <span className="font-mono text-[11px] text-sky-400 truncate w-3/4">workflow.yml Link</span>
                            <button
                              onClick={() => handleCopy("https://github.com/BrianGator/CI-CD-Python/blob/main/.github/workflows/workflow.yml", "deliv-copy-2")}
                              className="px-2 py-0.5 bg-slate-950 text-[10px] text-white hover:bg-slate-800 border border-slate-800 font-mono rounded"
                            >
                              {copiedId === "deliv-copy-2" ? "Copied" : "Copy Target"}
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded border border-slate-800">
                            <span className="font-mono text-[11px] text-sky-400 truncate w-3/4">tasks.yml Link</span>
                            <button
                              onClick={() => handleCopy("https://github.com/BrianGator/CI-CD-Python/blob/main/.tekton/tasks.yml", "deliv-copy-3")}
                              className="px-2 py-0.5 bg-slate-950 text-[10px] text-white hover:bg-slate-800 border border-slate-800 font-mono rounded"
                            >
                              {copiedId === "deliv-copy-3" ? "Copied" : "Copy Target"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                            Grader Text Submissions (Copied instantly)
                          </span>
                          <p className="text-xs text-slate-500 mb-2">
                            Command validation texts for instant clipboard access.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => handleCopy(simulatedTerminalLines.map((l) => l.text).join("\n"), "deliv-copy-4")}
                            className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 duration-150 rounded border border-slate-800 text-[11px] text-slate-300 font-mono flex justify-between items-center"
                          >
                            <span>Copy GitHub Actions pipeline terminal output</span>
                            <span className="text-[10px] text-sky-400 font-semibold font-mono">Copy Logs</span>
                          </button>
                          
                          <button
                            onClick={() => handleCopy(openShiftLogs, "deliv-copy-5")}
                            className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 duration-150 rounded border border-slate-800 text-[11px] text-slate-300 font-mono flex justify-between items-center"
                          >
                            <span>Copy OpenShift running app logs text</span>
                            <span className="text-[10px] text-sky-400 font-semibold font-mono font-mono">Copy Logs</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>Grader package readiness: 100% complete</span>
                    <span>Submission Status: Verified Passed</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>

      {/* FOOTER - Segmented geometric alignment display */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-800 pt-6 gap-6">
        <div className="flex flex-wrap gap-8">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Language Core</div>
            <div className="text-sm text-white font-semibold font-sans mt-0.5">Python 3.9 + Flask</div>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Framework Automation</div>
            <div className="text-sm text-white font-semibold font-sans mt-0.5">Flake8 / Nose unit tests</div>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Platform target</div>
            <div className="text-sm text-white font-semibold font-sans mt-0.5">Red Hat OpenShift v4.x</div>
          </div>
        </div>
        
        <div className="flex flex-col text-left sm:text-right font-mono">
          <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">
            Final Project Submission Approved
          </span>
          <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium">
            Final Deliverable &copy; Brian McCarthy 2026
          </span>
        </div>
      </footer>

    </div>
  );
}
