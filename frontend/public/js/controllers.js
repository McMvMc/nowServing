var mp4Controllers=angular.module("mp4Controllers",["720kb.datepicker","ngResource","ngDialog"]),NEW_REQUEST=0,IN_PROGRESS=1,COMPLETED=3,DECLINED=2,homeurl="http://localhost:8080",curSPID="";mp4Controllers.controller("HomeCtrl",["$scope","$http","$resource","ngDialog",function($scope,$http,$resource,ngDialog){}]).controller("PortfolioCtrl",["$scope","$http","service","user","$routeParams","ngDialog",function($scope,$http,service,user,$routeParams,ngDialog){var SPID=$routeParams.id;$scope.reload=function(){user.get($routeParams.id).success(function(data,status,headers,config){$scope.user=data.data,console.log($scope.user),$scope.servicesid=$scope.user.services,$scope.services=[],angular.forEach($scope.servicesid,function(i,key){service.get(i).then(function(res){var serv=res.data.data;console.log(serv),$scope.services.push(serv),console.log($scope.services)})},$scope.services)}).error(function(data,status,headers,config){console.log(data)})},$scope.sendRequest=function(i){$scope.curService=$scope.services[i],console.log("curService"),console.log($scope.curService),$scope.dialog=ngDialog.open({template:"./partials/newRequest.html",className:"ngdialog-theme-default request-dialog-width",controller:"NewRequestCtrl",scope:$scope})},$scope.showEdit=function(){return console.log("showEdit: cur / SP"),console.log(curSPID),console.log(SPID),curSPID==SPID?!0:!1},$scope.editService=function(i){console.log("show edit service!"),$scope.oldservice=$scope.services[i],$scope.dialog=ngDialog.open({template:"./partials/editService.html",className:"ngdialog-theme-default request-dialog-width",controller:"EditServiceCtrl",scope:$scope})},$scope.$watch("curSPID",function(){$scope.showEdit()}),$scope.reload()}]).controller("EditServiceCtrl",["$scope","$http","service","$routeParams","user","$route",function($scope,$http,service,$routeParams,user,$route){$scope.service=angular.copy($scope.oldservice),$scope.updateService=function(){service.update($scope.service._id,$scope.service,function(data){$scope.reload(),$scope.dialog.close()})}}]).controller("EditPortfolioCtrl",["$scope","$http","$resource","$routeParams","user","$route",function($scope,$http,$resource,$routeParams,user,$route){user.get($routeParams.id).then(function(data){$scope.user=data.data.data,console.log($scope.user),$scope.businessName=$scope.user.businessName,$scope.intro=$scope.user.intro,$scope.email=$scope.user.local.email}),$scope.updateUsername=function(data){sendData={username:data},user.update($routeParams.id,sendData,function(data){$route.reload()})},$scope.updateIntro=function(data){sendData={intro:data},user.update($routeParams.id,sendData,function(data){$route.reload()})},$scope.updateBusinessName=function(data){sendData={businessName:data},user.update($routeParams.id,sendData,function(data){$route.reload()})},$scope.updateEmail=function(data){sendData={local:{email:data,password:$scope.user.local.password}},user.update($routeParams.id,sendData,function(data){$route.reload()})}}]).controller("QueueCtrl",["$scope","$http","request","$routeParams","user","ngDialog","$location",function($scope,$http,request,$routeParams,user,ngDialog,$location){$scope.curType=NEW_REQUEST,$scope.sortBy="+";var SPID=$routeParams.id,reqids=[];[].slice.call(document.querySelectorAll(".tabs")).forEach(function(el){new CBPFWTabs(el)}),$scope.setType=function(type){$scope.curType=type,$scope.reload(),console.log("query for type: "+$scope.curType)},$scope.reload=function(){console.log("reload"),$scope.SP,user.get(SPID).then(function(res){console.log("got data"),$scope.SP=res.data.data,console.log($scope.SP),console.log("get req type: "+$scope.curType),$scope.curType==NEW_REQUEST?reqids=$scope.SP["new"]:$scope.curType==IN_PROGRESS?reqids=$scope.SP.accepted:$scope.curType==DECLINED?reqids=$scope.SP.rejected:$scope.curType==COMPLETED&&(reqids=$scope.SP.completed),console.log(reqids),$scope.tasks=[],angular.forEach(reqids,function(i,key){request.get(i).then(function(res){var req=res.data.data;console.log(req),$scope.tasks.push(req)})},$scope.tasks)})},$scope.seeDetail=function(i){var ID=$scope.tasks[i]._id;console.log("id is: "+ID),$scope.req=$scope.tasks[i],$scope.curAccept=$scope.req.acceptedTime,$scope.dialog=ngDialog.open({template:"./partials/requestDetail.html",className:"ngdialog-theme-default request-dialog-width",controller:"DetailCtrl",scope:$scope})},$scope.showAddService=function(){console.log("add service modal"),$scope.dialog=ngDialog.open({template:"./partials/newService.html",className:"ngdialog-theme-default request-dialog-width",controller:"AddServiceCtrl",scope:$scope})},$scope.reload()}]).controller("AddServiceCtrl",["$scope","$http","service","$routeParams","user",function($scope,$http,service,$routeParams,user){var SPID=$routeParams.id;$scope.newService={userID:SPID,availability:"",serviceName:"",description:""},$scope.addService=function(){console.log("adding service"),console.log($scope.newService),service.post(SPID,$scope.newService,function(res){console.log(res),$scope.dialog.close()})}}]).controller("DetailCtrl",["$scope","$http","request","$routeParams","user",function($scope,$http,request,$routeParams,user){$scope.acceptTime=function(i){$scope.curType==NEW_REQUEST&&($scope.curAccept[i]?$scope.curAccept[i]&&(angular.element(document.querySelector("#slot_"+i)).removeClass("selected"),$scope.curAccept[i]=!1):(angular.element(document.querySelector("#slot_"+i)).addClass("selected"),$scope.curAccept[i]=!0),console.log($scope.curAccept))},$scope.accept=function(){$scope.curType==NEW_REQUEST&&($scope.req.acceptedTime=$scope.curAccept,console.log("curAccept: "),console.log($scope.curAccept),$scope.req.status=IN_PROGRESS,console.log("update request"),console.log($scope.req),request.update($scope.req._id,$scope.req,function(data){console.log(data),$scope.reload(),$scope.dialog.close()}))},$scope.decline=function(){$scope.req.status=DECLINED,console.log("update request"),console.log($scope.req),request.update($scope.req._id,$scope.req,function(data){console.log(data),$scope.reload(),$scope.dialog.close()})},$scope.complete=function(){$scope.req.status=COMPLETED,console.log("update request"),console.log($scope.req),request.update($scope.req._id,$scope.req,function(data){console.log(data),$scope.reload(),$scope.dialog.close()})},$scope.showAcceptedTime=function(){}}]).controller("NewRequestCtrl",["$scope","$http","$routeParams","SP","request","user","$compile",function($scope,$http,$routeParams,SP,request,user,$compile){var SPID=$routeParams.id;$scope.SP,$scope.newRequest={creatorID:"",userID:SPID,message:"",service:$scope.curService._id,customerName:"",contactInfo:"",status:NEW_REQUEST,proposedTime:[],acceptedTime:[],createdTime:Date.now()},$scope.reload=function(){console.log("reload"),user.get(SPID).then(function(res){console.log("got data"),$scope.SP=res.data.data,console.log($scope.SP)})},$scope.sendRequest=function(){console.log("sending request"),console.log($scope.newRequest),request.post(SPID,$scope.newRequest,function(data){console.log("sent request"),console.log(data),$scope.dialog.close()})},$scope.newInputField=function(i){var myEl=angular.element(document.querySelector("#input_"+i));if(myEl.attr("readonly"),console.log("input: "+i),myEl.attr("readonly")){var j=i+1;myEl.attr("readonly",!1);var newInput='<div class="row" id="inputdiv_'+j+'"><input id="input_'+j+'" ng-click="newInputField('+j+')" readonly="true"></div>',content=$compile(newInput)($scope);angular.element(document.querySelector("#inputdiv_"+i)).after(content)}},$scope.reload()}]).controller("loginCtrl",["$scope","$http","$resource","SP","user","$location",function($scope,$http,$resource,SP,user,$location){$scope.password,$scope.email,$scope.login=function(){$http({method:"POST",url:homeurl+"/login",data:$.param({email:$scope.email,password:$scope.password}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(data,status,headers,config){console.log($scope.setUser(data.data)),$scope.dialog.close(),$location.path("/user/"+data.data._id)}).error(function(data,status,headers,config){console.log("data: "+data),console.log("status: "+status),console.log("headers: "+headers),$scope.dialog.close()})}}]).controller("signUpCtrl",["$scope","$http","$resource","SP","user","$location",function($scope,$http,$resource,SP,user,$location){$scope.password,$scope.email,$scope.username,$scope.businessName,$scope.signup=function(){$http({method:"POST",url:homeurl+"/signup",data:$.param({email:$scope.email,password:$scope.password,username:$scope.username,businessName:$scope.businessName}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(data,status,headers,config){console.log(data.data._id),$scope.getCurUser(),$scope.dialog.close(),$location.path("/user/"+data.data._id)}).error(function(data,status,headers,config){console.log("data: "+data),console.log("status: "+status),console.log("headers: "+headers),$scope.dialog.close()})}}]).controller("TopbarCtrl",["$scope","$http","$resource","ngDialog","SP","$location",function($scope,$http,$resource,ngDialog,SP,$location){$scope.curUser=null,$scope.showLogin=function(){$scope.dialog=ngDialog.open({template:"./partials/login.html",className:"ngdialog-theme-default",controller:"loginCtrl",scope:$scope})},$scope.showSignup=function(){$scope.dialog=ngDialog.open({template:"./partials/signup.html",className:"ngdialog-theme-default",controller:"signUpCtrl",scope:$scope})},$scope.viewMyQueue=function(){var url="/user/";$scope.curUser?(console.log(url+$scope.curUser._id),$location.path(url+$scope.curUser._id)):$scope.showLogin()},$scope.logout=function(){$http({method:"GET",url:homeurl+"/logout",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(data,status,headers,config){console.log("logged out"),$scope.curUser=null,curSPID=null}).error(function(data,status,headers,config){console.log("data: "+data),console.log("status: "+status),console.log("headers: "+headers)})},$scope.setUser=function(newval){$scope.curUser=newval,curSPID=newval._id,console.log("showLogout: "),console.log($scope.curUser)},$scope.showLogout=function(){return null==$scope.curUser?!1:!0},$scope.$watch("curUser",function(){$scope.showLogout()}),$scope.getCurUser=function(){console.log("try get logged in user"),$http({method:"GET",url:homeurl+"/user",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(data,status,headers,config){console.log("got logged in user"),console.log(data.data),$scope.curUser=data.data,curSPID=data.data._id}).error(function(data,status,headers,config){console.log("get user error"),console.log("data: "+data),console.log("status: "+status),console.log("headers: "+headers)})},$scope.getCurUser()}]).controller("profileController",["$scope","$http",function($scope,$http){$scope.profile=!1,$http.get("/profile").success(function(data){console.log(data),data.error||($scope.profile=!0,$scope.user=data.user)})}]).directive("topbar",function(){return{template:'\n    <div class="small-12 fixtop navbar" ng-controller = "TopbarCtrl">\n              <div class="small-12 small-centered columns">\n            <div class="float-left small-6 large-4 columns">\n                <div class="row">\n                    <div class="columns small-4"><a href="#/" class="bt round">Service</a></div>\n                    <div ng-show="showLogout()" id="MyQueueBt" class="columns small-8 end" ng-click="viewMyQueue()"><a class="bt round">My Queue</a></div>\n                </div>\n            </div>\n            <div class="float-right small-6 large-4 columns">\n                <div class="float-right row" id="SignUpLoginBt" ng-hide="showLogout()">\n                    <div class="columns small-6 float-right" ng-click="showSignup()"><a  class="bt round float-right">Signup</a></div>\n                    <div class="columns small-4 end float-right" ng-click="showLogin()"><a class="bt round float-right">Login</a></div>\n                </div>\n                <div class="float-right row" id="LogoutBt" ng-show="showLogout()">\n                    <div class="column small-7 float-right">\n                        <a class="namebt round" ng-href="#/user/portfolio/{{curUser._id}}">Hi, {{curUser.username}}</a>\n                    </div>\n                    <div class="columns small-4 end float-right" ng-click="logout()">\n                        <a class="bt round float-right">Logout</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>'}});