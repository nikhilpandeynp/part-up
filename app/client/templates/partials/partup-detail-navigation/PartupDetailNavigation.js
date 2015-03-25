/*************************************************************/
/* Partial rendered */
/*************************************************************/
Template.PartialsPartupDetailNavigation.rendered = function() {
    if(!window || !document) return;

    var OFFSET = 100;
    var pageElm = document.querySelector('.pu-layout .pu-sub-page');
    if(!pageElm) return;
    var leftElm = pageElm.querySelector('.pu-sub-partupdetail-left');
    if(!leftElm) return;

    var calculateBackgroundWidth = function calculateBackgroundWidth () {
        var backgroundWidth = (window.innerWidth - pageElm.offsetWidth) / 2 + leftElm.offsetWidth + OFFSET;
        Session.set('partials.partup-detail-navigation.background-width', backgroundWidth);
    };
    
    window.addEventListener('resize', calculateBackgroundWidth);
    calculateBackgroundWidth();
};

/*************************************************************/
/* Partial helpers */
/*************************************************************/
Template.PartialsPartupDetailNavigation.helpers({
    
    backgroundWidth: function () {
        return Session.get('partials.partup-detail-navigation.background-width') || 0;
    }
    
});


/*************************************************************/
/* Partial events */
/*************************************************************/
Template.PartialsPartupDetailNavigation.events({
    
    //
    
});