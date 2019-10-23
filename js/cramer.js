var dims;
function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp  = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}


	$(function(){
	    var $select = $("#dimensions");
	    for (i=2;i<=20;i++){
	        $select.append($('<option></option>').val(i).html(i))
	    }
	});

	function generate_table(n) {
  // get the reference for the body
	  var body = document.getElementById("matrix");
	 
	  // creates a <table> element and a <tbody> element
	  var tbl     = document.createElement("table");
	  tbl.style.textAlign = "center";
	  
	 var tblHead = document.createElement("thead");

	 var row = document.createElement("tr");
	 for (var i = 0; i < n+1; i++){
	    var cell = document.createElement("td");
	    console.log(i);
	    if (i < n){
	    	cell.innerHTML = "X<sub>"+(i+1) + "</sub>";
	    }else{
	    	cell.innerHTML = "b";
	    }
	    row.appendChild(cell);
	}
	tblHead.appendChild(row);
	tbl.appendChild(tblHead);
	var tblBody = document.createElement("tbody");


	  // creating all cells
	  for (var i = 0; i < n; i++) {
	    // creates a table row
	    var row = document.createElement("tr");
	 
	    for (var j = 0; j < n+1; j++) {
	      // Create a <td> element and a text node, make the text
	      // node the contents of the <td>, and put the <td> at
	      // the end of the table row
	      var cell = document.createElement("td");
	      cell.innerHTML = "<input type=\"text\" id=\"elmnt_"+i+"_" + j+ "\" class=\"num\">";
	      // var cellText = document.createTextNode("<input type=\"text\" name=\"elmnt_"+i+"_" + j+ "\" id=\"num\">");
	      // cell.appendChild(cellText);
	      row.appendChild(cell);
	    }
	 
	    // add the row to the end of the table body
	    tblBody.appendChild(row);
	  }
	 
	  // put the <tbody> in the <table>
	  tbl.appendChild(tblBody);
	  // appends <table> into <body>
	  body.appendChild(tbl);
	  // sets the border attribute of tbl to 2;
	  tbl.setAttribute("border", "2");
	}


	$(function () {
	  $('#setmatrix').on('click', function () {
	  	$('#matrix_div').show();
	  	$('#matrix').html("");
	  	dims = parseInt($('#dimensions').val());
	  	generate_table(dims);
	  });
	});

	$(function () {
	  $('#zeroes').on('click', function () {
	    for (i=0;i<dims;i++){
	    	for(j=0;j<dims+1;j++){
	    		field = $('#elmnt_' + i + '_' + j);
	    		if(field.val()==""){
	    			field.val("0");
	    		}
	    	}
	    }
	  });
	});


	$(function () {
	  $('#reset').on('click', function () {
	    for (i=0;i<dims;i++){
	    	for(j=0;j<dims+1;j++){
	    		field = $('#elmnt_' + i + '_' + j);
	    		field.val("");
	    	}
	    }
	  });
	});

	$(function () {
	  $('#solve').on('click', function () {
	    table_text = "<table class=\"matrix\">";
	    main_matrix = [];
	    for(i=0; i<dims; i++){
	    	field = $('#elmnt_'+i+'_'+dims);
	    	if(isNaN(field.val()) || field.val()==""){
	    		alert("Please enter valid input.");
	    		return;
	    	}
	    }
	    for (i=0;i<dims;i++){
	    	main_matrix.push([]);
	    	table_text+="<tr>";
	    	for(j=0;j<dims;j++){
	    		field = $('#elmnt_' + i + '_' + j);
	    		if(isNaN(field.val()) || field.val()==""){
	    			alert("Please enter valid input.");
	    			return;
	    		}
	    		table_text+="<td>" + field.val() + "</td>";
	    		main_matrix[i].push(parseFloat(field.val()));
	    	}
	    	table_text+="</tr>";
	    }
	    table_text +="</table> <br>";
	    main_det = numeric.det(main_matrix);
	    $('#result_div').html("");
	    if(main_det==0){
	    	$("#solutions").html("The determinant of the main matrix is 0. <br>This means the system of linear equations is either inconsistent or has infinitely many solutions.<br><br>");
	    	return;
	    }
	    $("#solutions").html("Step 1: Write down the main matrix and find its determinant<br><br>");
	    $('#solutions').append(table_text);
	    $('#solutions').append("D = " + round(main_det,2));
	    

	    $('#solutions').append("<br><br><hr><br>");
	    final_text = "";
	    for(k=0; k<dims; k++){
	    	table_text = "<table class=\"matrix\">";
		    new_matrix = [];
		    for (i=0;i<dims;i++){
		    	new_matrix.push([]);
		    	table_text+="<tr>";
		    	for(j=0;j<dims;j++){
		    		if(j != k){
			    		field = $('#elmnt_' + i + '_' + j);
			    		table_text+="<td>" + field.val() + "</td>";
			    		new_matrix[i].push(parseFloat(field.val()));
			    	}else{
			    		field = $('#elmnt_' + i + '_' + dims);
			    		table_text+="<td id='imp'><u>" + field.val() + "</u></td>";
			    		new_matrix[i].push(parseFloat(field.val()));
			    	}
		    	}
		    	table_text+="</tr>";
		    }
		    table_text +="</table> <br>";
		    window["det_"+k] = numeric.det(new_matrix);
		    $("#solutions").append("Step "+(k+2)+": Replace column " + (k+1) + " of the main matrix with the b vector and find its determinant<br><br>");
		    $('#solutions').append(table_text);
		    $('#solutions').append("D<sub>"+(k+1)+" </sub> = " + round(window["det_"+k],2));
		    

		    $('#solutions').append("<br><br><hr><br>");
		    final_text += "x<sub>"+(k+1)+"</sub> &nbsp;&nbsp;=&nbsp;&nbsp; <sup>D<sub>"+(k+1)+"</sub> </sup>&frasl; <sub>D</sub>&nbsp;&nbsp; =&nbsp;&nbsp; <sup>" + round(window["det_"+k],2) + "</sup> &frasl; <sub>" + round(main_det,2) + "</sub> &nbsp;&nbsp;=&nbsp;&nbsp; ";
		    res = round((window["det_"+k]/main_det),6);
		    final_text += res + "<br><br>";
	    	
	    }
	    $('#result_div').html(final_text+"<br><br>");

	  });
	});