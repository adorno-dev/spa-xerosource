from werkzeug.debug import DebuggedApplication

import sys

app_path = "/home/adorno/.workspace/theproject"

# app path
sys.path.insert(0, app_path)

# virtual environment
activate_this = app_path + "/venv/bin/activate_this.py"

# for python 2
# execfile(activate_this, dict(__file__=activate_this))

# for python 3
with open(activate_this) as file:
    exec(file.read(), dict(__file__=activate_this))

from apps.web import web

web.app.config["LOG_FILE"] = app_path + "/web.log" 

application = DebuggedApplication(web.app, True)