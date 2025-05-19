#!/bin/bash

# This script attempts to start a simple HTTP server to serve the todo list application.
# The application itself is client-side (HTML, CSS, JavaScript) and can also be opened
# by directly loading the index.html file in a web browser.

echo "Starting the Simple Todo List application..."

# Define the port for the server
PORT=8000

# Function to check if a port is in use
check_port() {
  if nc -z localhost "$1" 2>/dev/null; then
    return 0 # Port is in use
  else
    return 1 # Port is not in use
  fi
}

# Find an available port if the default is taken
while check_port $PORT; do
  echo "Port $PORT is in use. Trying next port..."
  PORT=$((PORT + 1))
done

echo "Selected port: $PORT"

# Attempt to start Python 3's HTTP server
if command -v python3 &>/dev/null; then
    echo "Python 3 found."
    echo "Serving application on http://localhost:$PORT"
    echo "Press Ctrl+C to stop the server."
    # The '-d .' or specifying a directory might be needed if not running from the root.
    # Assuming this script is in the root directory alongside index.html.
    python3 -m http.server $PORT

# Fallback to Python 2's SimpleHTTPServer
elif command -v python &>/dev/null; then
    echo "Python 3 not found. Python 2 found."
    echo "Serving application on http://localhost:$PORT"
    echo "Press Ctrl+C to stop the server."
    python -m SimpleHTTPServer $PORT

# If no Python server is available, instruct the user
else
    echo "Python not found on your system."
    echo "To run the application, please open the 'index.html' file directly in your web browser."
    echo "Alternatively, you can use any other HTTP server to serve these files."
    # Try to open index.html directly if possible (OS-dependent)
    if command -v xdg-open &>/dev/null; then
        xdg-open index.html
    elif command -v open &>/dev/null; then
        open index.html
    elif command -v start &>/dev/null; then # For Windows
        start index.html
    fi
    exit 1
fi

exit 0
