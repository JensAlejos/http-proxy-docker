//- 
(function( $ ) {
	$.widget( "ui.editableDropdown", {
		options: {
			mustMatch: true,
			change: null
		},

		_create: function() {
			var input, button, self = this,
				select = this.element.hide(),
				selected = select.children( ":selected" ),
				value = selected.val() ? selected.text() : "",
				wrapper = $( "<span>" )
					.addClass( "ui-editableDropdown" )
					.insertAfter( select );

			input = this.input = $( "<input>" )
				.appendTo( wrapper )
				.val( value )
				.addClass( "ui-state-default" )
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: function( request, response ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( select.children( "option" ).map(function() {
							var text = $( this ).text();
							if ( this.value && ( !request.term || matcher.test(text) ) )
								return {
									label: text.replace(
										new RegExp(
											"(?![^&;]+;)(?!<[^<>]*)(" +
											$.ui.autocomplete.escapeRegex(request.term) +
											")(?![^<>]*>)(?![^&;]+;)", "gi"
										), "<strong>$1</strong>" ),
									value: text,
									option: this
								};
						}) );
					},
					select: function( event, ui ) {
						ui.item.option.selected = true;
						self._trigger( "selected", event, {
							item: ui.item.option
						});
					},
					change: function( event, ui ) {
						if ( !ui.item ) {
							var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
								valid = false;
							select.children( "option" ).each(function() {
								if ( $( this ).text().match( matcher ) ) {
									this.selected = valid = true;
									return false;
								}
							});
							if ( !valid ) {
								if ( self.options.mustMatch ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									
									if ($.isFunction(self.options.change)) {
										self.options.change(event, ui);
									}
									return false;
								} else {
									// add entered text as option
									var value = $(this).val();
									self.addOption({text: value, value: value});
									self.sortOptions();
									
									if ($.isFunction(self.options.change)) {
										self.options.change(event, ui);
									}
								}
							}
						} else {
							if ($.isFunction(self.options.change)) {
								self.options.change(event, ui);
							}
						}
					}
				})
				.addClass( "ui-widget ui-widget-content ui-corner-left" );

			input.data( "autocomplete" )._renderItem = function( ul, item ) {
				return $( "<li></li>" )
					.data( "item.autocomplete", item )
					.append( "<a>" + item.label + "</a>" )
					.appendTo( ul );
			};

			button = this.button = $( "<a>" )
				.attr( "tabIndex", -1 )
				.attr( "title", "Show All Items" )
				.appendTo( wrapper )
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})
				.removeClass( "ui-corner-all" )
				.addClass( "ui-corner-right ui-button-icon" )
				/*
					.ui-button {
						position: absolute;
						top: 0;
						bottom: 0;
						margin-left: -1px;
						padding: 0;
				
						// adjust styles for IE 6/7
						*height: 1.7em;
						*top: 0.1em;
					} 
				*/
				.css({
					'position': 'absolute',
					'top': 0,
					'bottom': 0,
					'margin-left': '-1px',
					'padding': 0
				})
				.click(function() {
					// close if already visible
					if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
						input.autocomplete( "close" );
						return;
					}

					// work around a bug (likely same cause as #5265)
					$( this ).blur();

					// pass empty string as value to search for, displaying all results
					input.autocomplete( "search", "" );
					input.focus();
				});
		},

		_setOption: function( key, value ) {
			this.options[ key ] = value;
			
			if ( key === "disabled" ) {
				this.widget()
					.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
					.attr( "aria-disabled", value );
				//- this.hoverable.removeClass( "ui-state-hover" );
				//- this.focusable.removeClass( "ui-state-focus" );
				
				if (value) {
					this.input.autocomplete('disable');
					this.input.attr('disabled', '');
				
					this.button.button('disable');
				} else {
					this.input.autocomplete('enable');
					this.input.removeAttr('disabled');
				
					this.button.button('enable');
				}
			}
			
			$.Widget.prototype._setOption.apply( this, arguments );
			
			return this;
		},
    
		_getDropdownOptions: function() {
			var select = this.element;

			if (select.prop) {
				return select.prop('options');
			} else {
				return select.attr('options');
			}
		},

		addOption: function(option) {
			var select = this.element;
			var options = this._getDropdownOptions();

			//- new Option(text, value, defaultSelected, selected)
			options[options.length] = new Option(option.text, option.value, true, true);
		},

		removeOption: function(option) {
			var options = this._getDropdownOptions();

			for (var i=0; i<options.length; i++) {
				if ( options[i].value == option.value ) {
					options[i] = null;
				}
			}
		},

		sortOptions: function() {
			var select = this.element;
			var options = this._getDropdownOptions();

			var soptions = $(options).sort(function(a, b) {
				return a.text == b.text? 0: a.text < b.text? -1: 1;
			});
			select.html(soptions);
		},

		selectOption: function(option) {
			var options = this._getDropdownOptions();
			var matched = false;
			
			for (var i=0; i<options.length; i++) {
				if ( options[i].value == option.value ) {
					this.element.val(option.value);
					this.input.val(option.text);
					matched = true;
					break;
				}
			}
			
			if (!matched) {
				this.element.val("");
				this.input.val("");
			}
		},

		destroy: function() {
			this.wrapper.remove();
			this.element.show();

			$.Widget.prototype.destroy.call( this );
		}
	});
})( jQuery );

