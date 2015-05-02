HTMLElement.prototype.removeClass = function(remove) {
    var newClassName = "";
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] !== remove) {
            newClassName += classes[i] + " ";
        }
    }
    this.className = newClassName;
}


/**
 *
 */
//try { x.abc.s == false}catch(e){alert('hello')}
iFrequency = 2000; // expressed in miliseconds
myInterval = 0;
count=0;

// STARTS and Resets the loop if any
function startloop(a) {
	if (a) count=a;
	if(myInterval > 0) clearInterval(myInterval);  // stop
	myInterval = setInterval( "doSomething()", iFrequency );  // run
}

function stoploop() {
	if(myInterval > 0) clearInterval(myInterval);  // stop
}

myDOMcount=[0,0,0,0,0,0,0,0,0,0,0,0,0];
function htmlTree(obj1){
    var obj = obj1 || document.getElementsByTagName('body')[0];
    //var obj = obj1 || document;

    myDOMcount[obj.nodeType]++;
    if (obj.hasChildNodes()) {
      var child = obj.firstChild;
      while(child){
        if (child.nodeType <= myDOMcount.length) {
          htmlTree(child);
        }
        child = child.nextSibling;
      }
    }
  }

function doSomething() {
	if (--count < 0) return;
	myDOMcount=[0,0,0,0,0,0,0,0,0,0,0,0,0];
	console.group('MemoryStatus')
	ggv_log('store items registered', Ext.StoreManager.all.length);
	ggv_log('components registered',  Ext.ComponentManager.all.getArray().length);
	htmlTree();
	ggv_log('domCount: ', document.getElementsByTagName("*").length, myDOMcount[1],  myDOMcount[1]);
if (true) {
	[
	 //'html',
	 //'head',
	 'body',
	 'x-slidenavigation-list',
	 'placesMenu',
	 'placesList',
	 'eventsList',
	 'placesDetailContainer',
	 'eventsDetailContainer',
	 //'ggv-places-detail',
	 'MapContainer',
	 'GalleryContainer',
	 //'ggv-gallery'
	 ].forEach(function(i){
		//ggv_log(i);
		var 	tags    = document.getElementsByTagName(i),
			id      = document.getElementById(i),
			classes = document.getElementsByClassName(i),
			obj;

		if (tags.length) {
			obj = tags[0];
		}
		else if (id) {
			obj = id;
		}
		else if (classes.length) {
			obj = classes[0];
		}

		if (obj) {
			myDOMcount=[0,0,0,0,0,0,0,0,0,0,0,0,0];
			htmlTree(obj);
			ggv_log('domCount: "'+i+'": ', myDOMcount[1], myDOMcount[3]);
		}
		else {
			//ggv_log('domCount: "'+i+'": ', 'huh?');
		}
	})
}
	console.groupEnd('MemoryStatus');
	htmlTree();
	ggv_log('domCount: elements ', document.getElementsByTagName("*").length, ' all: ', myDOMcount);

	ggv_log('domCount: elements ', document.getElementsByTagName("*").length);
}
//startloop(125);
function stat() {
	startloop(1);
}

function  readCookie(name) {
	var i,nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function  createCookie(name,value,days,minutes) {
	if (days || minutes) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000)+(minutes?(minutes*60*1000):0));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()}

var LanguageTable = [];
function loadLanguages(lang) {
	LanguageTable.langtext_en = [];
	LanguageTable.langtext_en.Calendar = 'Calendar';
	LanguageTable.langtext_en.Phone = 'Phone: ';
	LanguageTable.langtext_en.noEventsMsg = 'No events to display';
	LanguageTable.langtext_en.sunsetToday = 'sunset today: ';
	LanguageTable.langtext_en.sometimeThisEvening = 'sometime this evening';
	LanguageTable.langtext_en.ChooseCuisines ='Choose Cuisines';
	LanguageTable.langtext_en.SelectedCuisines ='Selected Cuisines';
	LanguageTable.langtext_en.ApplicationUpdate ='Application Update';
	LanguageTable.langtext_en.ApplicationUpdateQuestion = "This application has just successfully been updated to the latest version.<br /> Reload now?";
	LanguageTable.langtext_en.ChangeLangQuestion = "Change Language?";
	LanguageTable.langtext_en.allEventsSortedByTime = 'all events sorted by start time';
	LanguageTable.langtext_en.sorryNoGallery = 'sorry, gallery not available';
	LanguageTable.langtext_en.search = 'search';
	LanguageTable.langtext_en.ClearRecentsQuestion = 'Recently Viewed<br />Clear History?';
	LanguageTable.langtext_en.lastViewed = 'last viewed: ';
	LanguageTable.langtext_en.JustNow = 'Just Now';
	LanguageTable.langtext_en.MinutesAgo1 = '&nbsp;'
	LanguageTable.langtext_en.MinutesAgo2 = ' minutes ago';
	

	LanguageTable.langtext_es = [];
	LanguageTable.langtext_es.noEventsMsg = 'No hay eventos';
	LanguageTable.langtext_es.Calendar = 'Calendario';
	LanguageTable.langtext_es.Phone = 'Tel. ';
	LanguageTable.langtext_es.sunsetToday = 'puesta de sol de hoy: ';
	LanguageTable.langtext_es.sometimeThisEvening = 'en algún momento de esta noche';
	LanguageTable.langtext_es.ChooseCuisines ='Elegir Cocinas';
	LanguageTable.langtext_es.SelectedCuisines ='Cocinas Seleccionados';
	LanguageTable.langtext_es.ApplicationUpdate ='Actualización de la Aplicación';
	LanguageTable.langtext_es.ApplicationUpdateQuestion = "Esta aplicación con éxito sólo actualizado a la última versión.<br /> ¿Actualizar ahora?";
	LanguageTable.langtext_es.ChangeLangQuestion = "¿Cambiar el Idioma?";
	LanguageTable.langtext_es.allEventsSortedByTime = 'ordenados por hora de inicio';
	LanguageTable.langtext_es.sorryNoGallery = 'Lo sentimos, no está disponible la galería';
	LanguageTable.langtext_es.search = 'buscar';
	LanguageTable.langtext_es.ClearRecentsQuestion = 'Visto Recientemente<br />¿borrar el historial?';
	LanguageTable.langtext_es.lastViewed = 'última visto: ';
	LanguageTable.langtext_es.JustNow = 'en este momento';
	LanguageTable.langtext_es.MinutesAgo1 = ' hace ';
	LanguageTable.langtext_es.MinutesAgo2 = ' minutos';
	
	LanguageTable.langtext_fr = [];
	LanguageTable.langtext_fr.noEventsMsg = 'Aucun événement à afficher';
	LanguageTable.langtext_fr.Calendar = 'Calendar';
	LanguageTable.langtext_fr.Phone = 'Phone: ';
	LanguageTable.langtext_fr.sunsetToday = 'coucher du soleil aujourd\'hui: ';
	LanguageTable.langtext_fr.sometimeThisEvening = 'parfois ce soir';
	LanguageTable.langtext_fr.ChooseCuisines ='Choisir Cuisines';
	LanguageTable.langtext_fr.SelectedCuisines ='Cuisines Sélectionnés';
	LanguageTable.langtext_fr.ApplicationUpdate ='App Mise à Jour';
	LanguageTable.langtext_fr.ApplicationUpdateQuestion = "Cette application vient bien été mis à jour pour la dernière version.<br /> Recharger maintenant?";
	LanguageTable.langtext_fr.ChangeLangQuestion = "Changer la langue?";
	LanguageTable.langtext_fr.allEventsSortedByTime = 'les événements triés par heure';
	LanguageTable.langtext_fr.sorryNoGallery = 'Désolé, galerie n\'est pas disponible';
	LanguageTable.langtext_fr.search = 'chercher';
	LanguageTable.langtext_fr.ClearRecentsQuestion = 'Vu récemment<br />effacer l\'historique?'
	LanguageTable.langtext_fr.lastViewed = 'dernier vu: ';
	LanguageTable.langtext_fr.JustNow = 'tout à l\'heure';
	LanguageTable.langtext_fr.MinutesAgo1 = ' Il ya ';
	LanguageTable.langtext_fr.MinutesAgo2 = ' minutes';
	
	LanguageTable.setLanguage = function(lang) {

		if (lang.substring(0,2) == 'es')
		{

			Date.shortMonthNames = ["Ene","Feb","Mar","Abr","Mayo","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

			Date.getShortMonthName = function(month) {
				return Date.shortMonthNames[month];
			};

			Date.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre", "Diciembre"];

			Date.monthNumbers = {"Enero" : 0,"Febrero" : 1,"Marzo" : 2,"Abril" : 3,"Mayo" : 4,"Junio" : 5,"Julio" : 6,"Agosto" : 7,"Septiembre" : 8,"Octobre" : 9,"Noviembre" : 10,"Diciembre" : 11};

			Date.getMonthNumber = function(name) {
				return Date.monthNumbers[Ext.util.Format.capitalize(name)];
			};

			Date.dayNames = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

			Date.getShortDayName = function(day) {
				return Date.dayNames[day].substring(0, 3);
			};

			//Ext.Date.parseCodes.S.s = "(?:er)";

			//Ext.override(Ext.Date, {
			//	getSuffix : function() {
			//		return (this.getDate() == 1) ? "er" : "";
			//	}
			//});
			return LanguageTable.langtext_es;
		}


		else if (lang.substring(0,2) == 'fr')
		{
			Date.shortMonthNames = [
				"Janv",
				"Févr",
				"Mars",
				"Avr",
				"Mai",
				"Juin",
				"Juil",
				"Août",
				"Sept",
				"Oct",
				"Nov",
				"Déc"
			];

			Date.getShortMonthName = function(month) {
				return Date.shortMonthNames[month];
			};

			Date.monthNames = [
				"Janvier",
				"Février",
				"Mars",
				"Avril",
				"Mai",
				"Juin",
				"Juillet",
				"Août",
				"Septembre",
				"Octobre",
				"Novembre",
				"Décembre"
			];

			Date.monthNumbers = {
				"Janvier" : 0,
				"Février" : 1,
				"Mars" : 2,
				"Avril" : 3,
				"Mai" : 4,
				"Juin" : 5,
				"Juillet" : 6,
				"Août" : 7,
				"Septembre" : 8,
				"Octobre" : 9,
				"Novembre" : 10,
				"Décembre" : 11
			};

			Date.getMonthNumber = function(name) {
				return Date.monthNumbers[Ext.util.Format.capitalize(name)];
			};

			Date.dayNames = [
				"Dimanche",
				"Lundi",
				"Mardi",
				"Mercredi",
				"Jeudi",
				"Vendredi",
				"Samedi"
			];

			Date.getShortDayName = function(day) {
				return Date.dayNames[day].substring(0, 3);
			};
//
//			Date.parseCodes.S.s = "(?:er)";
//
//			Ext.override(Date, {
//				getSuffix : function() {
//					return (this.getDate() == 1) ? "er" : "";
//				}
//			});

			return LanguageTable.langtext_fr;
		}
		else
		{
			Date.dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			Date.shortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			Date.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			Date.getShortMonthName = function(month) {
				return Date.shortMonthNames[month];
			};

			Date.getShortDayName = function(day) {
				return Date.dayNames[day].substring(0, 3);
			};
			return LanguageTable.langtext_en;
		}
	}
	return LanguageTable.setLanguage(lang);
}

GayGuideApp = {};
GayGuideApp.lang = readCookie('t_lang') || 'en';
GayGuideApp.langtext = loadLanguages(GayGuideApp.lang) || [];

/////////////////////////// test setup json datasource
//GayGuideApp.jsonBase = "http://v11.com"; //localhost test system
//GayGuideApp.jsonBase = "http://192.168.1.117/~markpage/v11.com"; //localhost test system
//GayGuideApp.jsonBase = "http://tlaloc2.gayguidevallarta.com"; // network host test site

if (GayGuideApp.jsonBase) {
	alert('were are using TEST database: '+GayGuideApp.jsonBase);
}
else {
	GayGuideApp.jsonBase = "http://www.gayguidevallarta.com";
}
///////////////////////////
function changemysize(myvalue) {
    var div = document.body;
    div.style.fontSize = myvalue;   
}

function getbodytxtsize() {
	return window.getComputedStyle(document.body, null).fontSize;
}

function getbodystyle() {
	return	document.getElementsByTagName('body')[0].className;
}

function getmysize() {
	return document.body.style.fontSize;
}

function trans(key) {
	if (GayGuideApp.langtext[key])
		return GayGuideApp.langtext[key];

	return Ux.locale.Manager.get('trans.'+key, key);
}

function transDate(values) {
	return '' + values.getDate() + ' ' + Date.monthNames[values.getMonth()] + ' ' + (1900+values.getYear());
}

function transDayName(values) {
	return Date.dayNames[values.getDay()];
}

_reportViewLast={};

function reportView(viewPath, viewTitle ){
	if (_reportViewLast.path == viewPath && _reportViewLast.title == viewTitle) return;
	//console.log('reportView', viewPath);
	
	ga_storage._trackPageview(viewPath, viewTitle);
	_reportViewLast = { path: viewPath, title: viewTitle};
}

function ggv_log() {
return;
	var arg = arguments,
		ln = arg.length;
		
	if (ln == 1)
		console.log(arguments[0]);
	else if (ln == 2)
		console.log(arguments[0], arguments[1]);
	else if (ln == 3)
		console.log(arguments[0], arguments[1], arguments[2]);
	else if (ln == 4)
		console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
	else
		console.log(arguments);
}

function ggv_vsnDate() {
	return  "V4.1.1<br />Build Version: master<br />Date: 2015-05-02 development ";
}

console.log('lang.js')



