var deviceInfo = function() {
    document.getElementById("platform").innerHTML = device.platform;
    document.getElementById("version").innerHTML = device.version;
    document.getElementById("uuid").innerHTML = device.uuid;
    document.getElementById("name").innerHTML = device.name;
    document.getElementById("width").innerHTML = screen.width;
    document.getElementById("height").innerHTML = screen.height;
    document.getElementById("colorDepth").innerHTML = screen.colorDepth;
};

var locationWatch = false;

var toggleLocation = function() {
    var suc = function(p) {
        jQuery("#loctext").empty();
                
        var text = "<div class=\"locdata\">Latitude: " + p.coords.latitude
        + "<br/>" + "Longitude: " + p.coords.longitude + "<br/>"
        + "Accuracy: " + p.coords.accuracy + "m<br/>" + "</div>";
        jQuery("#locdata").append(text);

        var image_url = "http://maps.google.com/maps/api/staticmap?sensor=false&center="
        + p.coords.latitude
        + ","
        + p.coords.longitude
        + "&zoom=13&size=280x175&markers=color:blue|"
        + p.coords.latitude + ',' + p.coords.longitude;

        jQuery("#map").remove();
        jQuery("#loccontainer").append(
            jQuery(document.createElement("img")).attr("src", image_url)
            .attr('id', 'map'));
    };
    var fail = function(error) {
        jQuery("#loctext").empty();
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User did not share geolocation data.");
                break;

            case error.POSITION_UNAVAILABLE:
                alert("Could not detect current position.");
                break;

            case error.TIMEOUT:
                alert("Retrieving position timed out.");
                break;

            default:
                alert("Unknown error.");
                break;
        }
    };

    if (locationWatch) {
        locationWatch = false;
        jQuery("#loctext").empty();
        jQuery("#locdata").empty();
        jQuery("#map").remove();
    } else {
        if (navigator.geolocation) {
            jQuery("#loctext").append("Getting geolocation . . .");
            navigator.geolocation.getCurrentPosition(suc, fail);
        } else {
            jQuery("#loctext").empty();
            jQuery("#loctext").append("Unable to get location.");
            alert("Device or browser can not get location.");
        }
        locationWatch = true;
    }
};

var beep = function() {
    navigator.notification.beep(2);
};

var vibrate = function() {
    navigator.notification.vibrate(0);
};

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

var accelerationWatch = null;

function updateAcceleration(a) {
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
}

function toggleAccel() {
    if (accelerationWatch !== null) {
        navigator.accelerometer.clearWatch(accelerationWatch);
        updateAcceleration({
            x : "",
            y : "",
            z : ""
        });
        accelerationWatch = null;
    } else {
        var options = {};
        options.frequency = 1000;
        accelerationWatch = navigator.accelerometer.watchAcceleration(
            updateAcceleration, function(ex) {
                alert("accel fail (" + ex.name + ": " + ex.message + ")");
            }, options);
    }
}

var preventBehavior = function(e) {
    e.preventDefault();
};

function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    //console.log(data);
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.bottom = "160px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = "data:image/jpeg;base64," + data;
}

function fail(msg) {
    alert(msg);
}

function show_pic() {
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 30
    });
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

// This is just to do this.
function readFile() {
    navigator.file.read('/sdcard/phonegap.txt', fail, fail);
}

function writeFile() {
    navigator.file.write('foo.txt', "This is a test of writing to a file",
        fail, fail);
}

function contacts_success(contacts) {
    alert(contacts.length
        + ' contacts returned.'
        + (contacts[2] && contacts[2].name &&
            contacts[2].name.formatted ? (' Third contact is ' + contacts[2].name.formatted)
            : ''));
}

function get_contacts() {
    var obj = new ContactFindOptions();
    obj.filter = "";
    obj.multiple = true;
    navigator.contacts.find(
        [ "displayName", "name" ], contacts_success,
        fail, obj);
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
    //--document.addEventListener("deviceready", pagina(1), true);
   //--str_url="http://twitter.com/status/user_timeline/padraicb.json?count=10";
//--    document.addEventListener("deviceready", recarga(), true);

    $("#accelmenu").live('expand', function() {
        toggleAccel();
    }).live('collapse', function() {
        toggleAccel();
    });

    $("#locationmenu").live('expand', function() {
        toggleLocation();
    }).live('collapse', function() {
        toggleLocation();
    });
	
	hideAllWarnings();
	
	// Load packages list
	paquete.getList();
}

/**
 * Function to hide all form warnings
 * 
 */
function hideAllWarnings() {
    $("#name_msg").hide();
    $("#company_msg").hide();
    $("#telephone_msg").hide();
    $("#city_msg").hide();
    $("#email_msg").hide();
}

/*gaston*/
var db = openDatabase('enbDB', '1.0', 'base para cotizacion', 2 * 1024 * 1024);
var FMod =function(){
    this.name='';
    this.tName='';
    this.tFields='';
    this.sUrl='';
    this.debug=false;
    this.init=function(params){
        this.name=params.name;
        this.sUrl=params.sUrl;
        this.tName=params.tName;
        this.tFields=params.tFields;
        if(params.debug)
            this.debug=params.debug;
    };
    this.request = function(){
        var fun=this;
        
         $.ajax({
            url: this.sUrl,
            dataType: 'jsonp',
            success: function(dj){
                var len = dj.c;
                fun.createTable();
                for(var i=0;i<len;i++){
                    fun.writeTableIni(dj.data[i]);
                }
                
            }
        });
    };
    this.createTable= function(){
        var f_aux=this.tFields;
        //f_aux[0]=f_aux[0]+" unique";
        var sql_cre='CREATE TABLE IF NOT EXISTS '+this.tName+' ('+f_aux.join(", ")+')';
        if(this.debug)
            console.log("---cre-->"+sql_cre);
        //alert("antes crear"+sql_cre)
        this.query(sql_cre);
        //alert("desp crear")
    };
    this.writeTableIni = function(r){
        
        var sql_del=('DELETE FROM '+this.tName+' WHERE '+this.tFields[0]+'='+eval("r."+this.tFields[0])+';');
        
        if(this.debug)
            console.log("---del-->"+sql_del);
        this.query(sql_del);
    
        var c0=new Array();
        for(var j in this.tFields){
            var c=eval("r."+this.tFields[j]);
            if(j>0)
                c='"'+c+'"';
            c0.push(c);
        }
        
        var sql_ins='INSERT INTO '+this.tName+' ('+this.tFields.join(",")+') VALUES ('+c0.join(", ")+');';
        if(this.debug)
            console.log("-ins--->"+sql_ins);
        this.query(sql_ins);
         
    };
    this.query = function(sql){
        db.transaction(function (tx) {
            if(this.debug)
                console.log("---sql-->"+sql);
            tx.executeSql(sql);
        });
    };
};
var str_url_p='http://enbolivia.com/ajax/service.php?s=p';
var str_url_m='http://enbolivia.com/ajax/service.php?s=m';  
//var str_url_p='http://localhost/TEST/enbo_cotizacion/service.php?s=p';
//var str_url_m='http://localhost/TEST/enbo_cotizacion/service.php?s=m';
var paquetes = new Array();

paquetes[1] = new Array('Paquete Básico','Este paquete le ofrece los elementos mínimos necesarios para el diseño y correcto funcionamiento de su página Web. El paquete básico se caracteriza por su gran flexibilidad y por ende se ajusta a las necesidades de cualquier tipo de organización. Además, usted cuenta con la opción de adicionar módulos opcionales al paquete y de esta manera personalizarlo de acuerdo a los requerimientos de su sitio Web.','','350','10','basicoaeea81d.gif','35,33,36,13,16,34,17,39,11,24,18,27,23,10,22,32,31,26,12,19,38,37,30,29,28,9,15,25,14,8','6,7,20,21,40,41');
paquetes[2] = new Array('Paquete Tienda virtual','El paquete \"Tienda Virtual\" est&aacute; dise&ntilde;ado para exponer productos y consolidar ventas. Este paquete no solo le ofrece los elementos necesarios para mostrar sus productos en su pagina web, tambi&eacute;n le ofrece la oportunidad de crear relaciones comerciales con sus visitantes.  Las herramientas incluidas en este paquete facilitan la venta de sus productos, adem&aacute;s cuenta con m&oacute;dulos opcionales especialmente pensados para incrementar la eficiencia de su sitio Web.','8,16,10,9','1020','10','tienda6084db7c.gif','26,11,12,13,28,29','6,7,20,21,40,41');
paquetes[3] = new Array('Paquete ONG','Este paquete esta pensado para satisfacer las exigencias de las ONG\'s. El campo de acci&oacute;n de este tipo de organizaciones es muy extenso, por eso este paquete esta pensado para brindar adaptabilidad y funcionalidad a todo nivel. Nuestra experiencia con este tipo de organizaciones nos permite sugerir los elementos m&aacute;s importantes para su sitio Web, adem&aacute;s de m&oacute;dulos opcionales que son de gran ayuda para su organizaci&oacute;n y p&aacute;gina Web.','14,15,9,19,10','1090','10','ong.gif','22,11,25,29,28,24,23,18,13,37,35','6,7,20,21,40,41');
paquetes[4] = new Array('Paquete Turismo','El paquete \"Turismo\" est&aacute; pensado para aquellas organizaciones que brindan servicios tur&iacute;sticos o similares. A trav&eacute;s de este paquete su organizaci&oacute;n puede dar a conocer informaci&oacute;n diversa acerca de sus servicios y  actividades, asi como fotograf&iacute;as u otros medios visuales que hagan referencia a su campo de acci&oacute;n.','15,25,8,9,10','1160','12','turismo.gif','13,11,36,35','6,7,20,21,33,32,40,41');
paquetes[5] = new Array('Paquete empresarial','Este paquete, dise&ntilde;ado para todo tipo de empresas, le brinda una amplia gama de opciones para dar a conocer diversos aspectos de la misma, tales como clientes, noticias,  productos y una gran variedad de m&oacute;dulos adicionales que le permiten personalizar su sitio Web de acuerdo a las exigencias de su empresa.','8,39,14,18,25,12,9','1470','15','empresa.gif','36,35,30,29,16,13,10,34,31,37,11,19,23,26,15','6,7,20,33,32,21,40,41');

var modulos = new Array();

modulos[6] = new Array('Diseño Web','200','5','icon_monitor_mac.gif');
modulos[7] = new Array('Información institucional','150','2','page_text7b19e67f.gif');
modulos[8] = new Array('Productos / servicios','130','1','page_package.gif');
modulos[9] = new Array('Buscador','150','2','page_find.gif');
modulos[10] = new Array('Estadísticas','150','1','list_users.gif');
modulos[11] = new Array('Comentarios','130','1','comment.gif');
modulos[12] = new Array('Preguntas frecuentes','200','1','comment_new.gif');
modulos[13] = new Array('Boletines electrónicos','450','4','page_edit.gif');
modulos[14] = new Array('Noticias ','130','1','note.gif');
modulos[15] = new Array('Eventos','200','1','icon_extension.gif');
modulos[16] = new Array('Carrito de compras','260','2','icon_package_open.gif');
modulos[17] = new Array('Chat','200','2','page_user.gif');
modulos[18] = new Array('Documentos privados','200','2','list_keys.gif');
modulos[19] = new Array('Publicaciones','130','1','page.gif');
modulos[20] = new Array('Contáctenos','0','0','note_new.gif');
modulos[21] = new Array('Mapa del sitio','0','0','site.gif');
modulos[22] = new Array('Foro virtual','350','3','page_user_dark.gif');
modulos[23] = new Array('Encuestas','130','1','page_tick.gif');
modulos[24] = new Array('Cursos','130','1','page_bookmark.gif');
modulos[25] = new Array('Galería de fotos','200','2','folder_images.gif');
modulos[26] = new Array('Pago por tarjeta de crédito','130','3','action_refresh_blue.gif');
modulos[27] = new Array('e-learning (moodle)','400','6','page_user_light.gif');
modulos[28] = new Array('Usuarios WSP','130','1','icon_user.gif');
modulos[29] = new Array('Usuarios externos (miembros, socios)','130','2','icon_get_world.gif');
modulos[30] = new Array('Testimonios','130','2','icon_favourites.gif');
modulos[31] = new Array('Mapa georeferencial','400','8','icon_world.gif');
modulos[32] = new Array('Imprimir página','0','0','action_print.gif');
modulos[33] = new Array('Avisar a un amigo','0','0','comment_yellow.gif');
modulos[34] = new Array('Categorías','60','1','icon_component.gif');
modulos[35] = new Array('Animación Flash','80','4','application_flash.gif');
modulos[36] = new Array('Banners','130','3','image.gif');
modulos[37] = new Array('RSS','130','2','page_text.gif');
modulos[38] = new Array('Reportes','300','4','action_paste.gif');
modulos[39] = new Array('Clientes','130','2','page_user66aa36b9.gif');
modulos[40] = new Array('Hosting','0','0','icon_network.gif');
modulos[41] = new Array('Dominio','0','0','icon_package.gif');


var paquete=new FMod();
paquete.init({"name":"paquete","tName":"st_paquetes","tFields":["id_paquetes","p_titulo","p_descripcion","p_imagen"],"sUrl":str_url_p,"debug":false});
paquete.getList= function(){
    $("#list_paquete").html("");
    var sql_sel='SELECT * FROM '+this.tName;
    if(this.debug)
        console.log("----->"+sql_sel);
    
	/*db.transaction(function (tx) {
        tx.executeSql(sql_sel, [], function (tx, r) {
            var len = r.rows.length, i;
            for (i = 0; i < len; i++) {
                var cad='';
                cad+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="index.html" class="ui-link-inherit">';
                cad+='<img src="images/paquete/'+r.rows.item(i).p_imagen+'" class="ui-li-thumb">';
                cad+='<h3 class="ui-li-heading">'+r.rows.item(i).p_titulo+'</h3>';
                cad+='<p class="ui-li-desc">'+r.rows.item(i).p_descripcion+'</p>';
                cad+='</a></div></div>';
                cad+='</li>';
                $("#list_paquete").html($("#list_paquete").html()+cad);
            }
        });
    });*/
	
	//--console.log('longitud '+paquetes.length);
	for(var i = 1; i <= paquetes.length; i++) {
		var cad='';
		cad+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">';
		cad+='<a href="#pageDetail" id="'+i+'" class="ui-link-inherit">';
		cad+='<img src="images/paquete/'+paquetes[i][5]+'" class="ui-li-thumb">';
		cad+='<h3 class="ui-li-heading">'+paquetes[i][0]+'</h3>';
		cad+='<p class="ui-li-desc">'+paquetes[i][1]+'</p>';
		cad+='<p class="ui-li-desc"><b>Precio:</b> USD '+paquetes[i][3]+'</p>';
		cad+='</a></div></div>';
		cad+='</li>';
		$("#list_paquete").html($("#list_paquete").html()+cad);		
		
		// para que se ejecute solo una vez
		if(i == 1)
			eval("$('div div a.ui-link-inherit').live('click', function () { currentId = $(this).attr('id'); showDetailPaquete(currentId); /*console.log('este valor es el recepcionado'+currentId);*/ });");
			
		//$('div div a.ui-link-inherit').live('click', function () { currentId = $(this).attr('id'); mostrarIT(currentId); console.log('este valor es el recepcionado'+currentId); });
	}
	
};
	
/**
 * Function to fill the Fixed, Default and Optional modules into 'ul' tags
 *
 * @param int id, package id
 */
function showDetailPaquete( id ) {
	var totalCost = 0;
	var totalTime = 0;
	
	// Set header values
	$( "#detail_header" ).html( "" );
	$( "#detail_header" ).html( paquetes[id][0] );
	
	// Set the package Id as a form element
	$( "#packageId" ).val( id );
	
	// Get fixed modules
	var modulesFixed = paquetes[id][7];
	var idModFixed = modulesFixed.split( ',' );
	
	$( "#modules_fixed" ).html( "" );
	$( "#modules_assigned" ).empty();
	$( "#modules_optionals" ).empty();
	
	for( var i in idModFixed ) {
		var cad='';
		totalCost+= parseInt( modulos[idModFixed[i]][1] );
		totalTime+= parseInt( modulos[idModFixed[i]][2] );
		
		cad+= '<div id="div_module_' + slugify( modulos[idModFixed[i]][0] )+'">';
		cad+= '<img src="images/modulos/' + modulos[idModFixed[i]][3]+'">';
		cad+= '<label><span id="inner_div_' + slugify( modulos[idModFixed[i]][0] ) + '" class="disa_b"></span><input type="checkbox" data-theme="e" disabled = "disabled" checked="checked" name="checkbox_'+idModFixed[i]+'" id="checkbox_'+idModFixed[i]+'">'+modulos[idModFixed[i]][0]+'</label>';
		cad+= '</div>';

		$( "#modules_fixed" ).html( $( "#modules_fixed" ).html() + cad );	
	}
	
	// Get default assigned modules
	var modulesAssigned = paquetes[id][2];
	
	// Check if this module has packages assigned
	if( modulesAssigned.length > 0 ) {
		var idModAssigned = modulesAssigned.split( ',' );
		
		if( idModAssigned.length > 0 ) {
			
			for( var i in idModAssigned ) {
				var cad = '';
				
				totalCost+= parseInt( modulos[idModAssigned[i]][1] );
				totalTime+= parseInt( modulos[idModAssigned[i]][2] );
		
				cad+= '';
				cad+= '<div id="div_module_'+slugify ( modulos[idModAssigned[i]][0] )+'">';
				cad+= '<img src="images/modulos/'+modulos[idModAssigned[i]][3]+'">';
				cad+= '<label><span id="inner_div_'+slugify(modulos[idModAssigned[i]][0])+'" class="on_b"></span><input type="checkbox" class="custom-check" checked="checked" onclick="changePrice('+idModAssigned[i]+',\'checkbox_'+idModAssigned[i]+'\')" name="checkbox_'+idModAssigned[i]+'" id="checkbox_'+idModAssigned[i]+'">'+modulos[idModAssigned[i]][0]+'</label>';
				cad+= '</div>';
				cad+= '';
				
				$( "#modules_assigned" ).html( $( "#modules_assigned" ).html() + cad ).trigger( 'create' );
				
				$( "input[type='checkbox']" ).click( function() {
					if( $( this ).is( ":checked" ) ) {
						currentId = $( this ).attr( 'id' );
						currentId = currentId.replace( "checkbox_", "" );
						$( "#inner_div_" + slugify( modulos[currentId][0] ) ).attr( 'class', 'on_b' );
					}
					else {
						currentId = $( this ).attr( 'id' );
						currentId = currentId.replace( "checkbox_", "" );
						$( "#inner_div_" + slugify( modulos[currentId][0] ) ).attr( 'class', 'off_b' );
					}
				});
			}
		}
	}
	
	//Get optional modules
	var modulesOptionals = paquetes[id][6];
	
	var idModOptionals = modulesOptionals.split( ',' );
	
	if( idModOptionals.length > 0 ) {
		
		for( var i in idModOptionals ) {
			var cad = '';
			cad+= '<div id="div_module_' + slugify( modulos[idModOptionals[i]][0] ) + '" >';
			cad+= '<img src="images/modulos/' + modulos[idModOptionals[i]][3] + '">';
			cad+= '<label><span id="inner_div_' + slugify( modulos[idModOptionals[i]][0] ) + '" class="off_b"></span>';
			cad+= '<input type="checkbox" class="testchk" data-theme="e" onclick="changePrice(' + idModOptionals[i] + ',\'checkbox_' + idModOptionals[i] + '\')" value="15" name="checkbox_' + idModOptionals[i]+'" id="checkbox_'+idModOptionals[i]+'">'+modulos[idModOptionals[i]][0]+'</label>';
			cad+= '</div>';
			
			$( "#modules_optionals" ).html( $( "#modules_optionals" ).html() + cad).trigger( 'create' );
			$( "input[type='checkbox']" ).click( function() {
			
				if($( this ).is( ":checked" )) {
					currentId = $( this ).attr( 'id' );
					currentId = currentId.replace( "checkbox_", "" );
					$( "#inner_div_" + slugify( modulos[currentId][0] ) ).attr( 'class', 'on_b' );
				}
				else {
					currentId = $( this ).attr( 'id' );
					currentId = currentId.replace( "checkbox_", "" );
					$( "#inner_div_" + slugify( modulos[currentId][0] ) ).attr( 'class', 'off_b' );
					//--console.log("click en un ckeck apagado "+currentId +"///"+slugify(modulos[currentId][0]));
				}
			});
		}
	}
	
	
	// Set initial cost/price
	$( "#cost" ).val( totalCost );
	
	// Set initial time
	$( "#time" ).val( totalTime );
	
	$( "input[type='checkbox']" ).checkboxradio( "refresh" );
}
	
/**	
 * Function to send selected packages
 */
function sendPackages() {
	$( "#package" ).val( $( "#packageId" ).val() );
	var currentCheck;
	var modulesChecked = new Array();
	var counter = 0;
	var totalTime = 0;
	var totalCost = 0;
	
	// Check all checkboxes of modules to get only the selected's
	for(var i in modulos) {
		currentCheck = $( "#checkbox_" + i );
		
		if( currentCheck.is( ":checked" ) ) {
			modulesChecked[counter] = i;
			totalTime+= parseInt( modulos[i][2] );
			totalCost+= parseInt( modulos[i][1] );
			counter++;
		}
	}
	
	$("#modules").val( modulesChecked.join( ',' ) );
	
	$("#tiempo").val( totalTime );
	$("#costo").val( totalCost );
	
	/* Show the form page */
	$.mobile.changePage( "#price" );
}
	
/**
 * Function to check the status of network access and return this
 * @return return the Internet Connection and return false whether there is no Internet Connection
 */
function checkConnection() {
	var networkState = navigator.network.connection.type;

	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	//--states[Connection.NONE]     = 'No network connection';
	states[Connection.NONE]     = '0';
	
	//--console.log('Connection type: '+ states[networkState]);
	//--alert('Connection type: '+ states[networkState]);
	
	return states[networkState];
}

/**
 * Function to change the price
 * @param int moduleId, keep the id of package to add or substract
 * @param string fieldName, name of the field for evaluate its status
 */
function changePrice(moduleId, fieldName) {
	var currentPrice = $("#cost").val();
	var currentTime = $("#time").val();
	//var element = $(fieldName);
	
	//--console.log("El valor del campo: "+fieldName+"-----"+$("#"+fieldName).is(":checked"));
	if($("#"+fieldName).is(":checked")) {
		//--console.log("valor: "+currentPrice+" para sumar: "+parseInt(modulos[moduleId][1]));
		//--console.log("tiempo "+currentTime+"----"+modulos[moduleId][2]);
		
		// add module price to current package
		currentPrice = parseInt(currentPrice) + parseInt(modulos[moduleId][1]);
		$("#cost").val(currentPrice);
		
		// add module time to current package
		currentTime = parseInt(currentTime) + parseInt(modulos[moduleId][2]);
		$("#time").val(currentTime);
	}
	else {
		// substract module price from current package
		currentPrice = parseInt(currentPrice) - parseInt(modulos[moduleId][1]);
		$("#cost").val(currentPrice);
		
		// substract module time from current package
		currentTime = parseInt(currentTime) - parseInt(modulos[moduleId][2]);
		$("#time").val(currentTime);
	}
}

/**
 * Function to send all form's data throughout ajax by POST method
 */
function sendByAjax() {
	/* check if we have internet connection */
	if( checkConnection() == 0 ) {
	//--if(0) {
		alert("Necesita tener conexión a Internet para realizar la cotización.");
		return false;
	}
	else {
		var name 		= $("#name").val();
		var company 	= $("#company").val();
		var telephone 	= $("#telephone").val();
		var email 		= $("#email").val();
		var city 		= $("#city").val();
		var modules 	= $("#modules").val();
		var pack 		= $("#package").val();
		var tiempo 		= $("#tiempo").val();
		var costo 		= $("#costo").val();
	
		if(!validateFields()) {
			// If all fields are valid, we sent them by ajax
			$.ajax({
					type: "POST",
					url: "http://www.enbolivia.com/class/sendcot2.php",
					data: ({"frmnombre": name,"frmempresa": company, "frmtelefono": telephone, "frmmail": email, "frmlugar": city, "frmpaquetes": modules, "frmidpaquete": pack, "frmtiempo": tiempo, "frmcosto": costo}),
					cache: false,
					dataType: "text",
					success: onSuccess
			});
		}
	}
}
	
/**
 * Function to validate form fields
 * 
 * @return bool
 */
function validateFields() {
	// hide all previous warnings
	hideAllWarnings();
		
	var err = false;
		
	var textTypeFields = new Array('name','company','telephone','city');
	
	// Check if text fields have content
	for( var i = 0; i < textTypeFields.length; i++ ) {
		if( $( "#" + textTypeFields[i] ).val().length == 0 ) {
			$( "#" + textTypeFields[i] + "_msg" ).toggle();
			err = true;
		}
	}
		
	// Check if there is a valid email address
	if( !checkEmail( $("#email").val() ) ) {
		$("#email_msg").toggle();
		err = true;
	}
		
	
	return err;
}
 
/**
 * Function to validate email address
 */
function checkEmail( sEmail ) {
	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	
	if( filter.test( sEmail ) )
		return true;
	else
		return false;
}
 

/**
 * Function to redirect the current page when the price was sent
 */
function onSuccess( data ) {
	alert( "Su cotización se envio satisfactioriamente." );
	$.mobile.changePage( "#indexHome" );
}

/**
 * Function to slug a string
 *
 * @param string str, string to be sluged
 * @return string, string sluged
 */ 
function slugify ( str ) {
  str   = str.toLowerCase();
  str   = str.replace( /\s/gi, "-" );
  str   = str.replace( /\//gi, "-" );
  str   = str.replace( ",", "_" );
  //str   = str.replace( /[^-a-zA-Z0-9,&/\s]+/ig, '' );
  str   = str.replace( /[^-a-zA-Z0-9,&\s]+/ig, '');


  // Trim dash from beginning, end.
  while( str.substr( 0, 1 ) == '-' )  str   = str.substr( 1 );
  while( str.substr( -1 ) == '-' )    str   = str.substr( 0, str.length -1 );

  return str;
}


var modulo=new FMod();
modulo.init({"name":"modulo","tName":"st_modulos","tFields":["id_modulos","m_title"],"sUrl":str_url_m,"debug":false});
modulo.getList= function(){
    $("#list_modulo").html("");
    var sql_sel='SELECT * FROM '+this.tName;
    if(this.debug)
        console.log("----->"+sql_sel);
    db.transaction(function (tx) {
        tx.executeSql(sql_sel, [], function (tx, r) {
            var len = r.rows.length, i;
            for (i = 0; i < len; i++) {
                var cad='';
                cad+='<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="index.html" class="ui-link-inherit">';
                cad+='<img src="images/paquete/'+r.rows.item(i).m_title+'" class="ui-li-thumb">';
                cad+='<h3 class="ui-li-heading">'+r.rows.item(i).m_title+'</h3>';
                cad+='<p class="ui-li-desc">'+r.rows.item(i).m_title+'</p>';
                cad+='</a></div></div>';
                cad+='</li>';
                $("#list_modulo").html($("#list_modulo").html()+cad);
            }
        });
    });
};
    

