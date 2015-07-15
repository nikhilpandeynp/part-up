// jscs:disable
/**
 * Renders the prompt container, overlay and dismiss handlers
 *
 * @module client-prompt
 * @param {Number} networkId    the id of the network whose uppers are rendered
 */
// jscs:enable

Template.Prompt.onDestroyed(function() {
    Partup.client.prompt.reset();
});

Template.Prompt.helpers({
    promptActive: function() {
        return Partup.client.prompt.active.get();
    },
    title: function() {
        return Partup.client.prompt.title.get();
    },
    message: function() {
        return Partup.client.prompt.message.get();
    },
    cancelButton: function() {
        return Partup.client.prompt.cancelButton.get();
    },
    confirmButton: function() {
        return Partup.client.prompt.confirmButton.get();
    }
});

Template.Prompt.events({
    'click [data-confirm]': function(event, template) {
        Partup.client.prompt.onConfirm(event, template);
    },
    'click [data-cancel]': function(event, template) {
        Partup.client.prompt.onCancel(event, template);
    }

});
