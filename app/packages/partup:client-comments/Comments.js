// jscs:disable
/**
 * Widget to render comments and a comment field
 *
 * @module client-commentfield
 * @param {Object} update               The update object containing the comments
 * @param {ReactiveVar} showCommentForm Variable that controls the visibility of the comment form
 * @param {Number} LIMIT                Limit the amount of comments shown to this number, then add "show more" link
 * @param {Boolean} SHOW_COMMENTS       Show existing comments
 *
 */
// jscs:enable

/*************************************************************/
/* Widget rendered */
/*************************************************************/
Template.Comments.onCreated(function() {
    this.submitting = new ReactiveVar(false);
    this.expanded = new ReactiveVar(false);
    this.buttonActive = new ReactiveVar(false);

    this.LIMIT = this.data.LIMIT || 0;
    this.showComments = this.data.SHOW_COMMENTS === undefined ||
        this.data.SHOW_COMMENTS === true;

    this.messageRows = new ReactiveVar(1);
    this.tooManyCharacters = new ReactiveVar(false);
});

Template.Comments.onRendered(function() {
    this.input = this.find('[name=content]');
    this.mentionsInput = Partup.client.forms.MentionsInput(this.input);
});

Template.Comments.helpers({
    showCommentFormAndMayComment: function() {
        return this.showCommentForm && Meteor.user();
    },
    buttonActive: function() {
        return Template.instance().buttonActive.get();
    },
    formSchema: Partup.schemas.forms.updateComment,
    generateFormId: function() {
        return 'commentForm-' + this.update._id;
    },
    placeholders: {
        comment: function() {
            return __('widgetcommentfield-comment-placeholder');
        }
    },
    showComments: function() {
        return Template.instance().showComments;
    },
    showExpandButton: function() {
        if (!this.update) return false;

        var commentsExpanded = Template.instance().expanded.get();
        if (commentsExpanded) return false;

        var limit = Template.instance().LIMIT;
        if (!limit) return false;

        var count = this.update.comments_count;
        if (!count || (count - limit) < 1) return false;

        return true;
    },
    shownComments: function() {
        if (!this.update) return [];
        var comments = this.update.comments || [];

        var commentsExpanded = Template.instance().expanded.get();
        if (commentsExpanded) return comments;

        var limit = Template.instance().LIMIT;
        if (!limit) return comments;

        return comments.slice(-limit);
    },
    content: function() {
        return Partup.helpers.mentions.decode(this.content);
    },
    systemMessage: function(content) {
        return __('comment-field-content-' + content);
    },
    submitting: function() {
        return Template.instance().submitting.get();
    },
    isSystemMessage: function() {
        return this.type === 'system' || this.system;
    },
    isMotivation: function() {
        return this.type === 'motivation';
    },
    partup: function() {
        return Partups.findOne(this.update.partup_id);
    },
    messageRows: function() {
        return Template.instance().messageRows.get();
    },
    messageTooLong: function() {
        return Template.instance().tooManyCharacters.get();
    }
});

Template.Comments.events({

    'click [data-expand-comments]': function(event, template) {
        template.expanded.set(true);
    },

    'keydown [data=commentfield]': function(event, template) {
        var totalCharacters = event.currentTarget.value.length;
        if (totalCharacters > 1000) {
            template.tooManyCharacters.set(true);
        } else {
            template.tooManyCharacters.set(false);
        }

        if (event.keyCode === 8 || event.keyCode === 46) {
            if (template.tooManyCharacters.get()) AutoForm.validateForm('commentForm-' + template.data.update._id);
        }

        var pressedKey = event.which ? event.which : event.keyCode;
        if (pressedKey == 13 && !event.shiftKey) {
            event.preventDefault();
            $('#commentForm-' + template.data.update._id).submit();
            return false;
        }

    },
    'input [data=commentfield]': function(event, template) {
        template.buttonActive.set(!!event.currentTarget.value);

        if (event.currentTarget.offsetHeight < event.currentTarget.scrollHeight) {
            template.messageRows.set(template.messageRows.get() + 1);
        }
    }

});

AutoForm.addHooks(null, {
    onSubmit: function(insertDoc) {
        var self = this;
        self.event.preventDefault();

        var formNameParts = self.formId.split('-');
        if (formNameParts.length !== 2 || formNameParts[0] !== 'commentForm') return;
        var updateId = formNameParts[1];

        var template = self.template.parent();
        template.submitting.set(true);

        if (template.data.type === 'motivation') {
            insertDoc.type = 'motivation';
        }

        insertDoc.content = template.mentionsInput.getValue();

        if (template.data.POPUP) {
            Partup.client.popup.close({
                success: true,
                comment: insertDoc
            });
            return false;
        }

        Meteor.call('updates.comments.insert', updateId, insertDoc, function(error, result) {
            template.submitting.set(false);
            if (error) {
                return Partup.client.notify.error(__('error-method-' + error.reason));
            }
            template.messageRows.set(1);
            template.tooManyCharacters.set(false);

            Partup.client.updates.addUpdateToUpdatesCausedByCurrentuser(updateId);

            template.buttonActive.set(false);
            AutoForm.resetForm(self.formId);

            self.done();
        });

        return false;
    }
});
