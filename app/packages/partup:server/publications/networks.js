Meteor.publishComposite('networks.all', function() {
    return {
        find: function() {
            return Networks.find({}, {fields: {description: 1, name: 1, privacy_type: 1, tags: 1, image: 1}});
        },
        children: [
            {
                find: function(network) {
                    var partups = network.partups || [];

                    return Partups.find({_id: {$in: partups}}, {fields: {name: 1, description: 1}});
                }
            }
        ]
    };
});

Meteor.publish('networks.user', function() {
    var user = Meteor.users.findSinglePublicProfile(this.userId).fetch().pop();
    var userNetworkIds = user.networks || [];
    return Networks.find({$or: [{_id: {$in: userNetworkIds}}, {privacy_type: 1}]}, {privacy_type: 1, name: 1});
});

Meteor.publish('networks.list', function() {
    return Networks.find({}, {privacy_type: 1, name: 1});
});

Meteor.publishComposite('networks.one.partups', function(networkId, options) {
    var self = this;

    return {
        find: function() {
            options.networkId = networkId;
            return Partups.findForNetwork(self.userId, options);
        }
    };
});

Meteor.publish('networks.one.partups.count', function(networkId, options) {
    var self = this;
    options.networkId = networkId;
    options = options || {};
    options.count = true;

    Counts.publish(this, 'networks.one.partups.filterquery', Partups.findForNetwork(self.userId, options));
});

Meteor.publishComposite('networks.one.uppers', function(networkId) {
    var self = this;

    return {
        find: function() {
            var network = Networks.guardedFind(self.userId, {_id: networkId});
            var uppers = network.uppers || [];
            return Meteor.users.findMultiplePublicProfiles(uppers);
        },
        children: [
            {
                find: function(user) {
                    return Images.find({_id: user.profile.image}, {limit: 1});
                }
            }
        ]
    };
});

Meteor.publishComposite('networks.one.pending_uppers', function(networkId) {
    var self = this;

    return {
        find: function() {
            var network = Networks.guardedFind(self.userId, {_id: networkId});
            var pending_uppers = network.pending_uppers || [];
            return Meteor.users.findMultiplePublicProfiles(pending_uppers);
        },
        children: [
            {
                find: function(user) {
                    return Images.find({_id: user.profile.image}, {limit: 1});
                }
            }
        ]
    };
});

Meteor.publishComposite('networks.one', function(networkId) {
    var self = this;

    return {
        find: function() {
            return Networks.guardedFind(self.userId, {_id: networkId}, {limit: 1});
        },
        children: [
            {
                find: function(network) {
                    var iconId = network.icon || null;
                    return Images.find({_id: iconId}, {limit: 1});
                }
            },
            {
                find: function(network) {
                    var imageId = network.image || null;
                    return Images.find({_id: imageId}, {limit: 1});
                }
            },
            {
                find: function(network) {
                    var partups = network.partups || [];
                    return Partups.find({_id: {$in: partups}});
                }
            },
            {
                find: function(network) {
                    var uppers = network.uppers || [];
                    return Meteor.users.findMultiplePublicProfiles(uppers);
                },
                children: [
                    {
                        find: function(user) {
                            return Images.find({_id: user.profile.image}, {limit: 1});
                        }
                    }
                ]
            }
        ]
    };
});
