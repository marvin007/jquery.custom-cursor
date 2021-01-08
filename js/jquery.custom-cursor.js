/*

jquery.custom-cursor — jquery plugin
Version: 1.0.0
Author: Aleksey Pilipenko (marvin777xd@yandex.ru)

*/

;(function($) {
    'use strict';

    var defaults = {
        name: 'custom-cursor-default'
    };
    
    var CLASS_ACTIVE = 'custom-cursor--active';
    var CLASS_VISIBLE = 'custom-cursor--visible';

    function CustomCursor(element, options) {
        var widget = this;
        widget.config = $.extend(true, {}, defaults, options);
        widget.element = $(element);

        if ($('#' + widget.config.name).length) return;
        
        var cursorElement = $('<div class="custom-cursor '+ widget.config.name +'" id="'+ widget.config.name +'" />');
        cursorElement.appendTo($('body'));

        $.each(widget.config, function(key, value) {
            if (typeof value === 'function') {
                widget.element.on(key + '.customCursor', function(event, params) {
                    return value(event, widget.element, cursorElement, params);
                });
            }
        });

        widget.init(widget, cursorElement);
    };

    CustomCursor.prototype.init = function(widget, cursorElement) {
        var cursorElementHalfWidth = cursorElement.width() / 2;
        var cursorElementHalfHeight = cursorElement.height() / 2;

        widget.element.addClass('custom-cursor-container');

        function windowKeydownHandler(event) {
            if (event.keyCode == 13) {
                cursorElement.addClass(CLASS_ACTIVE);
            }
        }

        function windowKeyupHandler(event) {
            if (event.keyCode == 13) {
                cursorElement.removeClass(CLASS_ACTIVE);
            }
        }

        function mouseenterHandler() {
            cursorElement.addClass(CLASS_VISIBLE);

            $(window).on('keydown', windowKeydownHandler);
            $(window).on('keyup', windowKeyupHandler);
        }

        function mouseleaveHandler() {
            cursorElement.removeClass(CLASS_VISIBLE);

            $(window).off('keydown', windowKeydownHandler);
            $(window).off('keyup', windowKeyupHandler);
        }

        function mousemoveHandler(event) {
            cursorElement.css('transform', 'translate3d('+ (event.clientX - cursorElementHalfWidth) + 'px, '+ (event.clientY - cursorElementHalfHeight) +'px, 0)');
        }

        function mousedownHandler(event) {
            if (event.which == 1) {
                cursorElement.addClass(CLASS_ACTIVE);
            }
        }

        function mouseupHandler(event) {
            if (event.which == 1) {
                cursorElement.removeClass(CLASS_ACTIVE);
            }
        }

        this.element
        .on('mouseenter', mouseenterHandler)
        .on('mouseleave', mouseleaveHandler)
        .on('mousemove', mousemoveHandler)
        .on('mousedown', mousedownHandler)
        .on('mouseup', mouseupHandler);

        this.element.trigger('created.customCursor');
    };

    $.fn.customCursor = function(options) {
        return this.each(function() {
            new CustomCursor(this, options);
        });
    };
})(jQuery);
