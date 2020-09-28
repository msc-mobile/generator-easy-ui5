/* eslint-disable strict */
sap.ui.define([
        "../BaseFragmentController"
    ],
    function(BaseFragmentController) {
        "use strict";

        return BaseFragmentController.extend(
            "<%=namespace%>.<%=projectname%>.view.<%=viewname%>FragmentController", {

                constructor: function(oCallingController) {
                    BaseFragmentController.call(this, oCallingController, "<%=viewname%>");
                },

                /**
                 * Opens the dialog.
                 */
                open: function() {
                    // this.loadFragment("<%= namespace%>.<%=projectname%>.view.<%=viewname%>").then(oDialog => {
                    //     this._oDialog = oDialog;
                    //     oDialog.open();
                    // });
                },

                /**
                 * Closes the dialog.
                 */
                onClose: function() {
                    // this._oDialog.close();
                }
            }
        );
    }
);