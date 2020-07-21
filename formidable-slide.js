(function(){
	var track = document.querySelector('#frm-form-slider .frm_fields_container')
		, activeAttribute = 'data-slideform'
		, activeSlide
		, firstSlide = 1
		, reqFields, invalidCount, form = document.querySelector('#frm-form-slider form')// for validation
		, invClass = 'frm-slide-invalid'
		, slides = track.querySelectorAll('.frm_fields_container > .frm_form_field')
		;
	
	slides[slides.length-1].setAttribute('data-slideformlast','');
	
	// jQuery(track).find('.frm_required_field input, .frm_required_field select, .frm_required_field textarea').attr('required',true);
	
	function delayedNextOnClick(e){
		// schedule page turn if click was on a radio button and click actually had mouse coordinates (seems someting was triggering clicks when just using arros to select a different field...
		e.target.type == "radio" && e.clientX > 0 && setTimeout( nextOnClick, 365, this, e );
	}
	
	function alignSlide(){
		track.style.transition='none';
		track.style.transform = 'translateX(-'+ track.querySelector('['+ activeAttribute +']').offsetLeft +'px)';
	}
	
	function nextOnClick(t,e){
		// console.log("next");
		// console.log(e);
		var reasonsWeCantGoNext = 0;
		// when a radio field is changed, we can auto-advance for them.
		
		if ( !~t.className.indexOf('_radio') ){
			// if the slide isn't a radio container, it could still be a section that contains a radio + hidden conditional fields.
			jQuery(t).find('.frm_form_field').each(function(i,v){
				// if this is the first field but NOT a radio... or is NOT the first field and is visible.. than we can't go next.
				if ( ( i == 0 && !~v.className.indexOf('_radio') ) || ( i != 0 && v.clientWidth ) )
					++reasonsWeCantGoNext;
			});
		}
		reasonsWeCantGoNext || next();
	}
	function next(prev) {
		prev == 1 || (prev = 0);
		track.style.transition='';

		activeSlide = track.querySelector('['+ activeAttribute +']') || track.firstElementChild;

		// validation
		// only validate if moving forward
		if ( ! prev ) {
		
			// reqFields = !~activeSlide.className.indexOf('frm_form_field') ? activeSlide.querySelectorAll('.frm_form_field') : activeSlide;
			jQuery(track).find('.frm_required_field input, .frm_required_field select, .frm_required_field textarea').attr('required',true);
			// console.log("assign required attr on first next click since it stopped working above");
			
			invalidCount = 0;
			
			// jQuery(reqFields).each( function(){
				jQuery(activeSlide).find('input,select,textarea').each( function(){
					if ( this.clientWidth && ! this.checkValidity() ){
// console.log(this);
						
						// focus the first invalid field so they can fix it (count will be false if it hasn't been incremented yet)
						invalidCount || this.focus();
						++invalidCount;
						// console.log('invalid: ' + this.id );
						
						var f = jQuery(this).closest('.frm_form_field');
						if ( ! f.hasClass(invClass) ) {
							f.addClass(invClass);
							var invmsg = this.getAttribute('data-reqmsg');
							if ( ! invmsg ) invmsg = "This field cannot be blank";
							f.prepend('<span class='+invClass+'-msg>' + invmsg + '</span>' );
						}
						f.on('input change', function(){
							this.classList.remove(invClass);
						});
		
						// return false;
					}
				})
			// });
			
			if ( invalidCount ) return;
			
			// submit if last slide
			if ( activeSlide.hasAttribute('data-slideformlast') ) {
				track.querySelector('.frm_final_submit').click();
				return;
			}
		
		}
		
		
		jQuery(activeSlide).find('input, textarea, select').each(function(){this.tabIndex='-1'});
		activeSlide.removeAttribute(activeAttribute);
		activeSlide.removeEventListener('click', delayedNextOnClick);
		do {
			activeSlide = prev ? activeSlide.previousElementSibling : activeSlide.nextElementSibling || track.firstElementChild;
		}
		while ( !activeSlide.clientWidth || !~activeSlide.className.indexOf('frm_form_field') );// && !~activeSlide.className.indexOf('frm_submit')
		
		// disable back button on first slide
		// mark first field
		if ( firstSlide ) {
			firstSlide = 0;
			activeSlide.setAttribute('data-slideformfirst','');
			
			window.addEventListener('resize', alignSlide);

		}
		document.getElementById('frm-form-slider-prev').disabled = activeSlide.hasAttribute('data-slideformfirst') ? true : false;
		// document.getElementById('frm-form-slider-next').disabled = activeSlide.hasAttribute('data-slideformlast') ? true : false;
		
		if ( activeSlide.hasAttribute('data-slideformlast') ) {
			document.getElementById('frm-form-slider-next').innerText = "Submit";
		} else {
			document.getElementById('frm-form-slider-next').innerText = "Next";
			activeSlide.addEventListener('click', delayedNextOnClick);
			
			//focus on field in new slide
			setTimeout( focusNewSlide, 500 );
			function focusNewSlide(){
				activeSlide.querySelector('input,textarea,select').focus();
			}
		
		}
		
		// if ( activeSlide.hasAttribute('data-slideform-last') ) {
			// document.getElementById('frm-form-slider-next').style.display = 'none';
			// document.getElementById('frm-form-slider-submit').style.display = 'inline-block';
		// } else {
			// document.getElementById('frm-form-slider-next').style.display = '';
			// document.getElementById('frm-form-slider-submit').style.display = 'none';
		// }



		track.style.transform = 'translateX(-'+ activeSlide.offsetLeft +'px)';
		activeSlide.setAttribute(activeAttribute,'');
		// activeSlide.addEventListener('change', delayedNextOnClick);
		jQuery(activeSlide).find('input, textarea, select').each(function(){this.tabIndex=''});

	}
	
	jQuery(track).find('input, textarea, select').each(function(){this.tabIndex='-1'});
	
	function disableTab(e){
		if ( e.keyCode === 9 ) {
			if ( null === document.querySelector('[data-slideform] .frm_form_field') )
				next();
		}
	}
	window.addEventListener('keyup', disableTab );

	
	document.getElementById('frm-form-slider-prev').addEventListener('click',function(){next(1)});
	document.getElementById('frm-form-slider-next').addEventListener('click',next);
	document.getElementById('formidable-css').addEventListener('load', alignSlide );
	document.addEventListener('load', alignSlide );
	next();
	
	// styling stuff
	jQuery('.vertical_radio, .horizontal_radio').change(function(e){
		jQuery(this).find('label').removeClass('radio-selected');
		if ( e.target.checked ) {
			e.target.parentElement.classList.add('radio-selected');
		}
	});
	
	
	
	// test error stuff
	// function frmThemeOverride_frmPlaceError( key, jsErrors ) {
		// console.log( key );
		// console.log( jsErrors );
	// }
	// function frmThemeOverride_jsErrors( action, object ) {
		// console.log( action );
		// console.log( object );
	// }
	
})();