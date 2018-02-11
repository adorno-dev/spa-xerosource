function login_ui()
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
                    Welcome
                </div>
                <div id="body">
                    <form data-bind="submit: submit, with: data">
                        <div class="row"><input type="text" id="login" name="login" placeholder="Login" data-bind="value: login" /></div>
                        <div class="row"><input type="password" id="password" name="password" placeholder="Password" data-bind="value: password" /></div>
                        <div class="row">
                            <div class="txt-center top-10px">
                                <input type="checkbox" id="remember" name="remember" data-bind="checked: remember" />
                                <label class="cursor-pointer fs-9em" for="remember">Remember me?</label>
                            </div>
                        </div>
                        <div class="footer txt-center">
                            <input type="submit" value="LOGIN" class="txt-center blue" />
                        </div>
                        <div class="footer txt-right">
                            <span class="fs-9em">Don't have an account? <a href="" data-bind="click: $root.register">Create</a> it now!</span>
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
                    login: "required", 
                    password: "required"
                }
            });
            return self.index.form.valid();
        }
    }
}