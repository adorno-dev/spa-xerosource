function roles_entry(template, data, callback)
{
    var self = this;

    this.title = ko.observable(data == undefined || data == null ? "New Role" : "Edit Role");
    this.template = template;
    this.callback = callback; 

    this.data = (data == undefined || data == null) ?
        ko.observable({ 
            id: null,
            name: null,
            permissions: null,
            is_default: false
        }) :
        ko.observable({
            id: data.id,
            name: data.name,
            permissions: data.permissions,
            is_default: data.is_default
        });
    
    this.init = function()
    {
        this.popup = web.system.ui.popups.create(self, this.template);
    }

    this.submit = function()
    {
        var values = self.data();

        if (!this.template.validate())
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

function roles()
{
    var self = this;

    this.ui = new roles_ui();

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

    this.new_role = function()
    {
        new roles_entry(self.ui.entry, undefined, self.data);
    }

    this.edit_role = function(data)
    {
        new roles_entry(self.ui.entry, data, self.data);
    }

    this.delete_role = function(data)
    {
        var values = { title: "Delete Role", id: data.id, text: data.name };
        web.system.ui.popups.delete_confirm(values, self.data);
    }

    this.init();
}

$(function() { new roles() });