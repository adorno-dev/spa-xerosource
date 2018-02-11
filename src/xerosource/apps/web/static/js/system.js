function system()
{
    var system = this;

    this.app = new app();
    this.placeholders = new placeholders();
    this.binders = new binders();
    this.cookies = new cookies();
    this.shortcuts = new shortcuts();
    this.http = new http();
    this.ui = new system_ui();
    this.topmenu = new topmenu();
    this.dom = undefined;

    function placeholders()
    {
        this.app = undefined;
        this.js = undefined;

        this.init = function(app, js)
        {
            this.app = document.getElementById(app);
            this.js = document.getElementById(js);
            delete this.init;
        }

        this.reset = function()
        {
            this.app.innerHTML = "";
            this.js.innerHTML = "";
        }
    }

    function binders()
    {
        this.bind = function(src, dom)
        {
            ko.applyBindings(src, dom);
        }

        this.unbind = function(dom)
        {
            ko.cleanNode(dom);
        }
    }

    function cookies()
    {
        this.write = function(key, value, expires, path)
        {
            if (self.expires == undefined && (expires != undefined || expires != null))
                self.expires = expires;
            
            if (path == undefined || path == null)
                path = '/';
            
            document.cookie = '' + key + '=' + value + '; expires=' + self.expires + '; path=' + path;
        }

        this.read = function(key)
        {
            var s1 = document.cookie.indexOf(key);
            var s2 = document.cookie.indexOf(';') > s1 ?
                document.cookie.substr(s1, document.cookie.indexOf(';')) :
                document.cookie.substr(s1, document.cookie.length);
    
            return s2.split('=')[1];
        }

        this.delete = function(key)
        {
            document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC'  + '; path=/;';
        }

        this.contains = function(key)
        {
            return 0 <= document.cookie.indexOf(key);
        }
    }

    function shortcuts()
    {
        this.root = $(window).keyup(function(e)
        {
            if (web.system.ui.popups.active != undefined)
            {
                if (e.keyCode == 27)
                    web.system.ui.popups.active.close();
                if (e.keyCode == 13)
                    web.system.ui.popups.active.dom.find("[autofocus]").click()
            }
        });
    }

    function app()
    {
        this.uid = undefined;
        this.current = undefined;

        this.init = function()
        {
            this.uid = get_uid();
            delete this.init;
        }

        this.close = function()
        {
            delete web.system.ui.popups.active
            system.binders.unbind(system.placeholders.app);
            system.placeholders.reset();
        }

        this.open = function(app, ignore_ui)
        {
            this.close();

            if (app == undefined || app == null)
                app = this.uid;

            if (ignore_ui != undefined && ignore_ui)
                set_js(app)
            else
            {
                set_js(app + ".ui");
                set_js(app);
            }

            set_uid(app);
            set_url(app);

            system.dom = $(system.placeholders.app);
        }

        function get_uid() 
        {
            return system.placeholders.app.getAttribute("data-app").valueOf();
        }
    
        function set_uid(uid) 
        {
            system.placeholders.app.setAttribute("data-app", system.app.uid = uid);
        }

        function set_url(app)
        {
            if (app == "index")
                return false;

            window.history.pushState(null, null, system.http.app_endpoint + "/" + app);
        }

        function set_js(src)
        {
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = "/static/js/" + src + ".js";
            system.placeholders.js.appendChild(js);
        }
    }

    function http()
    {
        var http = this;

        this.api_headers = { Token: system.cookies.read("Token") };
        this.api_endpoint = "http://localhost:7000";
        this.app_endpoint = "http://localhost:5000";

        this.get = function(success, uid) { request("GET", current_url(uid), undefined, success) }
        this.post = function(success, data) { request("POST", current_url(), data, success) }
        this.put = function(success, data, uid) { request("PUT", current_url(uid), data, success) }
        this.delete = function(success, uid) { request("DELETE", current_url(uid), undefined, success) }

        function validate_key(uid)
        {
            return uid == undefined || uid == null ? "" : "/" + uid;
        }

        function minimal_json(key, value)
        {
            return value == null || value == '' ? undefined : value;
        }

        function request(type, url, data, success)
        {
            $.ajax({
                data: JSON.stringify(data, minimal_json),
                contentType: "application/json; charset=utf-8",
                headers: http.api_headers,
                type: type,
                url: url,
                success: success,
                error: function(error)
                {
                    if (error.status == 401)
                    {
                        system.cookies.delete("Token");
                        system.app.open("login");
                    }
                }});
        }

        function current_url(uid)
        {
            return uid == undefined ? 
                http.api_endpoint + "/" + system.app.uid :
                http.api_endpoint + "/" + system.app.uid + validate_key(uid);
        }
    }

    function topmenu()
    {
        var topmenu = this;

        function change(uid)
        {
            topmenu.dom.find("a").removeClass("active");
            topmenu.dom.find("a#" + uid).addClass("active");
            web.system.app.open(uid);
        }

        this.users = function(e)
        {
            change("users");
        }

        this.tasks = function(e)
        {
            change("tasks");
        }

        this.apps = function(e)
        {
            change("apps");
        }

        this.roles = function(e)
        {
            change("roles");
        }

        this.permissions = function(e)
        {
            change("permissions");
        }

        this.signout = function(e)
        {
            web.system.dom.parent().find("#topmenu").remove();
            web.system.dom.parent().find("#topline").remove();
            web.system.cookies.delete("Token");

            change("login");
        }

        this.sidemenu = function()
        {
            web.system.sidemenu.action();
        }

        this.init = function()
        {
            topmenu.dom = $("#topmenu");
            web.system.binders.bind(topmenu, topmenu.dom.get(0));
        }
    }

    this.init = function()
    {
        this.placeholders.init("app", "js");
        this.topmenu.init();
        this.app.init();
        this.app.open();
        
        delete this.init;
    }
}

var web = { system: new system() }
window.onload = function() { web.system.init() }