/*************************************************************/
/* Function to provide a temporarely customized locale Moment */
/*************************************************************/
var localCustomizedMoment = function localCustomizedMoment (language, customizations, callback) {

    // Save current locale data
    var localeData = moment.localeData();
    var savedCustomizations = {};
    _.each(customizations, function(customization, key) {
        savedCustomizations[key] = localeData['_' + key];
    });

    // Customize moment
    moment.locale(language, customizations);

    // Execute the callback
    callback();

    // Reset to previously saved locale data
    moment.locale(language, savedCustomizations);

};

/*************************************************************/
/* Global date formatter helpers */
/*************************************************************/
Template.registerHelper('partupDateNormal', function(date) {
    return moment(date).format('LL');
});

Template.registerHelper('partupDateFull', function(date) {
    return moment(date).format('LLL');
});

Template.registerHelper('partupDateCustom', function(date, format) {
    return moment(date).format(format);
});

Template.registerHelper('partupDateISO', function(date) {
    return moment(date).toISOString();
});

Template.registerHelper('partupDatePartupActivity', function(date) {
    var RELATIVE_TIME_TRESHOLD = 12 * 60 * 60 * 1000; // 12 hours
    var mDate = moment(date);

    if (moment().diff(mDate) < RELATIVE_TIME_TRESHOLD) {
        var language = TAPi18n.getLanguage();
        mDate.locale(language);
        var output = '';
        localCustomizedMoment(language, {
            relativeTime: {
                s:  __('base-helpers-dateFormatters-partup-activity-s'),
                m:  __('base-helpers-dateFormatters-partup-activity-m'),
                mm:  __('base-helpers-dateFormatters-partup-activity-mm'),
                h:  __('base-helpers-dateFormatters-partup-activity-h'),
                hh:  __('base-helpers-dateFormatters-partup-activity-hh')
            }
        }, function() {
            output = mDate.fromNow(true);
        });
        return output;
    }

    return mDate.format('LT');
});

Template.registerHelper('partupDatePartupTimeline', function(date) {
    var RELATIVE_TIME_TRESHOLD = 7 * 24 * 60 * 60 * 1000; // 1 week
    var mDate = moment(date);

    if (moment().diff(mDate) < RELATIVE_TIME_TRESHOLD) {
        var lang = TAPi18n.getLanguage();
        mDate.locale(lang);
        var output = '';
        localCustomizedMoment(lang, {
            relativeTime: {
                d:  __('base-helpers-dateFormatters-partup-timeline-d'),
                dd:  __('base-helpers-dateFormatters-partup-timeline-dd')
            }
        }, function() {
            output = mDate.fromNow(true);
        });
        return output;
    }

    return mDate.format('LL');
});
