Package.describe({
    name: 'partup:client-widgets-partupdetail-updates',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([
        'WidgetPartupdetailUpdates.html',
        'WidgetPartupdetailUpdates.js'
    ], 'client');
});