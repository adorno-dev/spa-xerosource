from apps.api import app, init_api

if __name__ == "__main__":
    app.run(debug=True, port=7000, host="0.0.0.0")