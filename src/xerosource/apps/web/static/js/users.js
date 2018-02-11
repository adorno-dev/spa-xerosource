function users_entry(template, data, callback)
{
    var self = this;

    this.title = ko.observable(data == undefined || data == null ? "New User" : "Edit User");
    this.template = template;
    this.callback = callback;

    this.data = (data == undefined || data == null) ?
        ko.observable({ 
            id: null, 
            name: null, 
            login: null, 
            email: null, 
            role_id: null, 
            password: null, 
            password_confirm: null 
        }) : 
        ko.observable({
            id: data.id, 
            name: data.name, 
            login: data.login, 
            email: data.email, 
            role_id: data.role_id, 
            password: null, 
            password_confirm: null
        });
    
    this.init = function()
    {
        this.popup = web.system.ui.popups.create(self, this.template);
    }

    this.submit = function()
    {
        var values = self.data();

        if (!this.template.validate(values.id == null ? {} : { password: "required", password_confirm: "required" }))
            return false;

        values.id == null ?
            web.system.http.post(self.callback, values) :
            web.system.http.put(self.callback, values, values.id);
        
        self.popup.destroy();
    }

    this.close = function()
    {
        self.popup.destroy();
    }

    this.init();
}

function users()
{
    var self = this;

    this.ui = new users_ui();

    this.data = ko.observable();

    this.init = function()
    {
        web.system.http.get(self.callback);
        web.system.ui.gridview.gridview_action.init();
    }

    this.callback = function(data)
    {
        self.data(data);
        web.system.ui.draw(self, self.ui.index);
    }

    this.new_user = function()
    {
        new users_entry(self.ui.entry, undefined, self.data);
    }

    this.edit_user = function(data)
    {
        new users_entry(self.ui.entry, data, self.data);
    }

    this.delete_user = function(data)
    {
        var values = { title: "Delete User", id: data.id, text: data.name };
        web.system.ui.popups.delete_confirm(values, self.data);
    }

    this.init();
}

$(function() { new users() });