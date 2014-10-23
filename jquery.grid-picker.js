;(function ( $ ) {

    var pluginName = "gridPicker",
        defaults = {
            rows: 5,
            cols: 5
        };

        // The actual plugin constructor
        function Plugin ( element, options ) {
                this.element = element;
                this.$el = $(element);
                this.settings = $.extend( {}, defaults, options );
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
                    this.$grid.on('mouseover', '.square', $.proxy(this.hoverSquare, this));
                    this.$el.on('blur', $.proxy(this.set, this));
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
                        .height(this.settings.rows * 24)
                        .width(this.settings.cols * 24)
                        .insertAfter(this.$el);

                    this.$grid.find('.grid-row').css({
                        height: 'calc(100%/'+this.settings.rows+')'
                    });
                    this.$grid.find('.square').css({
                        width: 'calc(100%/'+this.settings.cols+')'
                    });
                    this.$allSquares = this.$grid.find('.square');
                    return this;
                }


        });

        $.fn[ pluginName ] = function ( options ) {
                this.each(function() {
                        if ( !$.data( this, "plugin_" + pluginName ) ) {
                                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                        }
                });

                return this;
        };

})( jQuery );