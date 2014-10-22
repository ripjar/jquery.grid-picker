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
                    this.$el.addClass('grid-picker')
                    this.createGrid();
                    this.listen();
                },

                listen: function () {
                    $grid.on('mouseover', '.square', $.proxy(this.selectSquares));
                    return this;
                },

                selectSquares: function () {
                    var col = this.$el.index() + 1;
                    var row = this.$el.parent().index() + 1;
                    $allSquares.removeClass('highlight');
                    $('.row:nth-child(-n+'+row+') .square:nth-child(-n+'+col+')')
                        .addClass('highlight');
                     this.$el.val(col + ' x ' + row)
                })

                createGrid: function () {
                    var grid = '<div class="grid">';
                    for (var i = 0; i < this.settings.rows; i++) {
                        grid += '<div class="row">';
                        for (var c = 0; c < this.settings.cols; c++) {
                            grid += '<div class="square"><div class="inner"></div></div>';
                        }
                        grid += '</div>';
                    }
                    grid += '</div>';

                    this.$grid = $(grid)
                        .insertAfter(this.$el);
                    this.$allSquares = $grid.find('.square');
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





