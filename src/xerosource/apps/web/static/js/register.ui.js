function register_ui()
{
    var self = this;

    this.index = {
        id: "#index",
        html: `
        <div id="index" class="login txt-center">
            <div class="panel center fixed">
                <div id="header" class="txt-left">
                    <div><span id="brand">Xero<span>Source</span></span></div>
                </div>
                <div id="topline" class="txt-left">
                    Create your account
                </div>
                <div id="body">
                    <form data-bind="submit: submit, with: data">
                        <div class="row">
                            <input autofocus type="text" id="name" name="name" placeholder="Name" data-bind="value: name"/>
                        </div>
                        <div class="row">
                            <input type="text" id="email" name="email" placeholder="Email" data-bind="value: email"/>
                        </div>
                        <div class="row">
                            <input type="text" id="login" name="login" placeholder="Login" data-bind="value: login"/>
                        </div>
                        <div class="row cols2">
                            <input type="password" id="password" name="password" placeholder="Password" data-bind="value: password"/>
                            <input type="password" id="password_confirm" name="password_confirm" placeholder="Re-password" data-bind="value: password_confirm"/>
                        </div>
                        <div class="footer txt-center">
                            <input type="submit" value="SIGNUP" class="txt-center blue" />
                        </div>
                        <div class="footer txt-right">
                            <span class="fs-9em">Already have an account? <a href="" data-bind="click: $root.login">Login</a> now!</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `,
        validate: function()
        {
            self.index.form = web.system.dom.find(self.index.id).find("form");
            self.index.form.validate({ 
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

            return web.system.ui.forms.validate(self.index.form);
        }
    }
}