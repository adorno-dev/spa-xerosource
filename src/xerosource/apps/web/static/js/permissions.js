function permissions_entry(template, data, callback)
{
    var self = this;

    this.title = ko.observable(data == undefined || data == null ? "New Permission" : "Edit Permission");
    this.template = template;
    this.callback = callback;

    this.data = (data == undefined || data == null) ?
        ko.observable({ 
            id: null,
            name: null, 
            value: null, 
        }) :
        ko.observable({ 
            id: data.id,
            name: data.name, 
            value: data.value
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

function permissions()
{
    var self = this;

    this.ui = new permissions_ui();

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

    this.new_permission = function()
    {
        new permissions_entry(self.ui.entry, undefined, self.data);
    }

    this.edit_permission = function(data)
    {
        new permissions_entry(self.ui.entry, data, self.data);
    }

    this.delete_permission = function(data)
    {
        var values = { title: "Delete Permission", id: data.id, text: data.name };
        web.system.ui.popups.delete_confirm(values, self.data);
    }

    this.init();
}

$(function() { new permissions() });