function register()
{
    var self = this;

    this.ui = new register_ui();

    this.data = ko.observable({
        name: null,
        email: null,
        login: null,
        password: null,
        password_confirm: null
    });

    this.init = function()
    {
        web.system.ui.draw(self, self.ui.index);
    }

    this.submit = function(src)
    {
        if (!self.ui.index.validate())
            return false;

        web.system.http.post(self.postback, self.data());
    }

    this.postback = function(response, status)
    {
        if (status == "success")
            web.system.app.open("login");
    }

    this.login = function()
    {
        web.system.app.open("login");
    }

    this.init();
}

$(function() { new register() });

// window.onload = function() { new register() }