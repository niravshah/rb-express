var vFirstLogin=new Vue({el:"#login",data:{messages:[],username:"",password:"",code:""},computed:{isValid:function(){return!this.errors.any()&&""!=this.username&&""!=this.password&&""!=this.code}},methods:{onSubmit:function(){if(!this.errors.any()){var e={username:this.username,password:this.password,mobileCode:this.code};this.$http.post("/api/auth/first-login",e).then(function(e){var s=e.body.token;if(s){var t=e.body.email;localStorage.setItem("token",s),localStorage.setItem("currentUser",JSON.stringify({email:t,username:this.username,token:s,sid:e.body.sid})),document.location.href="/reset-password"}else this.messages.push({type:"error",message:"Username, password or code incorrect"})},function(e){404==e.status?this.messages.push({type:"error",message:"Page Not Found: "+e.url}):this.messages.push({type:"error",message:e.message})})}}}});