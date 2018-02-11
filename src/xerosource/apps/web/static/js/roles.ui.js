function roles_ui()
{
    var self = this;

    this.index = {
        id: "#index",
        html: `
        <div id="index">
            <div id="header">
                <h3>Roles</h3>
                <div id="actions">
                    <button class="blue" data-bind="click: $root.new_role">New</button>
                </div>
            </div>
            <div id="body">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Default</th>
                            <th>Permissions</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: data">
                        <tr>
                            <td data-bind="text: name"></td>
                            <td data-bind="text: is_default"></td>
                            <td data-bind="text: permissions"></td>
                            <td class="txt-right">
                                <a data-bind="gridview_action: $root.edit_role">Edit</a>
                                <span>/</span>
                                <a data-bind="gridview_action: $root.delete_role">Delete</a>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr><td colspan="77">All records loaded with successfully!</td></tr>
                    </tfoot>
                </table>
            </div>
        </div>
        `
    }

    this.entry = {
        id: "#entry",
        html: `
        <div id="entry" class="popup center">
            <div id="header" class="txt-left">
                <h3 data-bind="text: title">[Title]</h3>
            </div>
            <div id="body">
                <form data-bind="submit: submit, with: data">
                    <div class="row">
                        <input type="hidden" id="id" name="id" data-bind="value: id" />
                        <input autofocus autocomplete="off" type="text" name="name" placeholder="Name" data-bind="value: name" />
                    </div>
                    <div class="row">
                        <input autocomplete="off" type="text" name="permissions" placeholder="Permissions" data-bind="value: permissions" />
                    </div>
                    <div class="row">
                        <div class="txt-center top-10px">
                            <input id="is_default" name="is_default" type="checkbox" data-bind="checked: is_default"/>
                            <label class="cursor-pointer" for="is_default">Default Role?</label>
                        </div>
                    </div>
                    <div class="footer txt-center">
                        <input class="" type="button" value="CLOSE" data-bind="click: $root.close"/>
                        <input class="blue" type="submit" value="CONFIRM"/>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal enabled"></div>
        `,
        validate: function()
        {
            self.entry.form = web.system.dom.find(self.entry.id).find("form");
            self.entry.form.validate({ 
                rules: { 
                    name: "required", 
                    permissions: "required"
                },
            });

            return web.system.ui.forms.validate(self.entry.form);
        }
    }
}