function system_ui()
{
    var self = this;

    this.forms = new forms();
    this.popups = new popups();
    this.gridview = new gridview();
    this.templates = new templates();
    
    this.draw = function(source, template)
    {
        source.dom = web.system.dom.append(template.html).find(template.id);

        if (web.system.cookies.contains("Token") && !web.system.dom.parent().find("#topmenu").length) {
            $(this.templates.topmenu.html).insertBefore(web.system.dom);
            $(this.templates.topline.html).insertBefore(web.system.dom);
            web.system.binders.bind(web.system.topmenu, $(this.templates.topmenu.id).get(0));
        }

        if (source.dom.hasClass("center"))
            self.set_centralize(source.dom);

        web.system.binders.bind(source, source.dom.get(0));
        web.system.ui.forms.reset();
    }

    this.set_draggable = function(dom)
    {
        dom.unbind("draggable").draggable({ handle: "#header" }).css({'cursor': 'move'});
    }

    this.set_centralize = function(dom)
    {
        function parse(src)
        {
            return src.toString() + "px";
        }

        dom.coordination = { 
            target_x: dom.width() / 2, target_y: dom.height() / 2,
            window_x: window.innerWidth / 2, window_y: window.innerHeight / 2 }

        dom.coordination.x = parse(dom.coordination.window_x - dom.coordination.target_x);
        dom.coordination.y = parse(dom.coordination.window_y - dom.coordination.target_y - (dom.height() / 2));
        dom.css({ position: "absolute", top: dom.coordination.y, left: dom.coordination.x });

        if (dom.hasClass("fixed"))
            window.onresize = function() { self.set_centralize(dom) }
    }

    function forms()
    {
        this.validate = function(src, ignore)
        {
            // ignore rules
            if (ignore != undefined || ignore != null)
                $.each(ignore, function(rule, value) {
                    if (!Array.isArray(value))
                        src.find("#"+rule).rules("remove", value);
                    else
                        $.each(value, function(index, values) {
                            src.find("#"+rule).rules("remove", values);
                        });
                });

            // bugfix float messages
            if (!src.valid())
                $.each(src.find("input.error"), function(idx, obj) {
                $("#"+obj.name+"-error").css({position:"absolute",left:obj.offsetLeft}); });
            
            return src.valid();
        }

        this.reset = function()
        {
            web.system.dom.find("form")
                          .attr("autocomplete", "off")
                          .find("[autofocus]")
                          .focus();
        }
    }

    function gridview()
    {
        this.gridview_action = new gridview_action();

        function gridview_action()
        {
            var self = this;

            this.set_clear = function(e)
            {
                if (e == undefined)
                    e = web.system.ui.gridview.gridview_action.anchor;

                $.each($(e).closest("tbody").find("tr"), function(i, e) { $(e).removeClass("active") });
            }

            this.set_select = function(e)
            {
                $(e).closest("tr").addClass("active");
            }

            this.init = function()
            {
                ko.bindingHandlers.gridview_action = {
                    init: function(element, value_accessor, all_bindings, view_model, binding_context) 
                    {
                        gridview.gridview_action = new gridview_action();

                        self.anchor = $(element);
                        self.anchor.click(function(e) 
                        {                            
                            if (web.system.ui.popups.active != null)
                                return false;
    
                            self.set_clear(e.currentTarget);
                            self.set_select(e.currentTarget);
                            self.method = value_accessor();
                            self.method(view_model);
                        });
                    }
                }
            }
        }
    }

    function popups() {
        this.active = undefined;

        this.create = function(app, template) {
            return new popup(app, template);
        }

        this.delete_confirm = function(data, callback) {
            return new delete_confirm(data, callback);
        }
    }

    function popup(app, template) {
        var self = this;

        this.init = function(app, template) {
            if (web.system.ui.popups.active != undefined)
                return false;

            web.system.ui.popups.active = app;
            web.system.ui.draw(app, template);
            web.system.ui.set_draggable(app.dom);
            app.dom.addClass("motionin");
        }

        this.destroy = function() {
            web.system.binders.unbind(web.system.ui.popups.active.dom);
            web.system.ui.popups.active.dom.removeClass("motionin").addClass("motionout");
            setTimeout(function() {
                web.system.ui.popups.active.dom.remove();
                web.system.ui.gridview.gridview_action.set_clear();
                web.system.dom.find(".modal.enabled").remove();
                delete web.system.ui.popups.active;
                delete self;
            }, 155);
        }

        this.init(app, template);
    }

    function delete_confirm(data, callback) {
        var self = this;

        if (data == undefined || data == null)
            return false;

        this.data = ko.observable(data);

        this.callback = callback;

        this.init = function() {
            this.popup = web.system.ui.popups.create(self, web.system.ui.templates.delete_confirm);
        }

        this.confirm = function(data) {
            web.system.http.delete(self.callback, data.id);
            self.popup.destroy();
        }

        this.close = function() {
            self.popup.destroy();
        }

        this.init();
    }

    function templates() {
        this.delete_confirm = {
            id: "#delete_confirm",
            html: `
            <div class="modal enabled"></div>        
            <div id="delete_confirm" class="popup center" data-bind="with: data">
                <div id="header" class="txt-left">
                    <h3 data-bind="text: title">[Title]</h3>
                </div>
                <div id="body">
                    <div class="row txt-center fs-9em top-20px">
                        <input type="hidden" id="id" name="id" data-bind="value: id" />
                        <p><label data-bind="text: text"></label></p>
                    </div>
                    <div class="footer txt-center top-20px">
                        <input type="button" value="CLOSE" data-bind="click: $root.close"/>
                        <input autofocus class="red" type="button" value="CONFIRM" data-bind="click: $root.confirm" />
                    </div>
                </div>
            </div>
            `
        }
        this.topline = {
            id: "#topline",
            html: `
            <div id="topline">
                September 18, 2017 - Santos/SP
            </div>
            `
        }
        this.topmenu = {
            id: "#topmenu",
            html: `
            <div id="topmenu">
                <ul>
                    <li>
                        <a href=""><div class="glyph-icon flaticon-reorder-option"></div></a>
                        <div id="sidebar" class="effect">
                            <ul class="fromLeft">
                                <li><a href="" id="tasks" data-bind="click: $root.tasks"><div class="glyph-icon flaticon-time"></div><span>TASKS</span></a></li>
                                <li><a href="" id="apps" data-bind="click: $root.apps"><div class="glyph-icon flaticon-list-on-window"></div><span>APPS</span></a></li>
                                <li><a href="" id="users" data-bind="click: $root.users"><div class="glyph-icon flaticon-group-profile-users"></div><span>USERS</span></a></li>
                                <li><a href="" id="roles" data-bind="click: $root.roles"><div class="glyph-icon flaticon-shield"></div><span>ROLES</span></a></li>
                                <li><a href="" id="permissions" data-bind="click: $root.permissions"><div class="glyph-icon flaticon-padlock-unlock"></div><span>PERMISSIONS</span></a></li>
                            </ul>
                        </div>
                        <div class="modal"></div>
                    </li>
                    <li><span id="brand">Xero<span>Source</span></span></li>
                </ul>
                <ul>
                    <li><a href=""><div class="glyph-icon flaticon-magnifying-glass"></div></a></li>
                    <li><a href=""><div class="glyph-icon flaticon-settings"></div></a></li>
                    <li>
                        <a href=""><div class="glyph-icon flaticon-user-shape"></div></a>
                        <div id="profile" class="effect">
                            <ul class="fromTop">
                                <li>Developer GNU</li>
                                <li>
                                    <span>Last Seen</span>
                                    <span>2017-09-20 23:35.00</span>
                                </li>
                                <li>
                                    <a href="" class="float-left">
                                        <span class="glyph-icon flaticon-cog-wheel-silhouette icon-only"></span>
                                        <span>Settings</span>
                                    </a>
                                    <a href="" class="float-right" data-bind="click: $root.signout">
                                        <span class="glyph-icon flaticon-sign-out-option icon-only"></span>
                                        <span>Sign Out</span>    
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="modal"></div>
                    </li>
                </ul>
            </div>
            `
        }
    }
}