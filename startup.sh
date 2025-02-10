
# Navigate to the backend directory and set up virtual environment
cd backend || exit
echo "Setting up virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Start the FastAPI server on localhost
echo "Starting FastAPI backend on localhost..."
uvicorn main:app --host 127.0.0.1 --port 8000 --reload &

# Navigate to the frontend directory and start React app
cd ../frontend || exit
echo "Starting React frontend on localhost..."
npm install
npm start &

# Keep the script running
wait
