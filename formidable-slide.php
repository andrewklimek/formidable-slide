<?php
/*
Plugin Name: Formidable Slide Forms
Description: adds slide action to a Formidable form.  Shortcode [frmslide]
Version:     0.1
Plugin URI:  
Author:      Andrew J Klimek
Author URI:  https://github.com/andrewklimek
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/


add_action('wp_enqueue_scripts', 'frmslide_register_assets');
function frmslide_register_assets() { 
    wp_register_script( 'frmslide', plugin_dir_url( __FILE__ ) .'formidable-slide.js', array ('jquery'), filemtime( __DIR__ . '/formidable-slide.js'), true );      
}

function frmslide_add_buttons_move_submit( $f ) {
	$f = str_replace( '</fieldset></div>', '', $f );
	$f = str_replace( '<div class="frm_submit">', '</div></fieldset></div><div class="frm-form-slider-buttons frm_submit"><input type=button id=frm-form-slider-prev class=frm_form_submit_style value=Back> <input type=button id=frm-form-slider-next class=frm_form_submit_style value=Next> <div id=frm-form-slider-submit style="display:none">', $f );
	return $f;
}


function frmslide_shortcode($a,$c=''){
	
	if ( strpos( $c, '[formidable') )
		return "<p>Wrap this shortcode around a formidable form shortcode, like: [frmslide][formidable id=x][frmslide]";
	
	wp_enqueue_script('frmslide');
	
	ob_start();
	
	?>
	<div id=frm-form-slider>
	<style>
	#frm-form-slider fieldset {
	    overflow-x: hidden;
	}
	#frm-form-slider .frm_fields_container {
	    display: flex;
	    position: relative;
	    transition: transform 0.4s;
	}
	#frm-form-slider .frm_fields_container > .frm_form_field {
	    flex: 0 0 auto;
	    width: 100% !important;
	    padding: 0 1em;
	}
	
	/* cool styling */
	#frm-form-slider .frm_radio label.radio-selected {
	    border: 2px solid #fe5341;
	    /* font-weight: 700; */
	}

	#frm-form-slider .frm_radio > label {
	    min-width: 10em;
	    border: 1px solid currentColor;
	    padding: 1ex;
	    margin: 1ex 0;
	    display: inline-block;
	    border-radius: .3em;
	    text-indent: 0;
		cursor: pointer;
	}
	#frm-form-slider .frm_radio > label:hover {
	    transform: translate(1px,1px);
	}
	#frm-form-slider .frm_radio > label:active {
	    transform: translate(2px,2px);
	}
	#frm-form-slider .frm_radio input {
		/*display: none;*/
		clip: rect(1px,1px,1px,1px);
		position: absolute
	}
	
	.frm-slide-invalid-msg {
		display: none;
		color: #f55;
		font-weight: 700;
	}
	.frm-slide-invalid > .frm-slide-invalid-msg {
		display: block;
	}
	.frm-slide-invalid {
		border-left: #f55 3px solid;
	}
	#frm-form-slider-prev:disabled {
		/*opacity: .4;*/
		visibility: hidden;
	}
	#frm-form-slider .frm_submit {
		display: none;
	}
	/* this is a temp fix, dunno why we see hidden stuff flash breifly */
	.frm_hidden {
    /* display: none; */
	}
	.frm_form_fields {
		opacity: 0;
	}
	</style>
	<?php
	
	// add_filter( 'frm_filter_final_form', 'frmslide_add_buttons_move_submit' );

	// process formidable shortcode to print form
	echo do_shortcode($c);
	
	// remove_filter( 'frm_filter_final_form', 'frmslide_add_buttons_move_submit' );


	
	?>
	<div class=frm-form-slider-buttons><button id=frm-form-slider-prev disabled>Back</button> <button id=frm-form-slider-next>Next</button></div>
	
	</div>
	<?php
	
	/*** JS before minification
	
	***/

	
	$return = ob_get_clean();
		
	return $return;
	
}
add_shortcode( 'frmslide', 'frmslide_shortcode');