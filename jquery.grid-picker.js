;(function ( $ ) {

    var pluginName = "gridPicker",
        defaults = {
            rows: 10,
            cols: 10,
            container: 'body'
        };

        // The actual plugin constructor
        function Plugin ( element, options ) {
                this.element = element;
                this.$el = $(element);
                this.settings = $.extend( {}, defaults, options );

                this.$container = $(this.settings.container);

                this._defaults = defaults;
                this._name = pluginName;
                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {

                init: function () {
                    this.$el.addClass('grid-picker');
                    this.createGrid();
                    // if the input is prepopulated then select the squares up front
                    this.previousValue = this.$el.val();

                    this.highlightSquares();
                    this.listen();
                },

                listen: function () {

                    this.$grid
                        .on('mouseenter', $.proxy(this.enter, this))
                        .on('mouseleave', $.proxy(this.leave, this))
                        .on('mouseover', '.square', $.proxy(this.hoverSquare, this));

                    this.$el
                        .on('focus', $.proxy(this.show, this))
                        .on('blur', $.proxy(this.blur, this));

                    this.$container.on('scroll resize', $.proxy(this.move, this));
                    this.proxiedMoveFn = $.proxy(this.move, this);
                    $(window).on('scroll resize', this.proxiedMoveFn);
                    this.$el.parent().on('scroll', this.proxiedMoveFn);
                    return this;
                },

                enter: function () {
                    this.mouseoverGrid = true;
                    return this;
                },

                leave: function () {
                    this.mouseoverGrid = false;
                    return this;
                },

                // if the mouse is over the picker when the input blurs then
                // select a square, otherwise revert the input to
                // previous value
                blur: function () {
                    this.mouseoverGrid ? this.set() : this.reset();
                    return this.hide();
                },

                show: function () {
                    this.move();
                    this.$grid.addClass('visible');
                    return this;
                },

                hide: function () {
                    this.$grid.removeClass('visible');
                    return this;
                },

                // reset to what the picker showed before, and don't trigger
                // a change
                reset: function () {
                    this.$el.val(this.previousValue);
                    return this;
                },

                set: function () {
                    var newVal = this.$el.val();
                    if (newVal === this.previousValue) return;
                    this.previousValue = newVal;
                    this.$el.trigger('change');
                    return this;
                },

                hoverSquare: function (e) {
                    var $this = $(e.currentTarget);
                    var col = $this.index() + 1;
                    var row = $this.parent().index() + 1;
                    this.highlightSquares({
                        col: col,
                        row: row
                    });
                    this.$el.val(col + ' x ' + row);
                    return this;
                },

                getSelected: function () {
                    var values = this.$el.val().split(' x ');
                    return {
                        col: values[0], // width
                        row: values[1]  // height
                    };
                },

                highlightSquares: function (values) {
                    if (!values) values = this.getSelected();
                    this.$allSquares.removeClass('highlight');
                    $('.grid-row:nth-child(-n+'+values.row+') .square:nth-child(-n+'+values.col+')')
                        .addClass('highlight');
                    return this;
                },

                createGrid: function () {
                    var grid = '<div class="grid">';
                    for (var i = 0; i < this.settings.rows; i++) {
                        grid += '<div class="grid-row">';
                        for (var c = 0; c < this.settings.cols; c++) {
                            grid += '<div class="square"><div class="inner"></div></div>';
                        }
                        grid += '</div>';
                    }
                    grid += '</div>';

                    this.$grid = $(grid)
                        .height((this.settings.rows * 24) / 2)
                        .width((this.settings.cols * 24) / 2);


                    this.$grid.appendTo(this.$container);

                    this.$grid.find('.grid-row').css({
                        height: 'calc(100%/'+this.settings.rows+')'
                    });
                    this.$grid.find('.square').css({
                        width: 'calc(100%/'+this.settings.cols+')'
                    });
                    this.$allSquares = this.$grid.find('.square');
                    return this;

                },

                move: function () {
                    var top, left;
                    if (this.settings.container === 'body') {
                        top = this.$el.offset().top + this.$el.height();
                        left = this.$el.offset().left;
                    }
                    else {
                        top = this.$el.position().top + this.$el.height();
                        left = this.$el.position().left;
                    }
                    this.$grid.css({
                        top: top + 15,
                        left: left + 1
                    });
                    return this;
                },

                destroy : function(){
                    this.$grid
                        .off('mouseenter')
                        .off('mouseleave')
                        .off('mouseover');

                    this.$el
                        .off('focus')
                        .off('blur');

                    this.$container.off('scroll resize');
                    $(window).off('scroll resize', this.proxiedMoveFn);
                    this.$el.parent().off('scroll', this.proxiedMoveFn);

                    this.$grid.remove();
                }
        });

        $.fn[ pluginName ] = function ( options ) {
                this.each(function() {
                        if ( !$.data( this, pluginName ) ) {
                                $.data( this, pluginName, new Plugin( this, options ) );
                        }
                });

                return this;
        };

})( jQuery );