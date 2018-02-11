function tasks_ui()
{
    var self = this;

    this.index = {
        id: "#index",
        html: `
        <div id="index">
            <div id="header">
                <h3>Tasks</h3>
                <div id="actions">
                    <button class="blue" data-bind="click: $root.new_task">New</button>
                </div>
            </div>
            <div id="body">
                <table>
                    <thead>
                        <tr>
                            <th>Uid</th>
                            <th>Task</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: data">
                        <tr>
                            <td data-bind="text: id"></td>
                            <td data-bind="text: text"></td>
                            <td class="txt-right">
                                <a data-bind="gridview_action: $root.edit_task">Edit</a>
                                <span>/</span>
                                <a data-bind="gridview_action: $root.delete_task">Delete</a>
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
    },

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
                        <input autofocus type="text" id="text" name="text" placeholder="Text" data-bind="value: text"/>
                    </div>
                    <div class="footer txt-center top-10px">
                        <input type="button" value="CLOSE" class="txt-center" data-bind="click: $root.close" />
                        <input type="submit" value="CONFIRM" class="txt-center blue" />
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
                    text: "required", 
                }
            });

            return web.system.ui.forms.validate(self.entry.form);
        }
    }
}