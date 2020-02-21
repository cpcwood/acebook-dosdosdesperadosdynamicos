(function(){var t=this;(function(){(function(){var n=[].slice;this.ActionCable={INTERNAL:{message_types:{welcome:"welcome",ping:"ping",confirmation:"confirm_subscription",rejection:"reject_subscription"},default_mount_path:"/cable",protocols:["actioncable-v1-json","actioncable-unsupported"]},WebSocket:window.WebSocket,logger:window.console,createConsumer:function(t){var e;return null==t&&(t=null!=(e=this.getConfig("url"))?e:this.INTERNAL.default_mount_path),new a.Consumer(this.createWebSocketURL(t))},getConfig:function(t){var e;return null!=(e=document.head.querySelector("meta[name='action-cable-"+t+"']"))?e.getAttribute("content"):void 0},createWebSocketURL:function(t){var e;return t&&!/^wss?:/i.test(t)?((e=document.createElement("a")).href=t,e.href=e.href,e.protocol=e.protocol.replace("http","ws"),e.href):t},startDebugging:function(){return this.debugging=!0},stopDebugging:function(){return this.debugging=null},log:function(){var t,e;if(t=1<=arguments.length?n.call(arguments,0):[],this.debugging)return t.push(Date.now()),(e=this.logger).log.apply(e,["[ActionCable]"].concat(n.call(t)))}}}).call(this)}).call(t);var a=t.ActionCable;(function(){(function(){var o=function(t,e){return function(){return t.apply(e,arguments)}};a.ConnectionMonitor=function(){function t(t){this.connection=t,this.visibilityDidChange=o(this.visibilityDidChange,this),this.reconnectAttempts=0}var i,e,n;return t.pollInterval={min:3,max:30},t.staleThreshold=6,t.prototype.start=function(){if(!this.isRunning())return this.startedAt=e(),delete this.stoppedAt,this.startPolling(),document.addEventListener("visibilitychange",this.visibilityDidChange),a.log("ConnectionMonitor started. pollInterval = "+this.getPollInterval()+" ms")},t.prototype.stop=function(){if(this.isRunning())return this.stoppedAt=e(),this.stopPolling(),document.removeEventListener("visibilitychange",this.visibilityDidChange),a.log("ConnectionMonitor stopped")},t.prototype.isRunning=function(){return null!=this.startedAt&&null==this.stoppedAt},t.prototype.recordPing=function(){return this.pingedAt=e()},t.prototype.recordConnect=function(){return this.reconnectAttempts=0,this.recordPing(),delete this.disconnectedAt,a.log("ConnectionMonitor recorded connect")},t.prototype.recordDisconnect=function(){return this.disconnectedAt=e(),a.log("ConnectionMonitor recorded disconnect")},t.prototype.startPolling=function(){return this.stopPolling(),this.poll()},t.prototype.stopPolling=function(){return clearTimeout(this.pollTimeout)},t.prototype.poll=function(){return this.pollTimeout=setTimeout((t=this,function(){return t.reconnectIfStale(),t.poll()}),this.getPollInterval());var t},t.prototype.getPollInterval=function(){var t,e,n,o;return n=(o=this.constructor.pollInterval).min,e=o.max,t=5*Math.log(this.reconnectAttempts+1),Math.round(1e3*i(t,n,e))},t.prototype.reconnectIfStale=function(){if(this.connectionIsStale())return a.log("ConnectionMonitor detected stale connection. reconnectAttempts = "+this.reconnectAttempts+", pollInterval = "+this.getPollInterval()+" ms, time disconnected = "+n(this.disconnectedAt)+" s, stale threshold = "+this.constructor.staleThreshold+" s"),this.reconnectAttempts++,this.disconnectedRecently()?a.log("ConnectionMonitor skipping reopening recent disconnect"):(a.log("ConnectionMonitor reopening"),this.connection.reopen())},t.prototype.connectionIsStale=function(){var t;return n(null!=(t=this.pingedAt)?t:this.startedAt)>this.constructor.staleThreshold},t.prototype.disconnectedRecently=function(){return this.disconnectedAt&&n(this.disconnectedAt)<this.constructor.staleThreshold},t.prototype.visibilityDidChange=function(){if("visible"===document.visibilityState)return setTimeout((t=this,function(){if(t.connectionIsStale()||!t.connection.isOpen())return a.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = "+document.visibilityState),t.connection.reopen()}),200);var t},e=function(){return(new Date).getTime()},n=function(t){return(e()-t)/1e3},i=function(t,e,n){return Math.max(e,Math.min(n,t))},t}()}).call(this),function(){var t,i,e,n,o,s=[].slice,r=function(t,e){return function(){return t.apply(e,arguments)}},c=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1};n=a.INTERNAL,i=n.message_types,e=n.protocols,o=2<=e.length?s.call(e,0,t=e.length-1):(t=0,[]),e[t++],a.Connection=function(){function t(t){this.consumer=t,this.open=r(this.open,this),this.subscriptions=this.consumer.subscriptions,this.monitor=new a.ConnectionMonitor(this),this.disconnected=!0}return t.reopenDelay=500,t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){return this.isActive()?(a.log("Attempted to open WebSocket, but existing socket is "+this.getState()),!1):(a.log("Opening WebSocket, current state is "+this.getState()+", subprotocols: "+e),null!=this.webSocket&&this.uninstallEventHandlers(),this.webSocket=new a.WebSocket(this.consumer.url,e),this.installEventHandlers(),this.monitor.start(),!0)},t.prototype.close=function(t){var e;if((null!=t?t:{allowReconnect:!0}).allowReconnect||this.monitor.stop(),this.isActive())return null!=(e=this.webSocket)?e.close():void 0},t.prototype.reopen=function(){var t;if(a.log("Reopening WebSocket, current state is "+this.getState()),!this.isActive())return this.open();try{return this.close()}catch(e){return t=e,a.log("Failed to reopen WebSocket",t)}finally{a.log("Reopening WebSocket in "+this.constructor.reopenDelay+"ms"),setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.getProtocol=function(){var t;return null!=(t=this.webSocket)?t.protocol:void 0},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isActive=function(){return this.isState("open","connecting")},t.prototype.isProtocolSupported=function(){var t;return t=this.getProtocol(),0<=c.call(o,t)},t.prototype.isState=function(){var t,e;return e=1<=arguments.length?s.call(arguments,0):[],t=this.getState(),0<=c.call(e,t)},t.prototype.getState=function(){var t,e;for(e in WebSocket)if(WebSocket[e]===(null!=(t=this.webSocket)?t.readyState:void 0))return e.toLowerCase();return null},t.prototype.installEventHandlers=function(){var t,e;for(t in this.events)e=this.events[t].bind(this),this.webSocket["on"+t]=e},t.prototype.uninstallEventHandlers=function(){var t;for(t in this.events)this.webSocket["on"+t]=function(){}},t.prototype.events={message:function(t){var e,n,o;if(this.isProtocolSupported())switch(e=(o=JSON.parse(t.data)).identifier,n=o.message,o.type){case i.welcome:return this.monitor.recordConnect(),this.subscriptions.reload();case i.ping:return this.monitor.recordPing();case i.confirmation:return this.subscriptions.notify(e,"connected");case i.rejection:return this.subscriptions.reject(e);default:return this.subscriptions.notify(e,"received",n)}},open:function(){if(a.log("WebSocket onopen event, using '"+this.getProtocol()+"' subprotocol"),this.disconnected=!1,!this.isProtocolSupported())return a.log("Protocol is unsupported. Stopping monitor and disconnecting."),this.close({allowReconnect:!1})},close:function(){if(a.log("WebSocket onclose event"),!this.disconnected)return this.disconnected=!0,this.monitor.recordDisconnect(),this.subscriptions.notifyAll("disconnected",{willAttemptReconnect:this.monitor.isRunning()})},error:function(){return a.log("WebSocket onerror event")}},t}()}.call(this),function(){var l=[].slice;a.Subscriptions=function(){function t(t){this.consumer=t,this.subscriptions=[]}return t.prototype.create=function(t,e){var n,o,i;return o="object"==typeof(n=t)?n:{channel:n},i=new a.Subscription(this.consumer,o,e),this.add(i)},t.prototype.add=function(t){return this.subscriptions.push(t),this.consumer.ensureActiveConnection(),this.notify(t,"initialized"),this.sendCommand(t,"subscribe"),t},t.prototype.remove=function(t){return this.forget(t),this.findAll(t.identifier).length||this.sendCommand(t,"unsubscribe"),t},t.prototype.reject=function(t){var e,n,o,i,s;for(i=[],e=0,n=(o=this.findAll(t)).length;e<n;e++)s=o[e],this.forget(s),this.notify(s,"rejected"),i.push(s);return i},t.prototype.forget=function(i){var s;return this.subscriptions=function(){var t,e,n,o;for(o=[],t=0,e=(n=this.subscriptions).length;t<e;t++)(s=n[t])!==i&&o.push(s);return o}.call(this),i},t.prototype.findAll=function(t){var e,n,o,i,s;for(i=[],e=0,n=(o=this.subscriptions).length;e<n;e++)(s=o[e]).identifier===t&&i.push(s);return i},t.prototype.reload=function(){var t,e,n,o,i;for(o=[],t=0,e=(n=this.subscriptions).length;t<e;t++)i=n[t],o.push(this.sendCommand(i,"subscribe"));return o},t.prototype.notifyAll=function(t){var e,n,o,i,s,r,c;for(n=t,e=2<=arguments.length?l.call(arguments,1):[],r=[],o=0,i=(s=this.subscriptions).length;o<i;o++)c=s[o],r.push(this.notify.apply(this,[c,n].concat(l.call(e))));return r},t.prototype.notify=function(t,e){var n,o,i,s,r,c,a;for(c=t,o=e,n=3<=arguments.length?l.call(arguments,2):[],r=[],i=0,s=(a="string"==typeof c?this.findAll(c):[c]).length;i<s;i++)c=a[i],r.push("function"==typeof c[o]?c[o].apply(c,n):void 0);return r},t.prototype.sendCommand=function(t,e){var n;return n=t.identifier,this.consumer.send({command:e,identifier:n})},t}()}.call(this),function(){a.Subscription=function(){function t(t,e,n){this.consumer=t,null==e&&(e={}),this.identifier=JSON.stringify(e),o(this,n)}var o;return t.prototype.perform=function(t,e){return null==e&&(e={}),e.action=t,this.send(e)},t.prototype.send=function(t){return this.consumer.send({command:"message",identifier:this.identifier,data:JSON.stringify(t)})},t.prototype.unsubscribe=function(){return this.consumer.subscriptions.remove(this)},o=function(t,e){var n,o;if(null!=e)for(n in e)o=e[n],t[n]=o;return t},t}()}.call(this),function(){a.Consumer=function(){function t(t){this.url=t,this.subscriptions=new a.Subscriptions(this),this.connection=new a.Connection(this)}return t.prototype.send=function(t){return this.connection.send(t)},t.prototype.connect=function(){return this.connection.open()},t.prototype.disconnect=function(){return this.connection.close({allowReconnect:!1})},t.prototype.ensureActiveConnection=function(){if(!this.connection.isActive())return this.connection.open()},t}()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=a:"function"==typeof define&&define.amd&&define(a)}).call(this),function(){this.App||(this.App={}),App.cable=ActionCable.createConsumer()}.call(this),this.App={},App.cable=ActionCable.createConsumer(),convoSubs=[],window.addEventListener("load",function(){var i=function i(t,e){var n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&e(n.responseText)},n.open("GET",t,!0),n.send(null)};startChatBtn=document.querySelector(".open-chat"),startChatBtn&&(startChatClickHandler=function(){i("/users/index.json",function(t){var e=JSON.parse(t),n=document.querySelector(".chat-list");n.innerHTML="",e.forEach(function(t){var e="<div class='open-convo-container'>\n            <button class='open-convo-btn' data_user_id='"+t.id+"' data_username='"+t.username+"'>"+t.username+"</button>\n          </div>\n          ";n.insertAdjacentHTML("beforeend",e)}),openConvoClickHandler=function(){var l=this.getAttribute("data_user_id"),u=this.getAttribute("data_username"),t=this.parentNode.parentNode.parentNode.parentNode.parentNode,e="<div class='conversation-container' id='"+u+"'>\n              <button class='conversation-btn'>"+u+"</button>\n              <div class='conversation'> \n                <div class='actions-container'>\n                  <textarea class='message-text'></textarea>\n                  <button class='send-message' data_to_user_id='"+l+"'>Send Message</button>\n                </div>\n                <div class='messages-container'>\n\n                </div>\n              </div>\n            </div>\n          ";t.insertAdjacentHTML("beforeend",e),showConvo=function(){this.parentNode.querySelector(".conversation").style.display="flex",this.removeEventListener("click",showConvo),this.addEventListener("click",hideConvo)},hideConvo=function(){this.parentNode.querySelector(".conversation").style.display="none",this.removeEventListener("click",hideConvo),this.addEventListener("click",showConvo)},conversationBtns=document.getElementsByClassName("conversation-btn");for(var n=0;n<conversationBtns.length;n++)conversationBtns[n].addEventListener("click",hideConvo);i("/conversation?to_user_id="+l,function(t){var e=JSON.parse(t);console.log(e);var n=JSON.parse(e[1]),o=e[0].convo_id,i=document.querySelector("#"+u);console.log("test"),console.log(i);var s=i.querySelector(".send-message");console.log(s),s.setAttribute("data_convo_id",o);var r=i.querySelector(".messages-container");n.forEach(function(t){if(0==t.id)var e="<div class='no-message message'>\n                  "+t.message_content+"\n                </div>\n                ";else{if(t.sender_id_fk==l)var n="message-recieved";else n="message-sent";e="<div class='"+n+" message'>\n                    <div class='message-time'> "+new Date(t.created_at).toUTCString()+" </div>\n                    <div class='message-content'> "+t.message_content+" </div>\n                  </div>\n                "}r.insertAdjacentHTML("beforeend",e),r.scrollTop=r.scrollHeight});var c=App.cable.subscriptions.create({channel:"MessagesChannel",convo_id:o},{received:function a(t){if(t.from_user==l)var e="message-recieved";else e="message-sent";var n="<div class='"+e+" message'>\n                    <div class='message-time'> "+new Date(t.created_at).toUTCString()+" </div>\n                    <div class='message-content'> "+t.content+" </div>\n                  </div>\n                ";r.insertAdjacentHTML("beforeend",n),r.scrollTop=r.scrollHeight}});convoSubs.push(c)});var c=function c(){var t=this.getAttribute("data_to_user_id"),e=this.getAttribute("data_convo_id"),n=this.parentNode.querySelector(".message-text"),o=n.value;n.value="";var i={message:{convo_id:e,to_user:t,"message-content":o}};$.ajax({url:"/message",type:"POST",beforeSend:function s(t){t.setRequestHeader("X-CSRF-Token",$('meta[name="csrf-token"]').attr("content"))},data:JSON.stringify(i),success:function r(){console.log("yay")}})},o=document.getElementsByClassName("send-message");for(n=0;n<o.length;n++)o[n].addEventListener("click",c,!1)},openConvoObjs=document.getElementsByClassName("open-convo-btn");for(var o=0;o<openConvoObjs.length;o++)openConvoObjs[o].addEventListener("click",openConvoClickHandler)});var t=document.querySelector(".chat-list-container");t.style.display="block",this.removeEventListener("click",startChatClickHandler),hideChatList=function(){t.style.display="none",startChatBtn.removeEventListener("click",hideChatList),startChatBtn.addEventListener("click",startChatClickHandler)},this.addEventListener("click",hideChatList)},startChatBtn.addEventListener("click",startChatClickHandler))});