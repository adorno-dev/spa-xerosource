function apps_entry(template, data, callback)
{
    var self = this;

    this.title = ko.observable(data == undefined || data == null ? "New App" : "Edit App");
    this.template = template;
    this.callback = callback;

    this.data = (data == undefined || data == null) ?
        ko.observable({ 
            id: null,
            name: null, 
            public_key: null, 
            is_active: false
        }) :
        ko.observable({ 
            id: data.id,
            name: data.name, 
            public_key: data.public_key, 
            is_active: data.is_active
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

function apps()
{
    var self = this;

    this.ui = new apps_ui();

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

    this.new_app = function()
    {
        new apps_entry(self.ui.entry, undefined, self.data);
    }

    this.edit_app = function(data)
    {
        new apps_entry(self.ui.entry, data, self.data);
    }

    this.delete_app = function(data)
    {
        var values = { title: "Delete App", id: data.id, text: data.name };
        web.system.ui.popups.delete_confirm(values, self.data);
    }

    this.init();
}

$(function() { new apps() });