<%@ language=jscript codepage=65001%>
<%Response.Charset="utf-8"%>
<%var indexs = 'default'%>
<%
    var Conn, rs, jm, sql, jm, none = false,
        db = (indexs === 'default' ? '' : '../') + 'app_Data/audio_Data.mdb',  // 資料庫路徑
        pw = '42758694fght';  // 資料庫密碼

    id = String(Request.QueryString('id'));
    mes = String(Request.QueryString('me'));
    listid = String(Request.QueryString('list'));
    if (id == '') { id = '0'; }
    if (listid == '') { listid = '0'; }
    autoplay = Request.QueryString('autoplay');
    if (autoplay != 'false' && autoplay != '0') { autoplay = 'true'; }

    Conn = Server.CreateObject('ADODB.Connection');
    Conn.ConnectionString = 'Provider=Microsoft.Jet.OLEDB.4.0;Persist Security Info=False;Jet OLEDB:Database Password=' + pw + ';Data Source=' + Server.MapPath(db);
    Conn.Open();
    rs = Server.Createobject('ADODB.Recordset');
    
    if (isNaN(Number(id))) { id = '0'; }
    sql = 'Select * From audio where id=' + id;
    jm = Conn.Execute(sql);
    if (jm.eof == false) {
        sql = 'Select * From audio where id=' + id;
        rs.Open(sql, Conn, 1, 1);
        if (rs('me') == true && mes == 'me' || rs('me') == false) {
            url = String(rs('url'));
            title = String(rs('title'));
        } else {
		    none = true;
        }
        rs.Close();
    } else { none = true; }
    if (none == true) {
        url = 'null';
        title = '無';
    }
    jm = null;

    sql = 'Select * From list where ' + (!isNaN(Number(listid)) ? ('id=' + listid) : ('listName=\'' + listid + '\''));
    none = false;
    listsong = false;
    jm = Conn.Execute(sql);
    if (jm.eof == false) {
        sql = 'Select * From list where ' + (!isNaN(Number(listid)) ? ('id=' + listid) : ('listName=\'' + listid + '\''));
        rs.Open(sql, Conn, 1, 1);
        if (rs('listMe') == true && mes == 'me' || rs('listMe') == false) {
            listName = String(rs('listName'));
            listAudioID = String(rs('listAudioID'));
            listAudioAryID = listAudioID.split(',');
            listAudioTitle = String(rs('listAudioTitle'));
            listAudioAryTitle = listAudioTitle.split(',');
            for (var i = 0; i < listAudioAryID.length - 1; i++) {
                if (listAudioAryID[i] == id) { listsong = true; }　
            }
            if (listsong == false && id != '0') { none = true; }
        } else { none = true; }
        rs.Close();
    } else { none = true; }
    if (none == true) {
        listName = 'null';
        listAudioID = 'null';
        listAudioTitle = 'null';
    }
    jm = null;

    Conn.Close();
    rs = null;
    Conn = null;
%><!DOCTYPE html>
<html lang="zh-TW">
    <head>
		<meta name="robots" content="noindex; nofollow" />
		<meta charset="utf-8" />
		<title><%if (title != '無') {%><%=title.replace('\\', '')%> - <%} else if (listName != 'null') {%><%=listName.replace('_', ' ')%> - <%}%>ycsAudio</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="shortcut icon" href="icon/ya-logo-2.ico" />
		<link rel="bookmark" href="icon/ya-logo-2.ico" />
		<link rel="stylesheet" type="text/css" href="css/jquery.ycsplayer.min.css?var=20171207" />
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.ycsplayer.js?var=20170522"></script>
	</head>
	
    <body>
		<div class="title">ycsAudio</div>
		
		<div id="player" class="player"></div>
		
		<script>
		    $(function(){
		        $('#player').ycsaudio({
		            id:    '<%=id%>',
		            url:   '<%=url%>',
		            title: '<%=title%>'<%if (listName != 'null') {%>,
		            list: [
                        <%for (var i = 0; i < listAudioAryID.length - 1; i++) {%>{
                            id:    '<%=listAudioAryID[i]%>',
                            title: '<%=listAudioAryTitle[i]%>'
                        },<%}%>
                    ],
		            listData: {id: '<%=listid%>', name: '<%=listName%>'}<%}if (autoplay == 'false' || autoplay == '0') {%>,
		            autoplay: false<%}if (mes == 'me') {%>,
		            me: 'me'<%}%>
                });
		    })
		</script>
    </body>
</html>