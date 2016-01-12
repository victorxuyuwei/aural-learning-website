/**
 * Everything in this website
 * 
 * 
 * @author victorxuyuwei
 */
// Global variable
var curProblems;

// Widgets

/**
 * string format
 *
 * @link http://www.cnblogs.com/taoweiji/archive/2013/08/15/3260883.html
 */
String.format = function() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for ( var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

function updateiCheck() {
    $('.checkbox input').iCheck({
        checkboxClass: 'icheckbox_flat',
        increaseArea: '20%'
    });

    $('.radio input').iCheck({
        radioClass: 'iradio_flat',
        increaseArea: '20%'
    });

    $('.radio-inline input').iCheck({
        radioClass: 'iradio_flat',
        increaseArea: '20%'
    });
}

$.ajaxSetup ({
    cache: false //close AJAX cache
});
// main page


/**
 * curInfo = {
 *      "uid":"",
 *      "name":"",
 *      "email":"",
 *      "gender":"",
 *      "info":"",
 *      "avatar:""
 *   }
 *
 * See the structure of database
 */
function showUserInfo(curInfo) {
    $("#userinfo h3").text(curInfo.name);
    var avatar = "male.png";
    if (curInfo.avatar)
        avatar = curInfo.avatar;
    if (curInfo.gender == "0")
        avatar = "female.png";
    $("#userinfo img").attr("src", "images/" + avatar);

    $("#userinfo").show();
};

$(".sideNav").click(function(){
    $("#player").remove();
    $(".sideNav").removeClass("active");
    $(this).addClass("active");
    $("#main-content").load($(this).data("target"));
    window.location.hash=$(this).data("hash");
});


/**
 * login logout signup
 */
$("#login-form").submit(function(){
    var options={
              url: "include/ajaxLogin.php?login=1",
              timeout: 1000,
              cache: false,
              type: "post",
              dataType: "json",
              data: $("#login-form").serialize(),
              success: function(data){
                  if (data.result) {
                      $("#login-form").hide();
                      showUserInfo(data.info);
                  }
                  else {
                      $("#login-button").before($('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Sorry,</strong><br>wrong username or password.</div>'));
                  }
              },
              error: function(){
                  alert("Something wrong with the server."); // need to change
              }
          };
    $.ajax(options);
    return false;
});

$("#logout").click(function(){
    var options={
              url: "include/ajaxLogin.php?logout=1",
              timeout: 1000,
              cache: false,
              dataType: "json",
              success: function(data){
                  $("#userinfo").hide();
                  $("#login-form").show();
                  $("#userinfo h3").empty();
              },
              error: function(){
                  alert("Something wrong with the server.");
              }
          };
    $.ajax(options);
    return false;
});
$("#signup-button").click(function(){
    $("#signup-form").submit();
})
$("#signup-form").submit(function() {
    var options={
              url: "include/ajaxSignUp.php",
              timeout: 1000,
              cache: false,
              type: "post",
              dataType: "json",
              data: $("#signup-form").serialize(),
              success: function(data){
                  if (data.result) {
                      $("#SignupMod").modal("hide")
                      $("#login-form").hide();
                      showUserInfo(data.info);
                  }
                  else alert(data.error);
              },
              error: function(){
                  alert("Something wrong with the server.");
              }
          };
    $.ajax(options);   
    return false;   
});


// exams and problems list page 

/**
 * gen list-group-item of problem from json
 *
 * @param idx integer index of problem
 * @param data jsonObject description of a single problem
 * @return jquery DOM list-group-item
 */

function genItem(idx, data) {
    var conStr = '<li type="button" class="list-group-item">';
    conStr += '<p class="problem-desc">'+data.description+'</p>';
    var typ="radio";
    if (data.type == "choice") 
        $.each(data.options,function(i,option){
            var idOp = String.fromCharCode("A".charCodeAt()+i);
            conStr += String.format(
                    '<div class="{0}"><input type="{0}" name="q{1}" value="{2}" id="chq{1}{2}"><label for="chq{1}{2}">&nbsp;{2}. {3}</label></div>',
                    typ, idx, idOp, option
                );
        });
    if (data.type == "blank")
        conStr += String.format(
                '<div class="form-group has-feedback"  style="width:30%">'+
                '<label class="control-label"></label>'+
                '<input type="text" class="form-control" name="q{0}"></div>',
                idx
            );

    conStr += '</li>';
      // alert(conStr);
    return $(conStr);
};

function calcAnsStatic() {
    if (curProblems.length == 0) return false;
    var all = 0;
    var right = 0;
    $.each(curProblems.data, function(idx, problem) {
        //console.log("%s <===> %s %s", problem.answer, $('input[name="q'+ idx +'"]:checked').val().trim(), 'input[name="q'+ idx +'"]:checked');
        var cur = $('input[name="q'+ idx +'"]' + (problem.type=="choice"?':checked':''));
        // if (problem.type=="choice") cur += ':checked';
        if (cur.length > 0 && problem.answer == cur.val().trim())
            right++;
        all++;
    });
    return [right, all];
};

function ajaxCalcAns() {
    // nothing here,
    // and to be continue
}

$("#showAnalysis").click(function() {
    $('.anslysis-wrap').children().unwrap();
    $('.analysis').remove();
    $('#plist li div').removeClass('has-success');
    $('#plist li div').removeClass('has-error');
    $.each(curProblems.data, function(idx, problem){
        var tarStr = '';
        var cur = $('input[name="q'+ idx +'"]' + (problem.type=="choice"?':checked':''));


        if (problem.type == "choice") {
            var cidx = problem.answer.charCodeAt() - "A".charCodeAt(); //index of right options
            var cbox = $('#plist li:eq(' + idx + ') label:eq(' + cidx + ')'); //select right option of current problem 
            
            if (cur.length > 0 && cur.val().trim() == problem.answer) {
                cbox.parent().wrap('<div class="has-success analysis-wrap"></div>');
                cbox.append('<span class="glyphicon glyphicon-ok analysis" aria-hidden="true"></span>')
            }
            else { 
                cbox.parent().wrap('<div class="has-error analysis-wrap"></div>');
                cbox.append('<span class="glyphicon glyphicon-remove analysis" aria-hidden="true"></span>')
            }
        }
        if (problem.type == "blank"){
            var cbox = $('#plist li:eq(' + idx + ') input');
            if (cur.length > 0 && cur.val().trim() == problem.answer) {
                cbox.after('<span class="glyphicon glyphicon-ok form-control-feedback analysis" aria-hidden="true"></span>');
                cbox.parent().addClass('has-success');
            }
            else {
                cbox.after('<span class="glyphicon glyphicon-remove form-control-feedback analysis" aria-hidden="true"></span>');
                cbox.parent().addClass('has-error');
            }
            cbox.prev().html(problem.answer)
        }

        $('#plist li:eq(' + idx + ') p').after(String.format(
            '<div class="alert alert-info analysis" role="alert">{0}</div>',
            problem.analysis
        ));
    });
    $("#ResultMod").modal('hide');
});

function checkedUpdate() {
    // console.log($("#plist input").serialize());
    var ret = calcAnsStatic();
    // $('#ResultMod .modal-body').html(String.format('<h1><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>&nbsp;{0}</h1><h1><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;{1}</h1>', ret[0], ret[1]-ret[0]));
    var str = '<div class="alert alert-info text-center" role="alert"><h3><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>&nbsp;{0}'+
     '&nbsp;&nbsp;'+
    '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;{1}</h3></div>'+
    '<div class="progress">'+
    '<div class="progress-bar progress-bar-success progress-bar-striped text-left" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: {2}">'+
    'ACC: {2}'+
    '</div>'+
    '</div>';
    var acc = (ret[0]*100.0/ret[1]).toFixed(2) + '%';
    // $('#ResultMod .modal-body').addClass('text-center');
    $('#ResultMod .modal-body').html(String.format(str, ret[0], ret[1]-ret[0], acc));
}

$("#main-content").delegate(".toProblems", "click", function(){

    $("#main-content").html('<div class="panel-heading"><h3 class="panel-title">Problems</h3></div>'+
                            '<ul class="list-group" id="plist"></ul>');
    $("#main-content").append($('<div class="panel-footer text-right"><button type="button" class="btn btn-primary" id="toCheck">Submit</button></div>'));

    $("#toCheck").click(function(){
        checkedUpdate();
        $("#ResultMod").modal('show');
    });

    $.ajax({
        url: $(this).data("target"),
        timeout: 1000,
        cache: false,
        dataType: "json",
        success: function(data){
                    // alert(JSON.stringify(data));
                    curProblems = data;
                    var tar = $("#player");
                    if (tar.length == 0)
                        $("#index").before('<li class="list-group-item" id="player"></li>');

                    $("#player").html(String.format('<object type="application/x-shockwave-flash" data="dewplayer.swf?mp3=audio/{0}" width="200" height="20" id="dewplayer"><param name="wmode" value="transparent" /><param name="movie" value="dewplayer.swf?mp3=audio/{0}" /></object>',data.src));
                    $.each(data.data, function(i, obj){
                        // alert(JSON.stringify(obj));
                        $("#plist").append(genItem(i, obj))
                    });
                    updateiCheck();
                    // $("#main-content").
                },
        error: function(){
                    alert("Something wrong with the server."); // need to change
                }
    });
});


/**
 * Init operations
 */
$.ajax({
    url: "include/ajaxLogin.php",
    timeout: 1000,
    cache: false,
    dataType: "json",
    success: function(data){
        if (data.result) {
            $("#login-form").hide();
            showUserInfo(data.info);
        }
    }              
});

var pageTarget = $(".sideNav[data-hash=\""+window.location.hash.slice(1) +"\"]");
//alert(window.location.hash);
if (pageTarget.length > 0) {
    pageTarget.click();
}
else {
    $("#index").click();
}

updateiCheck();