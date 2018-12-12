/////states pagevar HTML = [],
var STATES = [];
var current, jsonData;


jQuery(function(){
    loadAjax('340bstates.json');
});

function loadAjax(file){
    current = file;
    jQuery.ajax({
        url: "https://life-sciences.herokuapp.com/uploads/json/"+file,
		type: 'GET',
		dataType: "json",
		data: [],
		success: showData
	});	
}


function showData(data, status, xhr) {
	if(data.length){
	    switch(current){
	        case '340bstates.json':
			STATES.length = 0;
			STATES.push('<option value="">Select State</option>');
			for (var i = 0; i < data.length; i++) {
				createStates(data[i]);		
			}
			jQuery('#states').html(STATES);
			loadAjax('sectiondata.json');
        	break;
            case 'sectiondata.json':
			//console.log(data);
			jsonData = data;
            break;
		}
	}
}


function createStates(arr) {
    var html='';
    if(arr.available == "1"){
     html = '<option value="'+arr.name+'">'+arr.name+'</option>';
   }else{
    html = '<option value="'+arr.name+'" disabled style="color: red">'+arr.name+'</option>';
   }
    STATES.push(html); 
}



function checkJson(abb){
	
    var thisData='';
    jQuery.each( jsonData, function( key, value ) {
        if(value.state===abb){
			// console.log(value);
            thisData = value;
		}   
	});
	
    jQuery('#state_data').html('');
    if(!thisData){
        return;
	}
    createData(thisData);
    $("#state_data").show();
	$('.jsmaps-wrapper-box').hide();
    jQuery(".chart_outrss").hide();
     $("html, body").animate({ scrollTop: 0 }, "slow");
     $(".state-content").hide();
    jQuery("#states option").each(function( index ) {
        var chk = jQuery(this).val();
        if(chk==abb){
            jQuery(this).attr('selected', 'selected');
		}
	});
    
}





function createData(arr) {
	console.log(arr);
    var html='';
    var todayDate = new Date().toISOString().slice(0,10);
    var ab = new Array();
    var abcolor = "";
    var source = new Array();
    var source_arr = new Array();
    var source_link_arr = new Array();
    var source_link = new Array();
    var i=0;
    html +='\
    <style> .col-md-3 { float: left;} .col-md-9 { float: left; }'+arr.theme_style+'</style>\
    <div class="chart_outr content_outr">\
	<div class="state_headings" >\
	<h3 >'+arr.state+'</h3>\
	<h5>'+arr.title+'</h5>\
	<h6>'+todayDate+'</h6>\
	</div><div class="box1">\
	<div class="col-md-9">\
	<div class="ques_ans">\
	';
	var source_arr = [];
	var source_link_arr = [];
	var $si = 1;
	
	jQuery.each( arr.sectiondatas, function( key, value ) {
		ab[key] = value.title;
		
        html +=' <div class="inner_data">\
        \<h5 id="section'+key+'" >'+value.title+'</h5>\
        ';
		
		
		html+= '\<h6 id="subsectionR'+key+'">Reimbursement Requirements</h6>';
		
		html +='</div><div class="table-responsive">\
		<table> <tr class="mobile_hide"><th ></th> <th >Ingredient Cost </th> <th >Dispensing Fee</th> <th >Clarifying Details</th></tr>';
		jQuery.each( value.table_one, function( key1,value1){
			
		//	var string =value1.ingredient_cost;
         //   var new_string = string.replace('&#8226;','<br/>&#8226;');

			html +='<tr>\
			<td>'+value1.question_title +'</td>\
			<td class="desktop_hide">Ingredient Cost</td>';
			if(value1.ingredient_cost != null){
		    html +='<td>'+value1.ingredient_cost;+'</td>';
			}else{
			    html += '<td></td>';
			}
			
			html +='<td class="desktop_hide">Dispensing Fee</td>';
			if(value1.dispensing_fee != null){
			html += '<td>'+value1.dispensing_fee+'</td>';
			}else{
			    html += '<td></td>';
			}
			html += '<td class="desktop_hide">Clarifying Details</td>';
			if(value1.clarifying_detail != null){
		    html +=	'<td>'+value1.clarifying_detail+'\
			';
			if(value1.source != '<p>No requirements located.</p>' && value1.source != null &&  value1.source !='' && value1.source !="<p>Unable to locate.</p>"
){
				if ($.inArray(value1.source, source_arr) === -1){
					source_arr.push(value1.source);
					source_link_arr.push(value1.source_link);
					html += ' <a  class="state_check" href="#source'+$si+'">['+$si+']</a>';
					$si++;
					//console.log(value1.source);
				}else{
					var vi = 1;
				jQuery.each( source_arr, function( key,value){	
					if(value==value1.source){
						html += ' <a  class="state_check" href="#source'+vi+'">['+vi+']</a>';
						}
						vi++;
					});						
				} 
			}
			html +='</td>';
			}else{
			    html +='<td></td></tr>';
			}
			source[i]=value1.source;
			source_link[i]=value1.source_link;
			i++;
			
			//console.log(source_arr);
		});
		html +='</table></div>\
		';
		if(value.table_two.length > 0){
			html +=' <div class="inner_data">\
			';
			html+= '\<h6 id="subsectionD'+key+'" >Duplicate Discount Mechanism</h6>';
			html +='</div><div class="table-responsive">\
			<table> <tr><th ></th> <th class="mobile_hide">Answer </th> </tr>';
			
			jQuery.each( value.table_two, function( key2,value2){
				
				source[i]=value2.source;
				source_link[i]=value2.source_link;
				html +='<tr>\
				<td>'+value2.question_title +'</td>\
				<td class="desktop-hide">Answer</td>\
				<td>'+value2.clarifying_detail+'\
				';
				if(value2.source != '<p>No requirements located</p>' && value2.source != null  && value2.source !='' && value2.source !="<p>Unable to locate.</p>"){
				if ($.inArray(value2.source, source_arr) === -1){
					source_arr.push(value2.source);
					source_link_arr.push(value2.source_link);
					html += ' <a  class="state_check" href="#source'+$si+'">['+$si+']</a>';
					$si++;
				}else{
				var vi = 1;
				jQuery.each( source_arr, function( key,value){	
					if(value==value2.source){
						html += ' <a  class="state_check" href="#source'+vi+'">['+vi+']</a>';
						}
						vi++;
					});					
				}  
			}
				html +='</td></tr>';
				i++;
			});
			html +='</table></div>\
			';
		}
	});
	// console.log(ab);
	function unique(list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
	}
	
//	console.log(source);
	//console.log(source_link);
	source = unique(source);
	//source_link = unique(source_link);
	//console.log(source);
	//console.log(source_link);
	html +='</div></div><div class="col-md-3 hidden-sm hidden-xs">';
	
	html += '<div class="sidenav-wrapper"><ul class="my-navbar">';
	jQuery.each( ab, function( key,value){
		html += '<li class="nav-item" >\
		<a class=" current-tab" href="#section'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">'+value+'</a>\
		</li>';
			html += '<li class="nav-item my-class" >\
	  	  <a class=" current-tab" href="#subsectionR'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">Reimbursement Requirements</a>\
		</li>';
		html += '<li class="nav-item my-class" >\
	  	  <a class=" current-tab" href="#subsectionD'+key+'" data-scroll="section" style="color:'+arr.primarycolor+';hover:'+arr.secondrycolor+'">Duplicate Discount Mechanism</a>\
		</li>';
	});
	
	html +='</ul></div></div></div>\
	</div></div>' ;
	
	html += '<section id="section" class="sources" data-anchor="section8">\
	<div class="section-title">\
	<h3 >Sources</h3>\
	</div>\
	<ol>'; 
	var $s = 1;
	jQuery.each( source_arr, function( key,value){					
					html += '<li id="source'+$s+'" data-tab="source'+$s+'" class=""><a href="'+source_link_arr[key]+'" target="_blank">'+$s+". "+value+'</a></li>';
				$s++;		
	});
	
	html +='</ol>\
	</section>\
	';
	
    
    jQuery('#state_data').html(html);
}

$(document).scroll(function() {
    var y = $(document).scrollTop(), //get page y value 
	header = $(".sidenav-wrapper"); // your div id
    if(y >= 400)  {
        header.css({position: "fixed", "top" : "0", "width": "286px"});
		} else {
        header.css("position", "static");
	}
});






