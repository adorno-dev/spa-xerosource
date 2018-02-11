function tasks_entry(template, data, callback)
{
    var self = this;

    this.title = ko.observable(data == undefined || data == null ? "New Task" : "Edit Task");
    this.template = template;
    this.callback = callback;

    this.data = (data == undefined || data == null) ?
        ko.observable({ 
            id: null, 
            text: null 
        }) :
        ko.observable({ 
            id: data.id, 
            text: data.text 
        });

    this.init = function()
    {
        this.popup = web.system.ui.popups.create(self, this.template);
    }

    this.submit = function()
    {
        if (!this.template.validate())
            return false;

        var values = self.data();

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

function tasks()
{
    var self = this;

    this.ui = new tasks_ui();
    
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

    this.new_task = function()
    {
        new tasks_entry(self.ui.entry, undefined, self.data);
    }

    this.edit_task = function(data)
    {
        new tasks_entry(self.ui.entry, data, self.data);
    }

    this.delete_task = function(data)
    {
        var values = { title: "Delete Task", id: data.id, text: data.text };
        web.system.ui.popups.delete_confirm(values, self.data);
    }

    this.init();
}

new tasks();