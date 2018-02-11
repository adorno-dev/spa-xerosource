from flask import Flask, Markup

from flask import render_template, request, redirect

from apps.web.decorators import security

app = Flask(__name__, static_path='/static', template_folder='views/')

@app.route("/")
@app.route("/index")
@security.token_required
def index():
    return render_template("index.html", app="tasks")

@app.route("/login")
def login():
    if "Token" in request.cookies:
        return redirect("/")
    else:
        return render_template("index.html", app="login")

@app.route("/register")
def register():
    if "Token" in request.cookies:
        return redirect("/")
    else:
        return render_template("index.html", app="register")

@app.route("/apps")
@security.token_required
def apps():
    return render_template("index.html", app="apps")

@app.route("/tasks")
@security.token_required
def tasks():
    return render_template("index.html", app="tasks")

@app.route("/users")
@security.token_required
def users():
    return render_template("index.html", app="users")

@app.route("/roles")
@security.token_required
def roles():
    return render_template("index.html", app="roles")

@app.route("/permissions")
@security.token_required
def permissions():
    return render_template("index.html", app="permissions")

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

if __name__ == "__main__":
    app.run(debug=True)