(function($){
/**
 * jqGrid extension for form editing Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/
/*global xmlJsonClass, jQuery, $  */
var rp_ge = {};
$.jgrid.extend({
	editGridRowCustom : function(rowid, p){
		p = $.extend({
			top : 0,
			left: 0,
			width: 300,
			height: 'auto',
			dataheight: 'auto',
			modal: false,
			overlay : 30,
			drag: true,
			resize: true,
			url: null,
			mtype : "POST",
			clearAfterAdd :true,
			closeAfterEdit : false,
			reloadAfterSubmit : true,
			onInitializeForm: null,
			beforeInitData: null,
			beforeShowForm: null,
			afterShowForm: null,
			beforeSubmit: null,
			afterSubmit: null,
			onclickSubmit: null,
			afterComplete: null,
			onclickPgButtons : null,
			afterclickPgButtons: null,
			editData : {},
			recreateForm : false,
			jqModal : true,
			closeOnEscape : false,
			addedrow : "first",
			topinfo : '',
			bottominfo: '',
			saveicon : [],
			closeicon : [],
			savekey: [false,13],
			navkeys: [false,38,40],
			checkOnSubmit : false,
			checkOnUpdate : false,
			_savedData : {},
			processing : false,
			onClose : null,
			ajaxEditOptions : {},
			serializeEditData : null,
			viewPagerButtons : true
		}, $.jgrid.edit, p || {});
		rp_ge[$(this)[0].p.id] = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid || !rowid) { return; }
			if ($("#sData",$t.grid.hDiv).length > 0 ) { return; }
			var gID = $t.p.id,
			frmgr = "gbox_"+gID,frmtb = "gbox_"+gID,
			IDs = {themodal:'editmod'+gID,modalhead:'edithd'+gID,modalcontent:'editcnt'+gID, scrollelm : frmgr},
			onBeforeShow = $.isFunction(rp_ge[$t.p.id].beforeShowForm) ? rp_ge[$t.p.id].beforeShowForm : false,
			onAfterShow = $.isFunction(rp_ge[$t.p.id].afterShowForm) ? rp_ge[$t.p.id].afterShowForm : false,
			onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
			onInitializeForm = $.isFunction(rp_ge[$t.p.id].onInitializeForm) ? rp_ge[$t.p.id].onInitializeForm : false,
			copydata = null,
			showFrm = true,
			maxCols = 1, maxRows=0,	postdata, extpost, newData, diff;
			if (rowid === "new") {
				rowid = "_empty";
				p.caption=rp_ge[$t.p.id].addCaption;
			} else {
				p.caption=rp_ge[$t.p.id].editCaption;
			}
			if(p.recreateForm===true && $("#"+IDs.themodal).html() !== null) {
				$("#"+IDs.themodal).remove();
			}
			var closeovrl = true;
			if(p.checkOnUpdate && p.jqModal && !p.modal) {
				closeovrl = false;
			}
			function getFormData(){
				$("#"+frmtb+" > div > div > div > table > thead > tr > td > .FormElement").each(function(i) {
					var celm = $(".customelement", this);
					if (celm.length) {
						var  elem = celm[0], nm = $(elem).attr('name');
						$.each($t.p.colModel, function(i,n){
							if(this.name === nm && this.editoptions && $.isFunction(this.editoptions.custom_value)) {
								try {
									postdata[nm] = this.editoptions.custom_value($("#"+$.jgrid.jqID(nm),"#"+frmtb),'get');
									if (postdata[nm] === undefined) { throw "e1"; }
								} catch (e) {
									if (e==="e1") { $.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,jQuery.jgrid.edit.bClose);}
									else { $.jgrid.info_dialog(jQuery.jgrid.errors.errcap,e.message,jQuery.jgrid.edit.bClose); }
								}
								return true;
							}
						});
					} else {
					switch ($(this).get(0).type) {
						case "checkbox":
							if($(this).attr("checked")) {
								postdata[this.name]= $(this).val();
							}else {
								var ofv = $(this).attr("offval");
								postdata[this.name]= ofv;
							}
						break;
						case "select-one":
							postdata[this.name]= $("option:selected",this).val();
							extpost[this.name]= $("option:selected",this).text();
						break;
						case "select-multiple":
							postdata[this.name]= $(this).val();
							if(postdata[this.name]) { postdata[this.name] = postdata[this.name].join(","); }
							else { postdata[this.name] =""; }
							var selectedText = [];
							$("option:selected",this).each(
								function(i,selected){
									selectedText[i] = $(selected).text();
								}
							);
							extpost[this.name]= selectedText.join(",");
						break;
						case "password":
						case "text":
						case "textarea":
						case "button":
							postdata[this.name] = $(this).val();

						break;
					}
					if($t.p.autoencode) { postdata[this.name] = $.jgrid.htmlEncode(postdata[this.name]); }
					}
				});
				return true;
			}
			function createData(rowid,obj,tb,maxcols){
				console.log("create data "+gID+" rowid "+rowid+" obj="+obj+" tb="+tb);
				var nm, hc,trdata, cnt=0,tmp, dc,elc, retpos=[], ind=false;
				if(rowid != '_empty') {
					ind = $(obj).jqGrid("getInd",rowid);
				}
				$(obj.p.colModel).each( function(i) {
					nm = this.name;
					// hidden fields are included in the form
					if(this.editrules && this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					dc = hc ? "style='display:none'" : "";
					var tdtmpl = "<td "+dc+" class='ui-state-default'></td>", tmpl="", i; //*2
					for (i =1; i<=maxcols;i++) {
						tmpl += tdtmpl;
					}
					if ( nm !== 'cb' && nm !== 'subgrid' && this.formatter !== 'actions' && nm !== 'rn' && nm !== 'actions') {
						if(ind === false) {
							tmp = "";
						} else {
							if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
								tmp = $("td:eq("+i+")",obj.rows[ind]).text();
							} else {
								try {
									tmp =  $.unformat($("td:eq("+i+")",obj.rows[ind]),{rowId:rowid, colModel:this},i);
								} catch (_) {
									tmp =  (this.edittype && this.edittype == "textarea") ? $("td:eq("+i+")",obj.rows[ind]).text() : $("td:eq("+i+")",obj.rows[ind]).html();
								}
								if(!tmp || tmp == "&nbsp;" || tmp == "&#160;" || (tmp.length==1 && tmp.charCodeAt(0)==160) ) {tmp='';}
							}
						}
						var opt = $.extend({}, this.editoptions || {} ,{id:nm,name:nm}),
						frmopt = $.extend({}, {elmprefix:'',elmsuffix:'',rowabove:false,rowcontent:''}, this.formoptions || {}),
						rp = parseInt(frmopt.rowpos,10) || cnt+1,
						cp = parseInt((parseInt(frmopt.colpos,10) || 1),10);
						if(rowid == "_empty" && opt.defaultValue ) {
							tmp = $.isFunction(opt.defaultValue) ? opt.defaultValue() : opt.defaultValue;
						}
						if(!this.edittype) { this.edittype = "text"; }
						if($t.p.autoencode) { tmp = $.jgrid.htmlDecode(tmp); }
						elc = $.jgrid.createEl(this.edittype,opt,tmp,false,$.extend({},$.jgrid.ajaxOptions,obj.p.ajaxSelectOptions || {}));
						if(tmp === "" && this.edittype == "checkbox") {tmp = $(elc).attr("offval");}
						if(tmp === "" && this.edittype == "select") {tmp = $("option:eq(0)",elc).text();}
						if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) { rp_ge[$t.p.id]._savedData[nm] = tmp; }
						if(this.edittype && this.edittype == "datepicker"){
							$(elc).children(":first").addClass("FormElement");
						}else{
							$(elc).addClass("FormElement");
						}
						trdata = $(tb).find("tr[rowpos="+rp+"]");
						if(frmopt.rowabove) {
							var newdata = $("<tr><td class='contentinfo' colspan='"+(maxcols*2)+"'>"+frmopt.rowcontent+"</td></tr>");
							$(tb).append(newdata);
							newdata[0].rp = rp;
						}
						if ( trdata.length===0 ) {
							if (rp == 1){
								trdata = $("<tr rowpos='"+rp+"'></tr>").addClass("FormData").attr("id","tr_"+nm);
							} else {
								trdata = $(tb).find("tr[rowpos=" + "1" + "]");
							}
							$(trdata).append(tmpl);
							$(tb).append(trdata);
							trdata[0].rp = rp;
						}
						if (this.editable===true){
							if(this.edittype && this.edittype == "datepicker"){
								$("td:eq("+(cp-1+rp-1)+")",trdata[0]).append(frmopt.elmprefix).append($(elc).children()).append(frmopt.elmsuffix);
							}else{
								$("td:eq("+(cp-1+rp-1)+")",trdata[0]).append(frmopt.elmprefix).append(elc).append(frmopt.elmsuffix);
							}
						}
						retpos[cnt] = i;
						cnt++;
					}
				});
				if( cnt > 0) {
					var idrow = $("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+ (maxcols*2-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='"+obj.p.id+"_id' value='"+rowid+"'/></td></tr>");
					idrow[0].rp = cnt+999;
					$(tb).append(idrow);
					if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) { rp_ge[$t.p.id]._savedData[obj.p.id+"_id"] = rowid; }
				}
				return retpos;
			}
			function fillData(rowid,obj,fmid){
				var nm,cnt=0,tmp, fld,opt,vl,vlc;
				if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData = {};rp_ge[$t.p.id]._savedData[obj.p.id+"_id"]=rowid;}
				var cm = obj.p.colModel;
				if(rowid == '_empty') {
					$(cm).each(function(i){
						nm = this.name;
						opt = $.extend({}, this.editoptions || {} );
						fld = $("#"+$.jgrid.jqID(nm),"#"+fmid);
						if(fld && fld.length && fld[0] !== null) {
							vl = "";
							if(opt.defaultValue ) {
								vl = $.isFunction(opt.defaultValue) ? opt.defaultValue() : opt.defaultValue;
								if(fld[0].type=='checkbox') {
									vlc = vl.toLowerCase();
									if(vlc.search(/(false|0|no|off|undefined)/i)<0 && vlc!=="") {
										fld[0].checked = true;
										fld[0].defaultChecked = true;
										fld[0].value = vl;
									} else {
										fld.attr({checked:"",defaultChecked:""});
									}
								} else {fld.val(vl); }
							} else {
								if( fld[0].type=='checkbox' ) {
									fld[0].checked = false;
									fld[0].defaultChecked = false;
									vl = $(fld).attr("offval");
								} else if (fld[0].type && fld[0].type.substr(0,6)=='select') {
									fld[0].selectedIndex = 0;
								} else {
									fld.val(vl);
								}
							}
							if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) { rp_ge[$t.p.id]._savedData[nm] = vl; }
						}
					});
					$("#id_g","#"+fmid).val(rowid);
					return;
				}
				var tre = $(obj).jqGrid("getInd",rowid,true);
				if(!tre) { return; }
				$('td',tre).each( function(i) {
					nm = cm[i].name;
					// hidden fields are included in the form
					if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && cm[i].editable===true) {
						if(nm == obj.p.ExpandColumn && obj.p.treeGrid === true) {
							tmp = $(this).text();
						} else {
							try {
								tmp =  $.unformat($(this),{rowId:rowid, colModel:cm[i]},i);
							} catch (_) {
								tmp = cm[i].edittype=="textarea" ? $(this).text() : $(this).html();
							}
						}
						if($t.p.autoencode) { tmp = $.jgrid.htmlDecode(tmp); }
						if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) { rp_ge[$t.p.id]._savedData[nm] = tmp; }
						nm = $.jgrid.jqID(nm);
						switch (cm[i].edittype) {
							case "password":
							case "text":
							case "button" :
							case "image":
							case "textarea":
								if(tmp == "&nbsp;" || tmp == "&#160;" || (tmp.length==1 && tmp.charCodeAt(0)==160) ) {tmp='';}
								$("#"+nm,"#"+fmid).val(tmp);
								break;
							case "select":
								var opv = tmp.split(",");
								opv = $.map(opv,function(n){return $.trim(n);});
								$("#"+nm+" option","#"+fmid).each(function(j){
									if (!cm[i].editoptions.multiple && (opv[0] == $.trim($(this).text()) || opv[0] == $.trim($(this).val())) ){
										this.selected= true;
									} else if (cm[i].editoptions.multiple){
										if(  $.inArray($.trim($(this).text()), opv ) > -1 || $.inArray($.trim($(this).val()), opv ) > -1  ){
											this.selected = true;
										}else{
											this.selected = false;
										}
									} else {
										this.selected = false;
									}
								});
								break;
							case "checkbox":
								tmp = tmp+"";
								if(cm[i].editoptions && cm[i].editoptions.value) {
									var cb = cm[i].editoptions.value.split(":");
									if(cb[0] == tmp) {
										$("#"+nm,"#"+fmid).attr("checked",true);
										$("#"+nm,"#"+fmid).attr("defaultChecked",true); //ie
									} else {
										$("#"+nm,"#"+fmid).attr("checked",false);
										$("#"+nm,"#"+fmid).attr("defaultChecked",""); //ie
									}
								} else {
									tmp = tmp.toLowerCase();
									if(tmp.search(/(false|0|no|off|undefined)/i)<0 && tmp!=="") {
										$("#"+nm,"#"+fmid).attr("checked",true);
										$("#"+nm,"#"+fmid).attr("defaultChecked",true); //ie
									} else {
										$("#"+nm,"#"+fmid).attr("checked",false);
										$("#"+nm,"#"+fmid).attr("defaultChecked",""); //ie
									}
								}
								break;
							case 'custom' :
								try {
									if(cm[i].editoptions && $.isFunction(cm[i].editoptions.custom_value)) {
										cm[i].editoptions.custom_value($("#"+nm,"#"+fmid),'set',tmp);
									} else { throw "e1"; }
								} catch (e) {
									if (e=="e1") { $.jgrid.info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,jQuery.jgrid.edit.bClose);}
									else { $.jgrid.info_dialog(jQuery.jgrid.errors.errcap,e.message,jQuery.jgrid.edit.bClose); }
								}
								break;
						}
						cnt++;
					}
				});
				if(cnt>0) { $("#id_g","#"+frmtb).val(rowid); }
			}
			function postIt() {
				var copydata, ret=[true,"",""], onCS = {}, opers = $t.p.prmNames, idname, oper, key, selr;
				if($.isFunction(rp_ge[$t.p.id].beforeCheckValues)) {
					var retvals = rp_ge[$t.p.id].beforeCheckValues(postdata,$("#"+frmgr),postdata[$t.p.id+"_id"] == "_empty" ? opers.addoper : opers.editoper);
					if(retvals && typeof(retvals) === 'object') { postdata = retvals; }
				}
				for( key in postdata ){
					if(postdata.hasOwnProperty(key)) {
						ret = $.jgrid.checkValues(postdata[key],key,$t);
						if(ret[0] === false) { $("#"+key, "#"+frmtb).effect("highlight", {color:"#FF0000"}, 5000); $("#"+key, "#"+frmtb).focus();  break; }
					}
				}
				setNulls();
				if(ret[0]) {
					if( $.isFunction( rp_ge[$t.p.id].onclickSubmit)) { onCS = rp_ge[$t.p.id].onclickSubmit(rp_ge[$t.p.id],postdata) || {}; }
					if( $.isFunction(rp_ge[$t.p.id].beforeSubmit))  { ret = rp_ge[$t.p.id].beforeSubmit(postdata,$("#"+frmgr)); }
				}

				if(ret[0] && !rp_ge[$t.p.id].processing) {
					rp_ge[$t.p.id].processing = true;
					$("#sData", "#"+frmtb).addClass('ui-state-active');
					oper = opers.oper;
					idname = opers.id;
					// we add to pos data array the action - the name is oper
					postdata[oper] = ($.trim(postdata[$t.p.id+"_id"]) == "_empty") ? opers.addoper : opers.editoper;
					if(postdata[oper] != opers.addoper) {
						postdata[idname] = postdata[$t.p.id+"_id"];
					} else {
						// check to see if we have allredy this field in the form and if yes lieve it
						if( postdata[idname] === undefined ) { postdata[idname] = postdata[$t.p.id+"_id"]; }
					}
					delete postdata[$t.p.id+"_id"];
					postdata = $.extend(postdata,rp_ge[$t.p.id].editData,onCS);
					if($t.p.treeGrid === true)  {
						if(postdata[oper] == opers.addoper) {
						selr = $($t).jqGrid("getGridParam", 'selrow');
							var tr_par_id = $t.p.treeGridModel == 'adjacency' ? $t.p.treeReader.parent_id_field : 'parent_id';
							postdata[tr_par_id] = selr;
						}
						for(i in $t.p.treeReader){
							var itm = $t.p.treeReader[i];
							if(postdata.hasOwnProperty(itm)) {
								if(postdata[oper] == opers.addoper && i === 'parent_id_field') { continue; }
								delete postdata[itm];
					}
					}
					}

					var ajaxOptions = $.extend({
						url: rp_ge[$t.p.id].url ? rp_ge[$t.p.id].url : $($t).jqGrid('getGridParam','editurl'),
						type: rp_ge[$t.p.id].mtype,
						data: $.isFunction(rp_ge[$t.p.id].serializeEditData) ? rp_ge[$t.p.id].serializeEditData(postdata) :  postdata,
						complete:function(data,Status){
							if(Status != "success") {
							    ret[0] = false;
							    if ($.isFunction(rp_ge[$t.p.id].errorTextFormat)) {
							        ret[1] = rp_ge[$t.p.id].errorTextFormat(data);
							    } else {
							        ret[1] = "Status: '" + data.statusText + "'. Error code: " + data.status;
								}
							} else {
								var result = eval('(' + data.responseText + ')');
								//To have current status of any change on any grid
								/*if(result.anyGridChanged!=null) {
									$('#isAnyGridChanged').val(result.anyGridChanged);
				                }*/
								ret[0] = result.success;
								if(result.messages!=null){
									ret[1] = result.messages[0];
								}
								
								// data is posted successful
								// execute aftersubmit with the returned data from server
								if( $.isFunction(rp_ge[$t.p.id].afterSubmit) ) {
									ret = rp_ge[$t.p.id].afterSubmit(data,postdata);
								}
							}
							if(ret[0] === false) {
								$("#FormError>td","#"+frmtb).html(ret[1]);
								$("#FormError","#"+frmtb).show();
							} else {
								// remove some values if formattaer select or checkbox
								$.each($t.p.colModel, function(i,n){
									if(extpost[this.name] && this.formatter && this.formatter=='select') {
										try {delete extpost[this.name];} catch (e) {}
									}
								});
								postdata = $.extend(postdata,extpost);
								if($t.p.autoencode) {
									$.each(postdata,function(n,v){
										postdata[n] = $.jgrid.htmlDecode(v);
									});
								}
								rp_ge[$t.p.id].reloadAfterSubmit = rp_ge[$t.p.id].reloadAfterSubmit && $t.p.datatype != "local";
								// the action is add
								if(postdata[oper] == opers.addoper ) {
									//id processing
									// user not set the id ret[2]
									var result = eval('(' + data.responseText + ')');
									ret[2] = result.rows.id;
									if(!ret[2]) { ret[2] = $.jgrid.randId(); }
									postdata[idname] = ret[2];
									if(rp_ge[$t.p.id].closeAfterAdd) {
										if(rp_ge[$t.p.id].reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else {
											if($t.p.treeGrid === true){
												$($t).jqGrid("addChildNode",ret[2],selr,postdata );
											} else {
											$($t).jqGrid("addRowData",ret[2],postdata,p.addedrow);
											$($t).jqGrid("setSelection",ret[2]);
										}
										}
										$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
									} else if (rp_ge[$t.p.id].clearAfterAdd) {
										if(rp_ge[$t.p.id].reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else {
											if($t.p.treeGrid === true){
												$($t).jqGrid("addChildNode",ret[2],selr,postdata );
											} else {
												$($t).jqGrid("addRowData",ret[2],postdata,p.addedrow);
											}
										}
										fillData("_empty",$t,frmgr);
									} else {
										if(rp_ge[$t.p.id].reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else {
											if($t.p.treeGrid === true){
												$($t).jqGrid("addChildNode",ret[2],selr,postdata );
											} else {
												$($t).jqGrid("addRowData",ret[2],postdata,p.addedrow);
									}
										}
									}
								} else {
									// the action is update
									if(rp_ge[$t.p.id].reloadAfterSubmit) {
										$($t).trigger("reloadGrid");
										if( !rp_ge[$t.p.id].closeAfterEdit ) { setTimeout(function(){$($t).jqGrid("setSelection",postdata[idname]);},1000); }
									} else {
										if($t.p.treeGrid === true) {
											$($t).jqGrid("setTreeRow",postdata[idname],postdata);
										} else {
											$($t).jqGrid("setRowData",postdata[idname],postdata);
										}
									}
									if(rp_ge[$t.p.id].closeAfterEdit) { $.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose}); }
								}
								if($.isFunction(rp_ge[$t.p.id].afterComplete)) {
									copydata = data;
									setTimeout(function(){rp_ge[$t.p.id].afterComplete(copydata,postdata,$("#"+frmgr));copydata=null;},500);
								}
							if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
								$("#"+frmgr).data("disabled",false);
								if(rp_ge[$t.p.id]._savedData[$t.p.id+"_id"] !="_empty"){
									for(var key in rp_ge[$t.p.id]._savedData) {
										if(postdata[key]) {
											rp_ge[$t.p.id]._savedData[key] = postdata[key];
										}
									}
								}
							}
							}
							rp_ge[$t.p.id].processing=false;
							$("#sData", "#"+frmtb).removeClass('ui-state-active');
							try{$(':input:visible',"#"+frmgr)[0].focus();} catch (e){}
						}
					}, $.jgrid.ajaxOptions, rp_ge[$t.p.id].ajaxEditOptions );

					if (!ajaxOptions.url && !rp_ge[$t.p.id].useDataProxy) {
						if ($.isFunction($t.p.dataProxy)) {
							rp_ge[$t.p.id].useDataProxy = true;
						} else {
							ret[0]=false; ret[1] += " "+$.jgrid.errors.nourl;
						}
					}
					if (ret[0]) {
						if (rp_ge[$t.p.id].useDataProxy) { $t.p.dataProxy.call($t, ajaxOptions, "set_"+$t.p.id); }
						else { $.ajax(ajaxOptions); }
					}
				}
				if(ret[0] === false) {
					$("#FormError>td","#"+frmtb).html(ret[1]);
					$("#FormError","#"+frmtb).show();
					// return;
				}
			}
			function compareData(nObj, oObj ) {
				var ret = false,key;
				for (key in nObj) {
					if(nObj[key] != oObj[key]) {
						ret = true;
						break;
					}
				}
				return ret;
			}
			function setNulls() {
				$.each($t.p.colModel, function(i,n){
					if(n.editoptions && n.editoptions.NullIfEmpty === true) {
						if(postdata.hasOwnProperty(n.name) && postdata[n.name] == "") {
							postdata[n.name] = 'null';
						}
					}
				});
			}
			function checkUpdates () {
				var stat = true;
				$("#FormError","#"+frmtb).hide();
				if(rp_ge[$t.p.id].checkOnUpdate) {
					postdata = {}; extpost={};
					getFormData();
					newData = $.extend({},postdata,extpost);
					diff = compareData(newData,rp_ge[$t.p.id]._savedData);
					if(diff) {
						$("#"+frmgr).data("disabled",true);
						$(".confirm","#"+IDs.themodal).show();
						stat = false;
					}
				}
				return stat;
			}
			function restoreInline()
			{
				if (rowid !== "_empty" && typeof($t.p.savedRow) !== "undefined" && $t.p.savedRow.length > 0 && $.isFunction($.fn.jqGrid.restoreRow)) {
					for (var i=0;i<$t.p.savedRow.length;i++) {
						if ($t.p.savedRow[i].id == rowid) {
							$($t).jqGrid('restoreRow',rowid);
							break;
						}
					}
				}
			}
			function updateNav(cr,totr){
				if (cr===0) { $("#pData","#"+frmtb).addClass('ui-state-disabled'); } else { $("#pData","#"+frmtb).removeClass('ui-state-disabled'); }
				if (cr==totr) { $("#nData","#"+frmtb).addClass('ui-state-disabled'); } else { $("#nData","#"+frmtb).removeClass('ui-state-disabled'); }
			}
			function getCurrPos() {
				var rowsInGrid = $($t).jqGrid("getDataIDs"),
				selrow = $("#id_g","#"+frmtb).val(),
				pos = $.inArray(selrow,rowsInGrid);
				return [pos,rowsInGrid];
			}

			if ( $("#"+IDs.themodal).html() !== null ) {
				if(onBeforeInit) {
					showFrm = onBeforeInit($("#"+frmgr));
					if(typeof(showFrm) == "undefined") {
						showFrm = true;
					}
				}
				if(showFrm === false) { return; }
				restoreInline();
				$(".ui-jqdialog-title","#"+IDs.modalhead).html(p.caption);
				$("#FormError","#"+frmtb).hide();
				if(rp_ge[$t.p.id].topinfo) {
					$(".topinfo","#"+frmtb).html(rp_ge[$t.p.id].topinfo);
					$(".tinfo","#"+frmtb).show();
				} else {
					$(".tinfo","#"+frmtb).hide();
				}
				if(rp_ge[$t.p.id].bottominfo) {
					$(".bottominfo","#"+frmtb).html(rp_ge[$t.p.id].bottominfo);
					$(".binfo","#"+frmtb).show();
				} else {
					$(".binfo","#"+frmtb).hide();
				}
				// filldata
				fillData(rowid,$t,frmgr);
				///
				if(rowid=="_empty" || !rp_ge[$t.p.id].viewPagerButtons) {
					$("#pData, #nData","#"+frmtb).hide();
				} else {
					$("#pData, #nData","#"+frmtb).show();
				}
				if(rp_ge[$t.p.id].processing===true) {
					rp_ge[$t.p.id].processing=false;
					$("#sData", "#"+frmtb).removeClass('ui-state-active');
				}
				if($("#"+frmgr).data("disabled")===true) {
					$(".confirm","#"+IDs.themodal).hide();
					$("#"+frmgr).data("disabled",false);
				}
				if(onBeforeShow) { onBeforeShow($("#"+frmgr)); }
				$("#"+IDs.themodal).data("onClose",rp_ge[$t.p.id].onClose);
				$.jgrid.viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal, jqM: false, overlay: p.overlay, modal:p.modal});
				if(!closeovrl) {
					$(".jqmOverlay").click(function(){
						if(!checkUpdates()) { return false; }
						$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				if(onAfterShow) { onAfterShow($("#"+frmgr)); }
			} else {
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px",
				frm = $("<form name='FormPost' id='"+frmgr+"' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:"+dh+";'></form>").data("disabled",false),
				tbl = $("<table id='"+frmtb+"' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
				if(onBeforeInit) {
					showFrm = onBeforeInit($("#"+frmgr));
					if(typeof(showFrm) == "undefined") {
						showFrm = true;
					}
				}
				if(showFrm === false) { return; }
				restoreInline();
				$($t.p.colModel).each( function(i) {
					var fmto = this.formoptions;
					maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
					maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
				});
				$(frm).append(tbl);
				var flr = $("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='"+(maxCols*100)+"'></td></tr>");
				flr[0].rp = 0;
				$(tbl).append(flr);
				//topinfo
				flr = $("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='"+(maxCols*2)+"'>"+rp_ge[$t.p.id].topinfo+"</td></tr>");
				flr[0].rp = 0;
				$(tbl).append(flr);
				// set the id.
				// use carefull only to change here colproperties.
				// create data
				var rtlb = $t.p.direction == "rtl" ? true :false,
				bp = rtlb ? "nData" : "pData",
				bn = rtlb ? "pData" : "nData";
				createData(rowid,$t,tbl,maxCols);
				// buttons at footer
				var bP = "<a href='javascript:void(0)' id='"+bp+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
				bN = "<a href='javascript:void(0)' id='"+bn+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
				bS  ="<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>"+p.bAdd+"</a>",
				bC  ="<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>"+p.bCancel+"</a>";
				var bt = "<td class='EditButton ui-state-default ui-th-column'>"+bS+bC+"</td>";
				var inlineAddRow = $(tbl).find("tr[rowpos="	+ "1" + "]");
				inlineAddRow.append(bt);
				inlineAddRow.find("a#cData").remove();
				var firstColumnInInlineAddRow = $("<td class='DataTD ui-state-default ui-th-column ui-th-ltr' style='white-space:pre' role='columnheader'><div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div></td>");
				if ($t.p.multiselect){
					firstColumnInInlineAddRow  =  $("<td class='DataTD ui-state-default ui-th-column ui-th-ltr' style='white-space:pre' role='columnheader'><div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div></td><td class='DataTD ui-state-default ui-th-column ui-th-ltr' style='white-space:pre' role='columnheader'><div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div></td>");
				}
				inlineAddRow.prepend(firstColumnInInlineAddRow);
				if(maxRows >  0) {
					var sd=[];
					$.each($(tbl)[0].rows,function(i,r){
						sd[i] = r;
					});
					sd.sort(function(a,b){
						if(a.rp > b.rp) {return 1;}
						if(a.rp < b.rp) {return -1;}
						return 0;
					});
					$.each(sd, function(index, row) {
						$('tbody',tbl).append(row);
					});
				}
				p.gbox = "#gbox_"+gID;
				var cle = false;
				if(p.closeOnEscape===true){
					p.closeOnEscape = false;
					cle = true;
				}
				var tms = $("<span></span>").append(frm).append(bt);
				$("table thead", $t.grid.hDiv).append($(tbl).find(("tr")));
				if(rtlb) {
					$("#pData, #nData","#"+frmtb).css("float","right");
					$(".EditButton","#"+frmtb).css("text-align","left");
				}
				if(rp_ge[$t.p.id].topinfo) { $(".tinfo","#"+frmtb).show(); }
				if(rp_ge[$t.p.id].bottominfo) { $(".binfo","#"+frmtb).show(); }
				tms = null; bt=null;
				$("#"+IDs.themodal).keydown( function( e ) {
					var wkey = e.target;
					if ($("#"+frmgr).data("disabled")===true ) { return false; }//??
					if(rp_ge[$t.p.id].savekey[0] === true && e.which == rp_ge[$t.p.id].savekey[1]) { // save
						if(wkey.tagName != "TEXTAREA") {
							$("#sData", "#"+frmtb).trigger("click");
							return false;
						}
					}
					if(e.which === 27) {
						if(!checkUpdates()) { return false; }
						if(cle)	{ $.jgrid.hideModal(this,{gb:p.gbox,jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose}); }
						return false;
					}
					if(rp_ge[$t.p.id].navkeys[0]===true) {
						if($("#id_g","#"+frmtb).val() == "_empty") { return true; }
						if(e.which == rp_ge[$t.p.id].navkeys[1]){ //up
							$("#pData", "#"+frmtb).trigger("click");
							return false;
						}
						if(e.which == rp_ge[$t.p.id].navkeys[2]){ //down
							$("#nData", "#"+frmtb).trigger("click");
							return false;
						}
					}
				});
				if(p.checkOnUpdate) {
					$("a.ui-jqdialog-titlebar-close span","#"+IDs.themodal).removeClass("jqmClose");
					$("a.ui-jqdialog-titlebar-close","#"+IDs.themodal).unbind("click")
					.click(function(){
						if(!checkUpdates()) { return false; }
						$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				p.saveicon = $.extend([true,"left","ui-icon-plus"],p.saveicon);
				p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
				// beforeinitdata after creation of the form
				if(p.saveicon[0]===true) {
					$("#sData","#"+frmtb).addClass(p.saveicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.saveicon[2]+"'></span>");
				}
				if(p.closeicon[0]===true) {
					$("#cData","#"+frmtb).addClass(p.closeicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.closeicon[2]+"'></span>");
				}
				if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
					bS  ="<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bYes+"</a>";
					bN  ="<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bNo+"</a>";
					bC  ="<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bExit+"</a>";
					var ii, zI = p.zIndex  || 999; zI ++;
					if ($.browser.msie && $.browser.version ==6) {
						ii = '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>';
					} else { ii="";}
					$("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:"+zI+";display:none;'>&#160;"+ii+"</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(zI+1)+"'>"+p.saveData+"<br/><br/>"+bS+bN+bC+"</div>").insertAfter("#"+frmgr);
					$("#sNew","#"+IDs.themodal).click(function(){
						postIt();
						$("#"+frmgr).data("disabled",false);
						$(".confirm","#"+IDs.themodal).hide();
						return false;
					});
					$("#nNew","#"+IDs.themodal).click(function(){
						$(".confirm","#"+IDs.themodal).hide();
						$("#"+frmgr).data("disabled",false);
						setTimeout(function(){$(":input","#"+frmgr)[0].focus();},0);
						return false;
					});
					$("#cNew","#"+IDs.themodal).click(function(){
						$(".confirm","#"+IDs.themodal).hide();
						$("#"+frmgr).data("disabled",false);
						$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				// here initform - only once
				if(onInitializeForm) { onInitializeForm($("#"+frmgr)); }
				if(rowid=="_empty" || !rp_ge[$t.p.id].viewPagerButtons) { $("#pData,#nData","#"+frmtb).hide(); } else { $("#pData,#nData","#"+frmtb).show(); }
				if(onBeforeShow) { onBeforeShow($("#"+frmgr)); }
				$("#"+IDs.themodal).data("onClose",rp_ge[$t.p.id].onClose);
				$.jgrid.viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal, overlay: p.overlay,modal:p.modal});
				if(!closeovrl) {
					$(".jqmOverlay").click(function(){
						if(!checkUpdates()) { return false; }
						$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				if(onAfterShow) { onAfterShow($("#"+frmgr)); }
				$(".fm-button","#"+IDs.themodal).hover(
				   function(){$(this).addClass('ui-state-hover');},
				   function(){$(this).removeClass('ui-state-hover');}
				);
				$("#sData", "#"+frmtb).click(function(e){
					postdata = {}; extpost={};
					$("#FormError","#"+frmtb).hide();
					// all depend on ret array
					//ret[0] - succes
					//ret[1] - msg if not succes
					//ret[2] - the id  that will be set if reload after submit false
					getFormData();
					if(postdata[$t.p.id+"_id"] == "_empty")	{ postIt(); }
					else if(p.checkOnSubmit===true ) {
						newData = $.extend({},postdata,extpost);
						diff = compareData(newData,rp_ge[$t.p.id]._savedData);
						if(diff) {
							$("#"+frmgr).data("disabled",true);
							$(".confirm","#"+IDs.themodal).show();
						} else {
							postIt();
						}
					} else {
						postIt();
					}
					return false;
				});
				$("#cData", "#"+frmtb).click(function(e){
					if(!checkUpdates()) { return false; }
					$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
					return false;
				});
				$("#nData", "#"+frmtb).click(function(e){
					if(!checkUpdates()) { return false; }
					$("#FormError","#"+frmtb).hide();
					var npos = getCurrPos();
					npos[0] = parseInt(npos[0],10);
					if(npos[0] != -1 && npos[1][npos[0]+1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]]);
						}
						fillData(npos[1][npos[0]+1],$t,frmgr);
						$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]+1]);
						}
						updateNav(npos[0]+1,npos[1].length-1);
					}
					return false;
				});
				$("#pData", "#"+frmtb).click(function(e){
					if(!checkUpdates()) { return false; }
					$("#FormError","#"+frmtb).hide();
					var ppos = getCurrPos();
					if(ppos[0] != -1 && ppos[1][ppos[0]-1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]]);
						}
						fillData(ppos[1][ppos[0]-1],$t,frmgr);
						$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
						}
						updateNav(ppos[0]-1,ppos[1].length-1);
					}
					return false;
				});
			}
			var posInit =getCurrPos();
			updateNav(posInit[0],posInit[1].length-1);

		});
	}
});
})(jQuery);
