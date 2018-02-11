function users_ui()
{
    var self = this;

    this.index = {
        id: "#index",
        html: `
        <div id="index">
            <div id="header">
                <h3>Users</h3>
                <div id="actions">
                    <button class="blue" data-bind="click: $root.new_user">New</button>
                </div>
            </div>
            <div id="body">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Login</th>
                            <th>Email</th>
                            <th>Member Since</th>
                            <th>Last Seen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: data">
                        <tr>
                            <td data-bind="text: name"></td>
                            <td data-bind="text: login"></td>
                            <td data-bind="text: email"></td>
                            <td data-bind="text: member_since"></td>
                            <td data-bind="text: last_seen"></td>
                            <td class="txt-right">
                                <a data-bind="gridview_action: $root.edit_user">Edit</a>
                                <span>/</span>
                                <a data-bind="gridview_action: $root.delete_user">Delete</a>
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
                <h3 data-bind="text: title">[User Entry]</h3>
            </div>
            <div id="body">
                <form data-bind="submit: submit, with: data">
                    <div class="row">
                        <input type="hidden" id="id" name="id" data-bind="value: id" />
                        <input autofocus autocomplete="off" type="text" name="name" placeholder="Name" data-bind="value: name" />
                    </div>
                    <div class="row">
                        <input autocomplete="off" type="text" name="email" placeholder="Email" data-bind="value: email" />
                    </div>
                    <div class="row">
                        <input autocomplete="off" type="text" name="login" placeholder="Login" data-bind="value: login" />
                    </div>
                    <div class="row cols2">
                        <input type="password" id="password" name="password" placeholder="Password" data-bind="value: password"/>
                        <input type="password" id="password_confirm" name="password_confirm" placeholder="Re-password" data-bind="value: password_confirm"/>
                    </div>
                    <div class="footer txt-center top-10px">
                        <input class="" type="button" value="CLOSE" data-bind="click: $root.close"/>
                        <input class="blue" type="submit" value="CONFIRM"/>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal enabled"></div>
        `,
        validate: function(ignore)
        {
            self.entry.form = web.system.dom.find(self.entry.id).find("form");
            self.entry.form.validate({ 
                rules: { 
                    name: "required", 
                    email: { required: true, email: true },
                    login: "required",
                    password: "required",
                    password_confirm: { required: true, equalTo: "#password" }
                },
                messages: {
                    email: {
                        required: "Please enter an email address!",
                        email: "Please enter a <em>valid</em> email address!"
                    }
                }
            });

            return web.system.ui.forms.validate(self.entry.form, ignore);
        }
    }
}