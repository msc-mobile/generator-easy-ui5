sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/base/strings/formatMessage",
    "<%=appURI%>/model/formatter"
], function(Controller, History, UIComponent, Fragment, JSONModel, MessagePopover, MessagePopoverItem, formatMessage, formatter) {
    "use strict";

    return Controller.extend("<%=appId%>.controller.BaseController", {


        /**
         * @property {formatter} formatter reference to the apps formatter
         */
        formatter: formatter,

        /**
         * @property {map} _mFragments stores all loaded fragment files, indexed by fragment name.
         * @protected
         */
        _mFragments: {},

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function(sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method to fetch the view model of the current view controller.
         * The view model will be created if it doesn't exist.
         * @returns {sap.ui.model.json.JSONModel} the view model
         */
        getViewModel: function() {;
            let oViewModel = this.getModel("view");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    delay: 0
                });
                this.setModel(oViewModel, "view");
            }
            return oViewModel;
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },


        /**
         * Convenience method to return a localized text from the resource bundles.
         * @param {string} sId the text id as defined in the i18n files
         * @param {array} [aTexts] array of strings to replace the placeholders in the text.
         * @returns {string}
         */
        i18n: function(sId, aTexts) {
            return formatMessage(this.getOwnerComponent().getModel("i18n").getProperty(sId), aTexts);
        },

        /**
         * Method for navigation to specific view
         * @public
         * @param {string} sTarget Parameter containing the string for the target navigation
         * @param {mapping} mParameters? Parameters for navigation
         * @param {boolean} bReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
         */
        navTo: function(sTarget, mParameters, bReplace) {
            this.getRouter().navTo(sTarget, mParameters, bReplace);
        },

        /**
         * Returns this components message manager
         * @returns {arl.inventory.createdocument.util.MessageManager}
         */
        getMessageManager: function() {
            return this.getOwnerComponent().getMessageManager();
        },

        /**
         * Event triggered when the message button is pressed (usually in the footer toolbar of Sematic Pages in Fiori apps).
         * Opens the message popover above the message indicator.
         * @see https://experience.sap.com/fiori-design-web/semantic-page/
         * @param {sap.ui.core.Event} oEvent the control's event
         */
        onMessageButtonPress: function(oEvent) {
            var oMessagesButton = oEvent.getSource();

            if (!this._oMessagePopover) {
                this._oMessagePopover = new MessagePopover({
                    items: {
                        path: "message>/",
                        template: new MessagePopoverItem({
                            description: "{message>description}",
                            type: "{message>type}",
                            title: "{message>message}"
                        })
                    }
                });
                oMessagesButton.addDependent(this._oMessagePopover);
            }
            this._oMessagePopover.toggle(oMessagesButton);
        },

        /**
         * Convenience method to return this components <code>Router</code>
         * @returns {sap.ui.core.Router}
         */
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Navigates to the previous screen.
         */
        onNavBack: function() {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("home", {}, true /*no history*/ );
            }
        },

        /**
         * Loads a fragment.  Fragments are loaded only once.
         * @param {string} sName name of the XML Fragment (i.e. fully qualified name of fragment)
         * @param {object} oController controller for this fragment.  Can be null (if null this controller is used)
         * @param {string} [sId] id of the fragment
         * @returns {Promise} a Promise resolved with the contents of the fragment
         */
        loadFragment: function(sName, oController, sId) {

            return new Promise((resolve, reject) => {
                const _sId = !!sId ? sId : sName;

                let oFragment = this._mFragments[_sId];

                if (!oFragment) {
                    Fragment.load({
                        name: sName,
                        controller: oController || this,
                        id: _sId
                    }).then((oFragment) => {
                        const oMetadata = oFragment.getMetadata();
                        if (oMetadata.getInterfaces().indexOf("sap.ui.core.PopupInterface") > -1 || oMetadata.getName().indexOf("Dialog") > -1) {
                            // assign content density class for all element rendered outside application DOM.
                            oFragment.addStyleClass(this.getOwnerComponent().getContentDensityClass());
                        }
                        this._mFragments[_sId] = oFragment;
                        this.getView().addDependent(oFragment);
                        resolve(oFragment);
                    });
                } else {
                    resolve(oFragment);
                }
            });
        }

    });

});
