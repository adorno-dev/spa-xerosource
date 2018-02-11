function login()
{
    var self = this;

    this.ui = new login_ui();
    
    this.data = ko.observable({ login: null, password: null, remember: false });

    this.init = function()
    {
        web.system.ui.draw(this, this.ui.index);
    }

    this.submit = function()
    {
        if (!this.ui.index.validate())
            return false;

        web.system.http.post(self.postback, self.data());
    }

    this.postback = function(data)
    {
        if (data.token != undefined || data.token != null)
        {
            web.system.cookies.write("Token", data.token, data.expires, "/");
            web.system.http.api_headers = { Token: data.token };
            web.system.app.open("tasks");
        }
    }

    this.register = function() 
    {
        web.system.app.open("register");
    }

    this.init();
}

$(function() { new login() });

// window.onload = function() { new login() }